/* ==========================================================================
   SPARS REPOSITORY & DATA ENGINE
   SIH 2026 Problem Statement ID: SIH26044
   ========================================================================== */

export const CAREER_ROLES = [
  {
    id: "fullstack_ai",
    title: "Full-Stack AI Solutions Engineer",
    domain: "Software & Smart Automation",
    description: "Build modern web interfaces integrated with LLMs, smart microservices, and reactive data pipelines.",
    demandedSkills: [
      { name: "React", weight: 20 },
      { name: "Python", weight: 20 },
      { name: "Node.js", weight: 15 },
      { name: "Docker", weight: 15 },
      { name: "Vector DB & RAG", weight: 15 },
      { name: "REST APIs", weight: 15 }
    ],
    avgSalary: "₹14 - 18 LPA",
    internshipStipend: "₹45,000 / month"
  },
  {
    id: "ai_ml_intern",
    title: "AI & Machine Learning Research Intern",
    domain: "Artificial Intelligence",
    description: "Train neural networks, build predictive regression models, and deploy smart automation algorithms.",
    demandedSkills: [
      { name: "Python", weight: 25 },
      { name: "PyTorch", weight: 20 },
      { name: "Machine Learning", weight: 20 },
      { name: "SQL", weight: 15 },
      { name: "Data Analytics", weight: 20 }
    ],
    avgSalary: "₹16 - 22 LPA",
    internshipStipend: "₹55,000 / month"
  },
  {
    id: "ayush_informatics",
    title: "Ayush Healthcare Data Scientist",
    domain: "Health-Tech & Ayurveda AI",
    description: "Map traditional ayurvedic medicinal formulation data using ontology modeling and clinical bioinformatics.",
    demandedSkills: [
      { name: "Python", weight: 20 },
      { name: "Data Analytics", weight: 20 },
      { name: "Clinical Ontologies", weight: 25 },
      { name: "SQL", weight: 15 },
      { name: "Biomedical NLP", weight: 20 }
    ],
    avgSalary: "₹12 - 16 LPA",
    internshipStipend: "₹40,000 / month"
  },
  {
    id: "cloud_devops",
    title: "Cloud DevOps & Platform Engineer",
    domain: "Infrastructure & Cloud",
    description: "Design fault-tolerant Kubernetes orchestration, CI/CD automated pipelines, and cloud security frameworks.",
    demandedSkills: [
      { name: "Docker", weight: 25 },
      { name: "Kubernetes", weight: 25 },
      { name: "Linux", weight: 20 },
      { name: "Git & GitHub", weight: 15 },
      { name: "CI/CD", weight: 15 }
    ],
    avgSalary: "₹15 - 20 LPA",
    internshipStipend: "₹42,000 / month"
  },
  {
    id: "embedded_iot",
    title: "Embedded IoT & Automation Architect",
    domain: "Smart Hardware & Sensors",
    description: "Develop edge microcontroller firmware, telemetry data collection, and low-latency industrial communication.",
    demandedSkills: [
      { name: "C/C++", weight: 30 },
      { name: "Microcontrollers", weight: 25 },
      { name: "MQTT & IoT Protocols", weight: 25 },
      { name: "Python", weight: 20 }
    ],
    avgSalary: "₹11 - 15 LPA",
    internshipStipend: "₹35,000 / month"
  }
];

export const INITIAL_STUDENT = {
  name: "Aarav Sharma",
  phone: "9876543210",
  email: "aarav.sharma@dtu.ac.in",
  college: "Delhi Technological University (DTU)",
  degree: "B.Tech in Computer Science & AI",
  year: "3rd Year (Batch of 2026)",
  cgpa: 8.84,
  readinessScore: 82,
  masteredSkills: ["Python", "React", "SQL", "Git & GitHub", "REST APIs", "JavaScript"],
  learningInterests: ["Generative AI", "Smart Automation", "Ayush Health-Tech"],
  applications: [
    {
      id: "app_1",
      company: "Bharat Tech Innovators",
      role: "Full-Stack AI Intern",
      status: "Offer Letter Issued",
      date: "2026-09-12",
      stipend: "₹45,000/mo"
    },
    {
      id: "app_2",
      company: "National AICTE Hub",
      role: "AI Research Fellow",
      status: "Interview Scheduled",
      date: "2026-09-15",
      stipend: "₹40,000/mo"
    },
    {
      id: "app_3",
      company: "AIIA Ayush Analytics",
      role: "Bioinformatics Apprentice",
      status: "Skill Assessment Passed",
      date: "2026-09-16",
      stipend: "₹35,000/mo"
    }
  ]
};

export const INITIAL_OPPORTUNITIES = [
  {
    id: "opp_1",
    company: "Bharat Tech Innovators",
    logoIcon: "⚡",
    role: "Full-Stack AI Engineering Intern",
    domain: "Software & Smart Automation",
    location: "Bengaluru (Hybrid)",
    duration: "6 Months",
    stipend: "₹45,000 / mo",
    type: "Internship",
    requiredSkills: ["React", "Python", "REST APIs", "Docker", "Vector DB & RAG"],
    openings: 8,
    applied: true
  },
  {
    id: "opp_2",
    company: "Ayush MedTech Innovations",
    logoIcon: "🌿",
    role: "Healthcare Data Science Apprentice",
    domain: "Ayurveda & Health Informatics",
    location: "New Delhi (On-site)",
    duration: "3 Months",
    stipend: "₹38,000 / mo",
    type: "Internship",
    requiredSkills: ["Python", "SQL", "Data Analytics", "Clinical Ontologies"],
    openings: 4,
    applied: false
  },
  {
    id: "opp_3",
    company: "NextGen Cloud Systems",
    logoIcon: "☁️",
    role: "Cloud DevOps Associate",
    domain: "Cloud Infrastructure",
    location: "Hyderabad (Remote)",
    duration: "6 Months",
    stipend: "₹42,000 / mo",
    type: "Full-Time Offer",
    requiredSkills: ["Docker", "Linux", "Kubernetes", "CI/CD", "Git & GitHub"],
    openings: 12,
    applied: false
  },
  {
    id: "opp_4",
    company: "CyberEdge Automations",
    logoIcon: "🤖",
    role: "Robotics & Embedded Systems Intern",
    domain: "Smart Hardware",
    location: "Pune (On-site)",
    duration: "4 Months",
    stipend: "₹35,000 / mo",
    type: "Internship",
    requiredSkills: ["C/C++", "Microcontrollers", "MQTT & IoT Protocols"],
    openings: 6,
    applied: false
  },
  {
    id: "opp_5",
    company: "Indic AI Labs",
    logoIcon: "🧠",
    role: "Large Language Model & NLP Intern",
    domain: "Artificial Intelligence",
    location: "Bengaluru (Remote)",
    duration: "6 Months",
    stipend: "₹50,000 / mo",
    type: "Internship",
    requiredSkills: ["Python", "PyTorch", "Machine Learning", "REST APIs"],
    openings: 5,
    applied: false
  }
];

export const CANDIDATES_POOL = [
  {
    id: "cand_1",
    name: "Aarav Sharma",
    college: "Delhi Technological University (DTU)",
    branch: "Computer Science & AI",
    cgpa: 8.84,
    skills: ["Python", "React", "SQL", "Git & GitHub", "REST APIs", "JavaScript"],
    avatarText: "AS",
    targetDomain: "Full-Stack AI",
    github: "github.com/aarav-sharma-ai",
    status: "Shortlisted"
  },
  {
    id: "cand_2",
    name: "Sneha Patel",
    college: "IIT Roorkee",
    branch: "Data Science & Statistics",
    cgpa: 9.15,
    skills: ["Python", "PyTorch", "Machine Learning", "SQL", "Data Analytics"],
    avatarText: "SP",
    targetDomain: "AI Research",
    github: "github.com/snehapatel-ds",
    status: "New Applicant"
  },
  {
    id: "cand_3",
    name: "Rohan Verma",
    college: "NIT Trichy",
    branch: "Electronics & Communication",
    cgpa: 8.42,
    skills: ["C/C++", "Microcontrollers", "MQTT & IoT Protocols", "Python", "Linux"],
    avatarText: "RV",
    targetDomain: "Embedded IoT",
    github: "github.com/rohan-iot",
    status: "Assessment Passed"
  },
  {
    id: "cand_4",
    name: "Priyadarshini Rao",
    college: "All India Institute of Ayurveda & Tech",
    branch: "Bio-Informatics & Health Data",
    cgpa: 9.30,
    skills: ["Python", "Clinical Ontologies", "SQL", "Data Analytics", "Biomedical NLP"],
    avatarText: "PR",
    targetDomain: "Ayush Health-Tech",
    github: "github.com/priya-ayush",
    status: "Interview Scheduled"
  },
  {
    id: "cand_5",
    name: "Vikram Malhotra",
    college: "BITS Pilani",
    branch: "Computer Science",
    cgpa: 8.70,
    skills: ["Docker", "Kubernetes", "Linux", "Git & GitHub", "CI/CD"],
    avatarText: "VM",
    targetDomain: "Cloud DevOps",
    github: "github.com/vikram-cloud",
    status: "Offer Extended"
  }
];

export const CURRICULUM_ALIGNMENT_DATA = [
  {
    subject: "Data Structures & Database Management",
    collegeSyllabus: "Traditional RDBMS, SQL 92, Normalization, B-Trees",
    industryDemand2026: "Vector Databases (Pinecone/Milvus), RAG Graph DBs, Redis Caching",
    alignmentScore: 58,
    status: "Critical Gap",
    recommendation: "Introduce hands-on lab on Vector DBs, Embedding Indexes, and NoSQL Sharding."
  },
  {
    subject: "Software Engineering & Architecture",
    collegeSyllabus: "Waterfall Lifecycle, UML Diagrams, Monolithic PHP/Java",
    industryDemand2026: "Microservices, Docker Containers, CI/CD automated deployment, GitOps",
    alignmentScore: 42,
    status: "Critical Gap",
    recommendation: "Mandate Docker containerization and GitHub Actions in 3rd year mini-projects."
  },
  {
    subject: "Artificial Intelligence & Computational Models",
    collegeSyllabus: "Search Algorithms, Expert Systems, Prolog, Decision Trees",
    industryDemand2026: "Transformer Architectures, PyTorch, LoRA fine-tuning, Agentic AI",
    alignmentScore: 74,
    status: "Moderate Gap",
    recommendation: "Integrate PyTorch Deep Learning framework and HuggingFace API integration."
  },
  {
    subject: "Ayush Health Informatics & Biomedical Standards",
    collegeSyllabus: "Ayurvedic Pharmacopoeia classification, Manual Record Keeping",
    industryDemand2026: "FHIR HL7 standards, SNOMED CT Ontologies, Predictive Formulation AI",
    alignmentScore: 86,
    status: "Well Aligned",
    recommendation: "Joint research publication with industry partners for National Ayush Grid."
  },
  {
    subject: "Computer Networks & Cloud Systems",
    collegeSyllabus: "OSI 7 Layers, TCP/IP Handshake, Socket Programming in C",
    industryDemand2026: "Kubernetes Ingress, Cloud Mesh, WebSockets, Zero Trust Security",
    alignmentScore: 68,
    status: "Moderate Gap",
    recommendation: "Add 15 hours practical module on Cloud Native Computing Foundation (CNCF)."
  }
];

export const ACTIVE_MOUS = [
  {
    partner: "Bharat Tech Innovators Pvt Ltd",
    domain: "AI & Smart Automation",
    signedDate: "Jan 2026",
    validTill: "Jan 2029",
    internshipsOffered: 45,
    status: "Active"
  },
  {
    partner: "Ministry of Ayush Research Consortium",
    domain: "Bio-Informatics & Formulation Mapping",
    signedDate: "Aug 2025",
    validTill: "Aug 2028",
    internshipsOffered: 30,
    status: "Active"
  },
  {
    partner: "NextGen Cloud Solutions Ltd",
    domain: "DevOps & Cloud Systems",
    signedDate: "Mar 2026",
    validTill: "Mar 2028",
    internshipsOffered: 25,
    status: "Active"
  }
];
