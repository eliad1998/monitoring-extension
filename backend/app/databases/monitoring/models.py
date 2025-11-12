from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, Enum
from sqlalchemy.orm import relationship, declarative_base
from enum import Enum as PyEnum

Base = declarative_base()

class MonitoringRuleType(PyEnum):
    REQUEST = "request"


class DBUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    # fingerprint = Column(String, unique=True, nullable=False)

    monitoring_rules = relationship("DBUserMonitoringRule", back_populates="user", cascade="all, delete-orphan")

class DBMonitoringRule(Base):
    __tablename__ = "monitoring_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    pattern = Column(String, nullable=False)
    type = Column(Enum(MonitoringRuleType), nullable=False)
    description = Column(String, nullable=True)

    user_rules = relationship("DBUserMonitoringRule", back_populates="monitoring_rule", cascade="all, delete-orphan")

class DBUserMonitoringRule(Base):
    __tablename__ = "user_monitoring_rules"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    monitoring_rule_id = Column(Integer, ForeignKey("monitoring_rules.id", ondelete="CASCADE"), nullable=False)

    user = relationship("DBUser", back_populates="monitoring_rules")
    monitoring_rule = relationship("DBMonitoringRule", back_populates="user_rules")

    __table_args__ = (UniqueConstraint("user_id", "monitoring_rule_id", name="uix_user_monitoring_rule"),)
