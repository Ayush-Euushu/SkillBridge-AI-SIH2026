/* ==========================================================================
   SPARS USER INTERFACE & DYNAMIC DASHBOARD RENDERER
   SIH 2026 Problem Statement ID: SIH26044
   ========================================================================== */

import {
  CAREER_ROLES,
  INITIAL_STUDENT,
  INITIAL_OPPORTUNITIES,
  CANDIDATES_POOL,
  CURRICULUM_ALIGNMENT_DATA,
  ACTIVE_MOUS
} from './data.js';

import { SkillEngine } from './skill-engine.js';
import { dbEngine } from './db.js';

export class UIManager {
  constructor() {
    this.student = { ...INITIAL_STUDENT };
    this.opportunities = [...INITIAL_OPPORTUNITIES];
    this.candidates = [...CANDIDATES_POOL];
    this.selectedCareerRole = CAREER_ROLES[0].id;
    this.currentFilter = 'all';
    this.candidateSearchQuery = '';
    this.currentDbmsTable = 'users';
  }

  showToast(type = 'info', title = '', message = '') {
    const container = document.getElementById('toastNotificationTray');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message-box">
        <div class="toast-title">${title}</div>
        <div class="toast-body">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  /* ==========================================================================
     STUDENT PORTAL RENDERING
     ========================================================================== */
  renderStudentPortal() {
    this.renderSkillGapEngine();
    this.renderOpportunities();
    this.renderApplicationPipeline();
  }

  renderSkillGapEngine() {
    const analysis = SkillEngine.analyzeSkillGap(this.student.masteredSkills, this.selectedCareerRole);

    const dropdown = document.getElementById('studentTargetRoleSelect');
    if (dropdown && dropdown.children.length === 0) {
      dropdown.innerHTML = CAREER_ROLES.map(role => `
        <option value="${role.id}" ${role.id === this.selectedCareerRole ? 'selected' : ''}>
          ${role.title} (${role.domain})
        </option>
      `).join('');
    }

    // Update Radial Circle Meter
    const circle = document.getElementById('skillMeterCircle');
    const numberText = document.getElementById('skillMeterNumber');
    const roleTitle = document.getElementById('skillMeterRoleTitle');
    const roleDesc = document.getElementById('skillMeterRoleDesc');

    if (circle) {
      circle.style.strokeDasharray = `${analysis.matchPercentage}, 100`;
      circle.style.stroke = analysis.matchPercentage >= 75 ? '#00b050' : (analysis.matchPercentage >= 50 ? '#f59e0b' : '#f43f5e');
    }

    if (numberText) {
      numberText.textContent = `${analysis.matchPercentage}%`;
    }

    if (roleTitle) {
      roleTitle.textContent = analysis.role.title;
    }

    if (roleDesc) {
      roleDesc.textContent = `${analysis.role.description} • Demands ${analysis.role.demandedSkills.length} key competencies.`;
    }

    // Render Mastered Skills
    const masteredList = document.getElementById('studentMasteredSkillsList');
    if (masteredList) {
      if (analysis.masteredSkills.length === 0) {
        masteredList.innerHTML = '<span style="font-size:0.8rem; color:var(--text-muted);">No matched skills yet.</span>';
      } else {
        masteredList.innerHTML = analysis.masteredSkills.map(s => `
          <span class="skill-chip mastered">✓ ${s.name} (+${s.weight}%)</span>
        `).join('');
      }
    }

    // Render Missing Skills
    const missingList = document.getElementById('studentMissingSkillsList');
    if (missingList) {
      if (analysis.missingSkills.length === 0) {
        missingList.innerHTML = '<span class="skill-chip mastered" style="background:rgba(0,176,80,0.15)">🎉 100% Industry Ready for this Role!</span>';
      } else {
        missingList.innerHTML = analysis.missingSkills.map(s => `
          <span class="skill-chip missing">✕ ${s.name} (${s.weight}% gap)</span>
        `).join('');
      }
    }

    this.updateLearningPlanModal(analysis);
  }

  updateLearningPlanModal(analysis) {
    const list = document.getElementById('learningRoadmapList');
    if (!list) return;

    if (analysis.recommendations.length === 0) {
      list.innerHTML = `
        <div style="text-align:center; padding:20px;">
          <h4>🎯 Exceptional Skill Mastery!</h4>
          <p style="color:var(--text-secondary); margin-top:8px;">You currently satisfy all industry skill requirements for this specialization.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = analysis.recommendations.map(rec => `
      <div style="background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; margin-bottom:12px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
          <span class="pill-badge pill-sih">Gap Identified: ${rec.skillName}</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">${rec.duration}</span>
        </div>
        <h4 style="font-size:0.95rem; margin-bottom:4px;">${rec.course}</h4>
        <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:8px;">Provided by: <strong>${rec.platform}</strong> • Level: ${rec.level}</p>
        <button class="btn-tactile btn-tactile-primary" style="padding: 6px 14px; font-size: 0.8rem;" onclick="window.sparsUI.enrollCourse('${rec.skillName}')">
          ✦ Enroll in Micro-Course
        </button>
      </div>
    `).join('');
  }

  enrollCourse(skillName) {
    this.showToast('success', 'Enrolled Successfully', `Added ${skillName} micro-course to your academic learning pathway.`);
    this.closeModal('learningPlanModal');
  }

  renderOpportunities() {
    const container = document.getElementById('studentOpportunitiesGrid');
    if (!container) return;

    let filtered = this.opportunities;
    if (this.currentFilter === 'high_match') {
      filtered = filtered.filter(opp => {
        const score = SkillEngine.calculateJobMatch(this.student.masteredSkills, opp.requiredSkills);
        return score >= 80;
      });
    } else if (this.currentFilter === 'remote') {
      filtered = filtered.filter(opp => opp.location.toLowerCase().includes('remote'));
    }

    container.innerHTML = filtered.map(opp => {
      const matchScore = SkillEngine.calculateJobMatch(this.student.masteredSkills, opp.requiredSkills);
      const isApplied = opp.applied || this.student.applications.some(a => a.company === opp.company);

      return `
        <div class="ultra-card job-card">
          <div>
            <div class="job-head">
              <div class="job-icon">${opp.logoIcon}</div>
              <div class="job-meta-text">
                <h4 class="job-role-title">${opp.role}</h4>
                <div class="job-company-name">${opp.company} • ${opp.domain}</div>
              </div>
              <span class="pill-badge ${matchScore >= 80 ? 'pill-success' : 'pill-sih'}">
                ${matchScore}% Match
              </span>
            </div>
            <div class="job-meta-tags">
              <span>📍 ${opp.location}</span>
              <span>⏱ ${opp.duration}</span>
              <span>💼 ${opp.type}</span>
            </div>
            <div class="job-skills-row">
              ${opp.requiredSkills.map(skill => {
                const hasSkill = this.student.masteredSkills.includes(skill);
                return `
                  <span class="pill-badge ${hasSkill ? 'pill-cyan' : 'pill-sih'}" style="font-size:0.7rem; text-transform:none;">
                    ${hasSkill ? '✓' : '•'} ${skill}
                  </span>
                `;
              }).join('')}
            </div>
          </div>
          <div class="job-card-bottom">
            <div class="job-stipend-amount">${opp.stipend}</div>
            <button class="btn-tactile ${isApplied ? 'btn-tactile-secondary' : 'btn-tactile-primary'}"
              style="padding: 7px 16px; font-size: 0.85rem;"
              ${isApplied ? 'disabled' : ''}
              onclick="window.sparsUI.applyOpportunity('${opp.id}')">
              ${isApplied ? '✓ Applied' : '⚡ 1-Click Apply'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  applyOpportunity(oppId) {
    const opp = this.opportunities.find(o => o.id === oppId);
    if (!opp) return;

    opp.applied = true;
    const newApp = {
      id: `app_${Date.now()}`,
      company: opp.company,
      role: opp.role,
      status: "Skill Assessment Passed",
      date: new Date().toISOString().split('T')[0],
      stipend: opp.stipend
    };
    this.student.applications.unshift(newApp);

    // Sync directly with Relational DBMS
    dbEngine.tables.applications.unshift({
      app_id: newApp.id,
      job_id: opp.id,
      student_id: 'std_001',
      company: opp.company,
      role: opp.role,
      status: newApp.status,
      match_score: SkillEngine.calculateJobMatch(this.student.masteredSkills, opp.requiredSkills),
      applied_at: newApp.date
    });
    dbEngine.saveDatabase();

    this.renderOpportunities();
    this.renderApplicationPipeline();
    this.showToast('success', 'Application Recorded in DBMS', `Sent to ${opp.company}. Relational record stored in applications table.`);
  }

  renderApplicationPipeline() {
    const totalApplied = this.student.applications.length;
    const assessmentPassed = this.student.applications.filter(a => a.status.includes('Assessment') || a.status.includes('Interview') || a.status.includes('Offer')).length;
    const interviewScheduled = this.student.applications.filter(a => a.status.includes('Interview') || a.status.includes('Offer')).length;
    const offerIssued = this.student.applications.filter(a => a.status.includes('Offer')).length;

    const count1 = document.getElementById('stepCountApplied');
    const count2 = document.getElementById('stepCountAssessment');
    const count3 = document.getElementById('stepCountInterview');
    const count4 = document.getElementById('stepCountOffer');

    if (count1) count1.textContent = totalApplied;
    if (count2) count2.textContent = assessmentPassed;
    if (count3) count3.textContent = interviewScheduled;
    if (count4) count4.textContent = offerIssued;
  }

  previewOfferLetter() {
    this.openModal('offerLetterModal');
  }

  /* ==========================================================================
     INDUSTRY / RECRUITER PORTAL
     ========================================================================== */
  renderIndustryPortal() {
    this.renderCandidatePool();
  }

  renderCandidatePool() {
    const tbody = document.getElementById('recruiterCandidatesTableBody');
    if (!tbody) return;

    let list = this.candidates;
    if (this.candidateSearchQuery) {
      const q = this.candidateSearchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.college.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    tbody.innerHTML = list.map(c => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#0284c7,#8b5cf6); color:white; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem;">
              ${c.avatarText}
            </div>
            <div>
              <div style="font-weight:700;">${c.name}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${c.targetDomain}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="font-size:0.85rem; font-weight:600;">${c.college}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${c.branch}</div>
        </td>
        <td>
          <span class="pill-badge pill-success" style="font-size:0.82rem;">${c.cgpa} CGPA</span>
        </td>
        <td>
          <div style="display:flex; flex-wrap:wrap; gap:4px; max-width:260px;">
            ${c.skills.slice(0, 4).map(s => `<span class="pill-badge pill-cyan" style="text-transform:none; font-size:0.7rem;">${s}</span>`).join('')}
            ${c.skills.length > 4 ? `<span class="pill-badge" style="font-size:0.7rem;">+${c.skills.length - 4}</span>` : ''}
          </div>
        </td>
        <td>
          <span class="pill-badge ${c.status.includes('Offer') ? 'pill-success' : 'pill-sih'}">
            ${c.status}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn-tactile btn-tactile-secondary" style="padding: 5px 10px; font-size: 0.78rem;" onclick="window.sparsUI.viewCandidateDossier('${c.id}')">
              Dossier
            </button>
            <button class="btn-tactile btn-tactile-primary" style="padding: 5px 10px; font-size: 0.78rem;" onclick="window.sparsUI.inviteCandidate('${c.name}')">
              Invite
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  viewCandidateDossier(candidateId) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const modalTitle = document.getElementById('dossierCandidateName');
    const body = document.getElementById('dossierModalContent');

    if (modalTitle) modalTitle.textContent = `${candidate.name} • SPARS Skill Dossier`;

    if (body) {
      body.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
          <div style="width:60px; height:60px; border-radius:16px; background:linear-gradient(135deg,#0284c7,#10b981); color:white; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:800;">
            ${candidate.avatarText}
          </div>
          <div>
            <h3 style="font-size:1.2rem; margin-bottom:2px;">${candidate.name}</h3>
            <p style="font-size:0.85rem; color:var(--text-secondary);">${candidate.college} • ${candidate.branch}</p>
            <div style="margin-top:6px; display:flex; gap:8px;">
              <span class="pill-badge pill-success">${candidate.cgpa} CGPA</span>
              <span class="pill-badge pill-cyan">Verified Skill Passport</span>
            </div>
          </div>
        </div>

        <div style="margin-bottom:18px;">
          <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px;">Verified Technical Skills</h4>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${candidate.skills.map(s => `<span class="skill-chip mastered">✓ ${s}</span>`).join('')}
          </div>
        </div>

        <div style="background:var(--bg-surface-subtle); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:18px;">
          <h4 style="font-size:0.88rem; margin-bottom:4px;">Hackathon & Repository Link</h4>
          <a href="#" style="font-size:0.85rem; color:var(--cyber-blue);">${candidate.github}</a>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Pre-screened & verified by College Academic Dean & Smart India Hackathon Council.</p>
        </div>
      `;
    }

    this.openModal('candidateDossierModal');
  }

  inviteCandidate(candidateName) {
    this.showToast('success', 'Interview Invite Dispatched', `Automated test & calendar slot sent to ${candidateName}.`);
  }

  postNewInternship(event) {
    event.preventDefault();

    const role = document.getElementById('postJobTitle').value;
    const company = document.getElementById('postJobCompany').value;
    const location = document.getElementById('postJobLocation').value;
    const stipend = document.getElementById('postJobStipend').value;
    const skillsRaw = document.getElementById('postJobSkills').value;

    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const newOpp = {
      id: `job_${Date.now()}`,
      company: company || "Bharat Tech Systems",
      logoIcon: "💼",
      role: role || "Software Engineer Intern",
      domain: "Smart Automation",
      location: location || "Bengaluru (Hybrid)",
      duration: "6 Months",
      stipend: stipend || "₹40,000 / mo",
      type: "Internship",
      requiredSkills: skills.length > 0 ? skills : ["Python", "React", "Docker"],
      openings: 5,
      applied: false
    };

    this.opportunities.unshift(newOpp);

    // Save to Relational DBMS
    dbEngine.tables.jobs.unshift({
      job_id: newOpp.id,
      company: newOpp.company,
      title: newOpp.role,
      domain: newOpp.domain,
      location: newOpp.location,
      duration: newOpp.duration,
      stipend: newOpp.stipend,
      required_skills: newOpp.requiredSkills,
      openings: newOpp.openings
    });
    dbEngine.saveDatabase();

    this.closeModal('postJobModal');
    this.renderOpportunities();
    this.showToast('success', 'Stored in DBMS & Published!', `${role} recorded in relational jobs table and live for student matching.`);
  }

  /* ==========================================================================
     ACADEMIA PORTAL
     ========================================================================== */
  renderAcademiaPortal() {
    this.renderCurriculumMatrix();
    this.renderMoUTable();
  }

  renderCurriculumMatrix() {
    const tbody = document.getElementById('curriculumTableBody');
    if (!tbody) return;

    tbody.innerHTML = CURRICULUM_ALIGNMENT_DATA.map(row => {
      let badgeClass = 'alignment-moderate';
      if (row.alignmentScore >= 80) badgeClass = 'alignment-aligned';
      if (row.alignmentScore < 60) badgeClass = 'alignment-critical';

      return `
        <tr>
          <td style="font-weight:700;">${row.subject}</td>
          <td style="color:var(--text-secondary); font-size:0.85rem;">${row.collegeSyllabus}</td>
          <td style="color:var(--cyber-blue); font-size:0.85rem; font-weight:600;">${row.industryDemand2026}</td>
          <td>
            <span class="alignment-status-badge ${badgeClass}">
              ${row.alignmentScore}% • ${row.status}
            </span>
          </td>
          <td style="font-size:0.82rem; color:var(--text-secondary);">
            ${row.recommendation}
          </td>
        </tr>
      `;
    }).join('');
  }

  renderMoUTable() {
    const tbody = document.getElementById('mouTableBody');
    if (!tbody) return;

    tbody.innerHTML = ACTIVE_MOUS.map(mou => `
      <tr>
        <td style="font-weight:700;">${mou.partner}</td>
        <td>${mou.domain}</td>
        <td>${mou.signedDate} - ${mou.validTill}</td>
        <td style="font-weight:700; color:var(--sih-green);">${mou.internshipsOffered} Slots</td>
        <td><span class="pill-badge pill-success">${mou.status}</span></td>
      </tr>
    `).join('');
  }

  exportCurriculumReport() {
    this.showToast('info', 'Generating AICTE Report', 'Compiling 2026 Industry Skill Alignment dossier for academic council...');
    setTimeout(() => {
      this.showToast('success', 'Report Exported', 'AICTE_Curriculum_Reform_SPARS2026.pdf ready for download.');
    }, 1200);
  }

  /* ==========================================================================
     DBMS STUDIO & SQL EXPLORER
     ========================================================================== */
  openDbmsStudio() {
    this.openModal('dbmsStudioModal');
    this.renderDbmsTableCounts();
    this.selectDbmsTable(this.currentDbmsTable);
  }

  renderDbmsTableCounts() {
    const stats = dbEngine.getDatabaseStats();
    for (const [table, count] of Object.entries(stats)) {
      const badge = document.getElementById(`dbmsCount_${table}`);
      if (badge) badge.textContent = count;
    }
  }

  selectDbmsTable(tableName) {
    this.currentDbmsTable = tableName;

    // Update active tab in sidebar
    const items = document.querySelectorAll('.dbms-table-item');
    items.forEach(it => {
      it.classList.toggle('active', it.dataset.table === tableName);
    });

    const queryBox = document.getElementById('dbmsSqlInput');
    if (queryBox) {
      queryBox.value = `SELECT * FROM ${tableName};`;
    }

    this.runDbmsQuery(`SELECT * FROM ${tableName};`);
  }

  runDbmsQuery(customSql = null) {
    const sql = customSql || document.getElementById('dbmsSqlInput')?.value || `SELECT * FROM ${this.currentDbmsTable};`;
    const result = dbEngine.executeSql(sql);

    const thead = document.getElementById('dbmsTableHead');
    const tbody = document.getElementById('dbmsTableBody');
    const statText = document.getElementById('dbmsQueryExecutionTime');

    if (statText) {
      statText.textContent = `✓ ${result.count || 0} rows retrieved in ${result.durationMs}ms`;
    }

    if (!result.success || result.error) {
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="color:var(--cyber-rose); padding:16px;">Error: ${result.error}</td></tr>`;
      return;
    }

    if (thead && result.columns) {
      thead.innerHTML = `<tr>${result.columns.map(c => `<th>${c}</th>`).join('')}</tr>`;
    }

    if (tbody && result.rows) {
      if (result.rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${result.columns.length || 1}" style="padding:16px; text-align:center; color:var(--text-muted);">Table is currently empty.</td></tr>`;
      } else {
        tbody.innerHTML = result.rows.map(row => `
          <tr>
            ${result.columns.map(col => {
              let val = row[col];
              if (Array.isArray(val) || typeof val === 'object') {
                val = JSON.stringify(val);
              }
              return `<td>${val}</td>`;
            }).join('')}
          </tr>
        `).join('');
      }
    }
  }

  exportSqlFile() {
    const dump = `-- SPARS SIH 2026 Relational DBMS Dump\n-- Generated on: ${new Date().toISOString()}\n\n` +
      Object.entries(dbEngine.tables).map(([tbl, rows]) => {
        return `-- Table: ${tbl} (${rows.length} rows)\n` +
          rows.map(r => `INSERT INTO ${tbl} VALUES (${Object.values(r).map(v => typeof v === 'string' ? `'${v}'` : v).join(', ')});`).join('\n');
      }).join('\n\n');

    const blob = new Blob([dump], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spars_database_dump.sql';
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('success', 'Database Exported', 'Downloaded spars_database_dump.sql');
  }
}
