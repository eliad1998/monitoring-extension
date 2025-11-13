from typing import List

from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session

from app.databases.connect import get_monitoring_db
from app.databases.monitoring.models import DBUser, DBMonitoringRule, DBUserMonitoringRule, MonitoringRuleType
from app.schemas.monitoring import MonitoringRuleResponse

monitoring_router = APIRouter(
    prefix="/monitoring",
    tags=["users"]
)


@monitoring_router.get("/list_monitoring_rules/{username}")
def get_request_monitoring_rules(username: str,
                                 db: Session = Depends(get_monitoring_db)) -> List[MonitoringRuleResponse]:
    user = db.query(DBUser).filter(DBUser.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    rules = (
        db.query(DBMonitoringRule)
        .join(DBUserMonitoringRule, DBMonitoringRule.id == DBUserMonitoringRule.monitoring_rule_id)
        .filter(DBUserMonitoringRule.user_id == user.id)
        .filter(DBMonitoringRule.type == MonitoringRuleType.REQUEST)
        .all()
    )

    if not rules:
        raise HTTPException(status_code=404, detail="No monitoring rules found for this user")

    return [MonitoringRuleResponse(
        id=rule.id,
        name=rule.name,
        pattern=rule.pattern,
        type=rule.type,
        description=rule.description
    ) for rule in rules]
