-- ============================================================================
-- SPARS PORTAL - DATABASE MANAGEMENT SYSTEM (DBMS) SCHEMA
-- Smart India Hackathon 2026 | Problem Statement ID: SIH26044
-- Theme: Smart Automation | Category: Software | Team: SPARS
-- ============================================================================

-- Drop tables if exists for clean migration
DROP TABLE IF EXISTS sms_otp_logs;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS mous;
DROP TABLE IF EXISTS curriculum_audit;
DROP TABLE IF EXISTS users;

-- 1. USERS & AUTHENTICATION TABLE
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    role VARCHAR(20) CHECK (role IN ('student', 'industry', 'academia')),
    is_verified BOOLEAN DEFAULT FALSE,
    carrier_name VARCHAR(50),
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. SMS OTP TRANSACTION & AUDIT LOGS
CREATE TABLE sms_otp_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    mobile_number VARCHAR(15) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    delivery_status VARCHAR(20) DEFAULT 'DELIVERED',
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mobile_number) REFERENCES users(mobile_number) ON DELETE CASCADE
);

-- 3. STUDENTS & SKILL PASSPORT TABLE
CREATE TABLE students (
    student_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    college_name VARCHAR(150) NOT NULL,
    degree_branch VARCHAR(100) NOT NULL,
    batch_year INT NOT NULL,
    cgpa DECIMAL(3, 2) NOT NULL,
    readiness_index INT DEFAULT 0,
    mastered_skills TEXT NOT NULL, -- JSON array string
    learning_interests TEXT,
    passport_hash VARCHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. INTERNSHIPS & JOB OPPORTUNITIES TABLE
CREATE TABLE jobs (
    job_id VARCHAR(36) PRIMARY KEY,
    company_name VARCHAR(120) NOT NULL,
    role_title VARCHAR(120) NOT NULL,
    specialization_domain VARCHAR(80) NOT NULL,
    work_location VARCHAR(80) NOT NULL,
    internship_duration VARCHAR(40) NOT NULL,
    stipend_amount VARCHAR(50) NOT NULL,
    job_type VARCHAR(30) DEFAULT 'Internship',
    required_skills TEXT NOT NULL, -- JSON array string
    openings_count INT DEFAULT 1,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CANDIDATE APPLICATIONS & PLACEMENT STATUS
CREATE TABLE applications (
    application_id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    current_status VARCHAR(40) CHECK (current_status IN ('Applied', 'Skill Assessment Passed', 'Interview Scheduled', 'Offer Letter Issued', 'Rejected')),
    skill_match_percentage INT NOT NULL,
    offer_letter_ref VARCHAR(80),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- 6. CURRICULUM VS INDUSTRY 2026 AUDIT TABLE (ACADEMIA)
CREATE TABLE curriculum_audit (
    audit_id VARCHAR(36) PRIMARY KEY,
    subject_title VARCHAR(150) NOT NULL,
    college_syllabus_topics TEXT NOT NULL,
    industry_demanded_skills_2026 TEXT NOT NULL,
    alignment_score INT NOT NULL,
    gap_classification VARCHAR(30) CHECK (gap_classification IN ('Critical Gap', 'Moderate Gap', 'Well Aligned')),
    recommended_action TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. INSTITUTIONAL INDUSTRY MoUs & TIE-UPS
CREATE TABLE mous (
    mou_id VARCHAR(36) PRIMARY KEY,
    industry_partner VARCHAR(150) NOT NULL,
    domain_specialization VARCHAR(100) NOT NULL,
    signed_date VARCHAR(20) NOT NULL,
    valid_until VARCHAR(20) NOT NULL,
    reserved_internship_slots INT NOT NULL,
    mou_status VARCHAR(30) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

INSERT INTO users (user_id, mobile_number, role, is_verified, carrier_name) VALUES
('usr_001', '9876543210', 'student', TRUE, 'Jio 5G High-Speed'),
('usr_002', '9811223344', 'industry', TRUE, 'Airtel 5G Plus'),
('usr_003', '9899001122', 'academia', TRUE, 'Vi 4G VoLTE');

INSERT INTO students (student_id, user_id, full_name, college_name, degree_branch, batch_year, cgpa, readiness_index, mastered_skills, passport_hash) VALUES
('std_001', 'usr_001', 'Aarav Sharma', 'Delhi Technological University (DTU)', 'B.Tech Computer Science & AI', 2026, 8.84, 82, '["Python", "React", "SQL", "Git & GitHub", "REST APIs", "JavaScript"]', 'SPARS-SEC-HASH-884920');

INSERT INTO jobs (job_id, company_name, role_title, specialization_domain, work_location, internship_duration, stipend_amount, job_type, required_skills, openings_count) VALUES
('job_101', 'Bharat Tech Innovators', 'Full-Stack AI Solutions Intern', 'Software & Smart Automation', 'Bengaluru (Hybrid)', '6 Months', '₹45,000 / mo', 'Internship', '["React", "Python", "REST APIs", "Docker", "Vector DB & RAG"]', 8),
('job_102', 'Ayush MedTech Innovations', 'Healthcare Data Science Apprentice', 'Ayurveda & Health Informatics', 'New Delhi (On-site)', '3 Months', '₹38,000 / mo', 'Internship', '["Python", "SQL", "Data Analytics", "Clinical Ontologies"]', 4),
('job_103', 'NextGen Cloud Systems', 'Cloud DevOps Associate', 'Cloud Infrastructure', 'Hyderabad (Remote)', '6 Months', '₹42,000 / mo', 'Full-Time Offer', '["Docker", "Linux", "Kubernetes", "CI/CD", "Git & GitHub"]', 12);

INSERT INTO applications (application_id, job_id, student_id, current_status, skill_match_percentage, offer_letter_ref) VALUES
('app_501', 'job_101', 'std_001', 'Offer Letter Issued', 86, 'BTI/HR/2026/SPARS-881'),
('app_502', 'job_102', 'std_001', 'Interview Scheduled', 80, NULL),
('app_503', 'job_103', 'std_001', 'Skill Assessment Passed', 75, NULL);

INSERT INTO curriculum_audit (audit_id, subject_title, college_syllabus_topics, industry_demanded_skills_2026, alignment_score, gap_classification, recommended_action) VALUES
('aud_01', 'Data Structures & DBMS', 'Traditional RDBMS, SQL 92, B-Trees', 'Vector DBs (Pinecone/Milvus), RAG Graph DBs, Redis', 58, 'Critical Gap', 'Introduce hands-on lab on Vector DBs and Embedding Indexes.'),
('aud_02', 'Software Engineering & Architecture', 'Waterfall Lifecycle, Monolithic PHP/Java', 'Microservices, Docker Containers, CI/CD, GitOps', 42, 'Critical Gap', 'Mandate Docker and GitHub Actions in 3rd year mini-projects.'),
('aud_03', 'Artificial Intelligence & Models', 'Search Algorithms, Prolog, Decision Trees', 'Transformer Architectures, PyTorch, LoRA, Agentic AI', 74, 'Moderate Gap', 'Integrate PyTorch Deep Learning framework and HuggingFace APIs.');

INSERT INTO mous (mou_id, industry_partner, domain_specialization, signed_date, valid_until, reserved_internship_slots, mou_status) VALUES
('mou_01', 'Bharat Tech Innovators Pvt Ltd', 'AI & Smart Automation', 'Jan 2026', 'Jan 2029', 45, 'Active'),
('mou_02', 'Ministry of Ayush Research Consortium', 'Bio-Informatics & Formulation Mapping', 'Aug 2025', 'Aug 2028', 30, 'Active');
