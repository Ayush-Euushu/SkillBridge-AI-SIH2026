/* ==========================================================================
   SPARS AI SKILL MAPPING & AUTOMATION ENGINE
   SIH 2026 Problem Statement ID: SIH26044
   ========================================================================== */

import { CAREER_ROLES } from './data.js';

export class SkillEngine {
  /**
   * Calculate compatibility between student mastered skills and target role requirements
   */
  static analyzeSkillGap(studentSkills, roleId) {
    const role = CAREER_ROLES.find(r => r.id === roleId) || CAREER_ROLES[0];
    const totalWeight = role.demandedSkills.reduce((sum, item) => sum + item.weight, 0);

    const mastered = [];
    const missing = [];
    let acquiredWeight = 0;

    role.demandedSkills.forEach(skill => {
      const isMastered = studentSkills.some(s => s.toLowerCase() === skill.name.toLowerCase());
      if (isMastered) {
        mastered.push(skill);
        acquiredWeight += skill.weight;
      } else {
        missing.push(skill);
      }
    });

    const matchPercentage = Math.round((acquiredWeight / totalWeight) * 100);

    return {
      role,
      matchPercentage,
      masteredSkills: mastered,
      missingSkills: missing,
      gapCount: missing.length,
      recommendations: this.generateLearningPlan(missing)
    };
  }

  /**
   * Generates tailored micro-courses and practical labs for missing skills
   */
  static generateLearningPlan(missingSkills) {
    const COURSE_CATALOG = {
      "Docker": {
        course: "Containerization & Microservices with Docker",
        platform: "NPTEL / AICTE Free Course",
        duration: "3 Weeks (12 Hours)",
        level: "Intermediate"
      },
      "Vector DB & RAG": {
        course: "Building Production RAG Systems with LangChain & Pinecone",
        platform: "SWAYAM Deep Learning Series",
        duration: "4 Weeks (18 Hours)",
        level: "Advanced"
      },
      "Node.js": {
        course: "Asynchronous Backend Architecture & REST APIs",
        platform: "IIT Madras Web Development Track",
        duration: "4 Weeks (15 Hours)",
        level: "Intermediate"
      },
      "PyTorch": {
        course: "Deep Learning Foundations with PyTorch",
        platform: "NPTEL Swayam Prabha",
        duration: "6 Weeks (24 Hours)",
        level: "Advanced"
      },
      "Clinical Ontologies": {
        course: "Ayurveda & Modern Medical Ontologies (SNOMED/ICD-11)",
        platform: "All India Institute of Ayurveda Grid",
        duration: "4 Weeks (16 Hours)",
        level: "Specialized"
      },
      "Kubernetes": {
        course: "Cloud Native Orchestration & Helm Deployments",
        platform: "Linux Foundation / AICTE Portal",
        duration: "5 Weeks (20 Hours)",
        level: "Advanced"
      },
      "C/C++": {
        course: "Embedded C Programming & Modern Microcontrollers",
        platform: "IIT Bombay Spoken Tutorials",
        duration: "4 Weeks (16 Hours)",
        level: "Foundation"
      },
      "Microcontrollers": {
        course: "IoT Edge Computing & ESP32 / STM32 Interfacing",
        platform: "NPTEL Automation Lab",
        duration: "5 Weeks (22 Hours)",
        level: "Hands-on"
      },
      "MQTT & IoT Protocols": {
        course: "Industrial IoT Communication Protocols & Telemetry",
        platform: "MeitY IoT Specialization",
        duration: "2 Weeks (8 Hours)",
        level: "Intermediate"
      }
    };

    return missingSkills.map(skill => {
      const details = COURSE_CATALOG[skill.name] || {
        course: `Hands-on Masterclass: Mastering ${skill.name}`,
        platform: "National Internship Skill Grid",
        duration: "3 Weeks (10 Hours)",
        level: "Accelerated"
      };

      return {
        skillName: skill.name,
        weight: skill.weight,
        ...details
      };
    });
  }

  /**
   * Calculate candidate match score against an opportunity
   */
  static calculateJobMatch(candidateSkills, requiredSkills) {
    if (!requiredSkills || requiredSkills.length === 0) return 100;

    let matchCount = 0;
    requiredSkills.forEach(req => {
      if (candidateSkills.some(s => s.toLowerCase() === req.toLowerCase())) {
        matchCount++;
      }
    });

    return Math.round((matchCount / requiredSkills.length) * 100);
  }
}
