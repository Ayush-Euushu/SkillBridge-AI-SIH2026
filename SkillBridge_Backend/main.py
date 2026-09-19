from fastapi import FastAPI
from pydantic import BaseModel
from database import engine
from models import Base, DBStudentProfile
from sqlalchemy.orm import Session
from fastapi import Depends
from database import SessionLocal
from pydantic import BaseModel
import sqlite3


# Helper function to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# Create the database tables automatically when the app starts
Base.metadata.create_all(bind=engine)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow your teammate's frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production you can specify domains, but "*" is great for hackathons
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==========================================
# DATA MODELS (What the incoming data looks like)
# ==========================================
class ResumeData(BaseModel):
    student_name: str
    resume_text: str

class GapAnalysisRequest(BaseModel):
    student_skills: list[str]
    target_role: str

class RecommendationRequest(BaseModel):
    missing_skills: list[str]

# Add this under your other models at the top
class MasterWorkflowRequest(BaseModel):
    student_name: str
    resume_text: str
    target_role: str


# ==========================================
# MOCK DATABASES & TAXONOMIES
# ==========================================

# Updated Taxonomy to match the frontend UI
SKILL_TAXONOMY = [
    "python", "react", "node.js", "docker", "vector db & rag", "rest apis", 
    "pytorch", "machine learning", "sql", "data analytics", "clinical ontologies", 
    "biomedical nlp", "kubernetes", "linux", "git & github", "ci/cd", 
    "c/c++", "microcontrollers", "mqtt & iot protocols"
]

# Role Blueprints mapping to the exact IDs sent by the frontend dropdown
ROLE_BLUEPRINTS = {
    # The keys here must match the frontend IDs (e.g., fullstack_ai, ai_ml_intern)
    "fullstack_ai": ["react", "python", "node.js", "docker", "vector db & rag", "rest apis"],
    "ai_ml_intern": ["python", "pytorch", "machine learning", "sql", "data analytics"],
    "ayush_informatics": ["python", "data analytics", "clinical ontologies", "sql", "biomedical nlp"],
    "cloud_devops": ["docker", "kubernetes", "linux", "git & github", "ci/cd"],
    "embedded_iot": ["c/c++", "microcontrollers", "mqtt & iot protocols", "python"]
}

# Catalog mapping missing skills to courses
LEARNING_CATALOG = {
    "docker": {"type": "Micro-course", "title": "Containerization with Docker", "url": "#"},
    "vector db & rag": {"type": "Advanced Lab", "title": "Building RAG Systems with Pinecone", "url": "#"},
    "node.js": {"type": "Course", "title": "Async Backend Architecture", "url": "#"},
    "pytorch": {"type": "Certification", "title": "Deep Learning with PyTorch", "url": "#"},
    "clinical ontologies": {"type": "Specialized", "title": "Ayush Medical Ontologies (SNOMED)", "url": "#"},
    "kubernetes": {"type": "Micro-course", "title": "Cloud Native Orchestration", "url": "#"},
    "git & github": {"type": "Foundation", "title": "Version Control Mastery", "url": "#"}
}


# ==========================================
# API ENDPOINTS (The core logic)
# ==========================================

@app.get("/")
def home():
    return {"message": "SkillBridge AI API is running!"}

# Step 1: Profile Ingestion & Skill Extraction
@app.post("/api/profiles/ingest")
def ingest_profile(data: ResumeData):
    extracted_skills = []
    
    text_lower = data.resume_text.lower()
    for skill in SKILL_TAXONOMY:
        if skill in text_lower:
            extracted_skills.append(skill)
            
    return {
        "student": data.student_name,
        "message": "Profile ingested successfully.",
        "skill_passport": extracted_skills
    }

# Step 2: Gap Analysis & Match Scoring
@app.post("/api/analysis/gap")
def analyze_skill_gap(data: GapAnalysisRequest):
    role_reqs = ROLE_BLUEPRINTS.get(data.target_role.lower())
    
    if not role_reqs:
        return {"error": f"Role '{data.target_role}' not found in our system."}
    
    missing_skills = []
    for skill in role_reqs:
        if skill not in data.student_skills:
            missing_skills.append(skill)
            
    matched_skills = len(role_reqs) - len(missing_skills)
    match_percentage = (matched_skills / len(role_reqs)) * 100
    
    return {
        "target_role": data.target_role,
        "match_score": f"{round(match_percentage)}%",
        "missing_competencies": missing_skills,
        "actionable_insight": "Translate missing competencies into actionable learning steps."
    }

# Step 3: Personalized Learning Roadmaps
@app.post("/api/recommendations/pathway")
def generate_learning_pathway(data: RecommendationRequest):
    recommended_pathway = []
    
    for skill in data.missing_skills:
        resource = LEARNING_CATALOG.get(skill.lower())
        if resource:
            resource_with_context = {"skill_to_improve": skill, **resource}
            recommended_pathway.append(resource_with_context)
            
    return {
        "message": "Custom learning roadmap generated.",
        "pathway": recommended_pathway
    }
# Add this at the very bottom of your file
@app.post("/api/workflow/complete")
def run_complete_workflow(data: MasterWorkflowRequest, db: Session = Depends(get_db)):
    # STEP 1: Assess (Extract Skills)
    extracted_skills = []
    text_lower = data.resume_text.lower()
    for skill in SKILL_TAXONOMY:
        if skill in text_lower:
            extracted_skills.append(skill)
            
    # STEP 2: Diagnose (Gap Analysis)
    role_reqs = ROLE_BLUEPRINTS.get(data.target_role.lower())
    if not role_reqs:
        return {"error": f"Role '{data.target_role}' not found."}
        
    missing_skills = []
    for skill in role_reqs:
        if skill not in extracted_skills:
            missing_skills.append(skill)
            
    matched_skills = len(role_reqs) - len(missing_skills)
    match_percentage = (matched_skills / len(role_reqs)) * 100
    formatted_score = f"{round(match_percentage)}%"
    
    # STEP 3: Improve (Learning Pathway)
    recommended_pathway = []
    for skill in missing_skills:
        resource = LEARNING_CATALOG.get(skill.lower())
        if resource:
            recommended_pathway.append({"skill_to_improve": skill, **resource})

    # --- STEP 4: SAVE TO DATABASE (NEW!) ---
    new_profile = DBStudentProfile(
        student_name=data.student_name,
        target_role=data.target_role,
        skill_passport=extracted_skills,
        match_score=formatted_score
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    # ----------------------------------------

    return {
        "database_id": new_profile.id, # Shows the unique ID assigned by SQLite!
        "student": data.student_name,
        "target_role": data.target_role,
        "skill_passport": extracted_skills,
        "match_score": formatted_score,
        "missing_competencies": missing_skills,
        "learning_roadmap": recommended_pathway,
        "status": "Saved permanently to database successfully!"
    }
@app.get("/api/profiles")
def get_all_profiles(db: Session = Depends(get_db)):
    # Query the database for every saved student profile
    profiles = db.query(DBStudentProfile).all()
    
    return {
        "total_saved_students": len(profiles),
        "profiles": profiles
    }
# Data model for the incoming SQL string
class QueryRequest(BaseModel):
    query: str

@app.post("/api/dbms/execute")
def execute_live_sql(request: QueryRequest):
    # Connect to your actual database file (make sure the name matches your DB file)
    conn = sqlite3.connect("skillbridge.db") 
    conn.row_factory = sqlite3.Row  # This allows us to get column names
    cursor = conn.cursor()
    
    try:
        cursor.execute(request.query)
        
        # If it's a SELECT query, fetch and return the data
        if request.query.strip().upper().startswith("SELECT"):
            rows = [dict(row) for row in cursor.fetchall()]
            columns = list(rows[0].keys()) if rows else []
            conn.close()
            return {"success": True, "columns": columns, "data": rows}
        else:
            # For INSERT/UPDATE/DELETE commands
            conn.commit()
            conn.close()
            return {"success": True, "message": f"Query executed successfully. Rows affected: {cursor.rowcount}"}
            
    except Exception as e:
        conn.close()
        return {"success": False, "error": str(e)}
