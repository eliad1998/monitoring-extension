from pydantic import BaseModel

from app.databases.monitoring.models import MonitoringRuleType


class MonitoringRuleResponse(BaseModel):
    id: int
    name: str
    pattern: str
    type: MonitoringRuleType
    description: str | None
