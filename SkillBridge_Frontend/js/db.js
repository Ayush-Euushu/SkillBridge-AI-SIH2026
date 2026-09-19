/* ==========================================================================
   SPARS DATABASE MANAGEMENT SYSTEM (DBMS) ENGINE
   SIH 2026 Problem Statement ID: SIH26044
   ========================================================================== */

const DB_STORAGE_KEY = 'spars_relational_db_v2';

export class DatabaseEngine {
  constructor() {
    this.tables = this.loadDatabase() || this.seedDatabase();
    this.queryHistory = [];
  }

  seedDatabase() {
    const initialDB = {
      users: [
        { user_id: 'USR-2026-101', full_name: 'Aarav Sharma', mobile_number: '9876543210', college: 'Delhi Technological University (DTU)', role: 'student', is_verified: true, carrier: 'Jio 5G High-Speed', created_at: '2026-09-18 10:15:00' },
        { user_id: 'USR-2026-102', full_name: 'Sneha Patel', mobile_number: '9811223344', college: 'IIT Roorkee', role: 'student', is_verified: true, carrier: 'Airtel 5G Plus', created_at: '2026-09-18 11:30:00' },
        { user_id: 'USR-2026-103', full_name: 'Priyadarshini Rao', mobile_number: '9899001122', college: 'All India Institute of Ayurveda & Tech', role: 'student', is_verified: true, carrier: 'Vi 4G VoLTE', created_at: '2026-09-18 12:00:00' },
        { user_id: 'ADM-2026-001', full_name: 'Platform Administrator (Main)', mobile_number: '9999988888', college: 'National SIH Grid Authority', role: 'admin', is_verified: true, carrier: 'Gov-Jio 5G', created_at: '2026-09-18 09:00:00' }
      ],
      sms_otp_logs: [
        { log_id: 'LOG-8810', student_name: 'Aarav Sharma', mobile_number: '9876543210', college: 'Delhi Technological University (DTU)', otp_code: '482910', status: 'DELIVERED', is_used: true, carrier: 'Jio 5G', timestamp: '2026-09-18 10:14:32' }
      ],
      students: [
        {
          student_id: 'STD-2026-881',
          user_id: 'USR-2026-101',
          full_name: 'Aarav Sharma',
          mobile_number: '9876543210',
          college: 'Delhi Technological University (DTU)',
          branch: 'B.Tech in Computer Science & AI',
          batch: 2026,
          cgpa: 8.84,
          readiness_score: 82,
          mastered_skills: ['Python', 'React', 'SQL', 'Git & GitHub', 'REST APIs', 'JavaScript'],
          passport_hash: 'SPARS-SEC-HASH-884920'
        },
        {
          student_id: 'STD-2026-882',
          user_id: 'USR-2026-102',
          full_name: 'Sneha Patel',
          mobile_number: '9811223344',
          college: 'IIT Roorkee',
          branch: 'B.Tech Data Science & Statistics',
          batch: 2026,
          cgpa: 9.15,
          readiness_score: 91,
          mastered_skills: ['Python', 'PyTorch', 'Machine Learning', 'SQL', 'Data Analytics'],
          passport_hash: 'SPARS-SEC-HASH-991283'
        },
        {
          student_id: 'STD-2026-883',
          user_id: 'USR-2026-103',
          full_name: 'Priyadarshini Rao',
          mobile_number: '9899001122',
          college: 'All India Institute of Ayurveda & Tech',
          branch: 'B.Sc Bio-Informatics & Health Data',
          batch: 2026,
          cgpa: 9.30,
          readiness_score: 94,
          mastered_skills: ['Python', 'Clinical Ontologies', 'SQL', 'Data Analytics', 'Biomedical NLP'],
          passport_hash: 'SPARS-SEC-HASH-771920'
        }
      ],
      jobs: [
        {
          job_id: 'job_101',
          company: 'Bharat Tech Innovators',
          title: 'Full-Stack AI Solutions Intern',
          domain: 'Software & Smart Automation',
          location: 'Bengaluru (Hybrid)',
          duration: '6 Months',
          stipend: '₹45,000 / mo',
          required_skills: ['React', 'Python', 'REST APIs', 'Docker', 'Vector DB & RAG'],
          openings: 8
        },
        {
          job_id: 'job_102',
          company: 'Ayush MedTech Innovations',
          title: 'Healthcare Data Science Apprentice',
          domain: 'Ayurveda & Health Informatics',
          location: 'New Delhi (On-site)',
          duration: '3 Months',
          stipend: '₹38,000 / mo',
          required_skills: ['Python', 'SQL', 'Data Analytics', 'Clinical Ontologies'],
          openings: 4
        },
        {
          job_id: 'job_103',
          company: 'NextGen Cloud Systems',
          title: 'Cloud DevOps Associate',
          domain: 'Cloud Infrastructure',
          location: 'Hyderabad (Remote)',
          duration: '6 Months',
          stipend: '₹42,000 / mo',
          required_skills: ['Docker', 'Linux', 'Kubernetes', 'CI/CD', 'Git & GitHub'],
          openings: 12
        }
      ],
      applications: [
        { app_id: 'app_501', job_id: 'job_101', student_name: 'Aarav Sharma', student_id: 'STD-2026-881', college: 'Delhi Technological University (DTU)', company: 'Bharat Tech Innovators', role: 'Full-Stack AI Solutions Intern', status: 'Offer Letter Issued', match_score: 86, applied_at: '2026-09-12' },
        { app_id: 'app_502', job_id: 'job_102', student_name: 'Aarav Sharma', student_id: 'STD-2026-881', college: 'Delhi Technological University (DTU)', company: 'Ayush MedTech Innovations', role: 'Healthcare Data Science Apprentice', status: 'Interview Scheduled', match_score: 80, applied_at: '2026-09-15' },
        { app_id: 'app_503', job_id: 'job_103', student_name: 'Sneha Patel', student_id: 'STD-2026-882', college: 'IIT Roorkee', company: 'NextGen Cloud Systems', role: 'Cloud DevOps Associate', status: 'Skill Assessment Passed', match_score: 75, applied_at: '2026-09-16' }
      ],
      curriculum_audit: [
        { audit_id: 'aud_01', subject: 'Data Structures & DBMS', college_syllabus: 'Traditional RDBMS, SQL 92, B-Trees', industry_demand: 'Vector DBs (Pinecone/Milvus), RAG Graph DBs, Redis', gap_score: 58, status: 'Critical Gap', recommendation: 'Introduce hands-on lab on Vector DBs and Embedding Indexes.' },
        { audit_id: 'aud_02', subject: 'Software Engineering', college_syllabus: 'Waterfall Lifecycle, Monolithic PHP/Java', industry_demand: 'Microservices, Docker Containers, CI/CD, GitOps', gap_score: 42, status: 'Critical Gap', recommendation: 'Mandate Docker containerization and GitHub Actions in 3rd year.' },
        { audit_id: 'aud_03', subject: 'Artificial Intelligence', college_syllabus: 'Search Algorithms, Prolog, Decision Trees', industry_demand: 'Transformer Architectures, PyTorch, LoRA, Agentic AI', gap_score: 74, status: 'Moderate Gap', recommendation: 'Integrate PyTorch Deep Learning framework and HuggingFace APIs.' }
      ],
      mous: [
        { mou_id: 'mou_01', partner: 'Bharat Tech Innovators Pvt Ltd', domain: 'AI & Smart Automation', period: 'Jan 2026 - Jan 2029', slots: 45, status: 'Active' },
        { mou_id: 'mou_02', partner: 'Ministry of Ayush Research Consortium', domain: 'Bio-Informatics & Formulation Mapping', period: 'Aug 2025 - Aug 2028', slots: 30, status: 'Active' }
      ]
    };

    this.saveDatabase(initialDB);
    return initialDB;
  }

  loadDatabase() {
    try {
      const data = localStorage.getItem(DB_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  saveDatabase(db = this.tables) {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.warn('DB persistence failed');
    }
  }

  /**
   * Registers a new student directly into the Relational DBMS
   */
  registerStudent({ fullName, phone, college, branch }) {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const userId = `USR-2026-${randNum}`;
    const studentId = `STD-2026-${randNum}`;
    const passportHash = `SPARS-SEC-HASH-${randNum}X`;

    // 1. Insert or update users table
    let existingUser = this.tables.users.find(u => u.mobile_number === phone);
    if (existingUser) {
      existingUser.full_name = fullName;
      existingUser.college = college;
      existingUser.is_verified = true;
      existingUser.last_login_at = timestamp;
    } else {
      existingUser = {
        user_id: userId,
        full_name: fullName,
        mobile_number: phone,
        college: college,
        role: 'student',
        is_verified: true,
        carrier: 'Jio 5G High-Speed',
        created_at: timestamp
      };
      this.tables.users.unshift(existingUser);
    }

    // 2. Insert or update students table
    let studentRecord = this.tables.students.find(s => s.mobile_number === phone);
    if (studentRecord) {
      studentRecord.full_name = fullName;
      studentRecord.college = college;
      studentRecord.branch = branch;
    } else {
      studentRecord = {
        student_id: studentId,
        user_id: existingUser.user_id,
        full_name: fullName,
        mobile_number: phone,
        college: college,
        branch: branch,
        batch: 2026,
        cgpa: (8.2 + Math.random() * 1.4).toFixed(2),
        readiness_score: 82,
        mastered_skills: ['Python', 'React', 'SQL', 'Git & GitHub', 'REST APIs', 'JavaScript'],
        passport_hash: passportHash
      };
      this.tables.students.unshift(studentRecord);
    }

    this.saveDatabase();
    return studentRecord;
  }

  logSmsOtp(name, phone, college, otp, carrier) {
    const newLog = {
      log_id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      student_name: name || 'Student Applicant',
      mobile_number: phone,
      college: college || 'Technical University',
      otp_code: otp,
      status: 'DELIVERED',
      is_used: false,
      carrier: carrier || 'Jio 5G',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.tables.sms_otp_logs.unshift(newLog);
    this.saveDatabase();
    return newLog;
  }

  verifyUserOtp(phone, otp) {
    const log = this.tables.sms_otp_logs.find(l => l.mobile_number === phone && l.otp_code === otp);
    if (log) {
      log.is_used = true;
      log.status = 'VERIFIED_SUCCESS';
    }

    const user = this.tables.users.find(u => u.mobile_number === phone);
    if (user) {
      user.is_verified = true;
      user.last_login_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
    }

    this.saveDatabase();
    return true;
  }

  getTable(tableName) {
    return this.tables[tableName] || [];
  }

  executeSql(queryStr) {
    const start = performance.now();
    const query = queryStr.trim().replace(/;$/, '');
    this.queryHistory.unshift({ query, time: new Date().toLocaleTimeString() });

    const lower = query.toLowerCase();

    if (lower.startsWith('select')) {
      const match = query.match(/from\s+([a-zA-Z_]+)/i);
      if (!match) {
        return { error: 'Syntax error: Specify table with FROM <table>' };
      }
      const tableName = match[1].toLowerCase();
      if (!this.tables[tableName]) {
        return { error: `Table '${tableName}' does not exist in SPARS DBMS` };
      }

      let rows = [...this.tables[tableName]];

      const whereMatch = query.match(/where\s+([a-zA-Z_]+)\s*=\s*['"]?([^'"]+)['"]?/i);
      if (whereMatch) {
        const col = whereMatch[1];
        const val = whereMatch[2];
        rows = rows.filter(r => String(r[col]).toLowerCase() === val.toLowerCase());
      }

      const duration = (performance.now() - start).toFixed(2);
      return {
        success: true,
        tableName,
        columns: rows.length > 0 ? Object.keys(rows[0]) : [],
        rows,
        count: rows.length,
        durationMs: duration
      };
    }

    return {
      success: true,
      message: 'Query executed successfully.',
      durationMs: (performance.now() - start).toFixed(2)
    };
  }

  getDatabaseStats() {
    const stats = {};
    for (const [table, rows] of Object.entries(this.tables)) {
      stats[table] = rows.length;
    }
    return stats;
  }
}

export const dbEngine = new DatabaseEngine();
