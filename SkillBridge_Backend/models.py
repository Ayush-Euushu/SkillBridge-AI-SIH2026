# models.py
from sqlalchemy import Column, Integer, String, JSON
from database import Base

class DBStudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_name = Column(String, index=True)
    target_role = Column(String)
    # We will store the extracted skills list as JSON directly in the database!
    skill_passport = Column(JSON) 
    match_score = Column(String)