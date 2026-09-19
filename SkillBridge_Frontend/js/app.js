/* ==========================================================================
   SPARS APPLICATION MAIN CONTROLLER & BOOTSTRAPPER
   SIH 2026 Problem Statement ID: SIH26044
   ========================================================================== */

import { themeManager } from './theme.js';
import { authManager } from './auth.js';
import { UIManager } from './ui.js';

class AppController {
  constructor() {
    this.ui = new UIManager();
    this.currentRole = 'student';
    window.sparsUI = this.ui;
    window.sparsApp = this;
  }

  init() {
    this.setupAuthListeners();
    this.setupRegistrationStep();
    this.setupDashboardListeners();
    this.setupOtpInputNavigation();
    this.setupThemeToggle();
    this.setupPhoneMockupListeners();
    this.setupDbmsListeners();
    this.startPhoneClock();

    // Check if user was previously authenticated in session
    const savedRole = sessionStorage.getItem('spars_active_role');
    const savedUser = sessionStorage.getItem('spars_active_user');
    if (savedRole) {
      const user = savedUser ? JSON.parse(savedUser) : { role: savedRole, phone: '9876543210' };
      this.loginSuccess(user);
    }
  }

  startPhoneClock() {
    const clockEl = document.getElementById('phoneDigitalClock');
    const updateTime = () => {
      const now = new Date();
      if (clockEl) {
        clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    };
    updateTime();
    setInterval(updateTime, 10000);
  }

  setupPhoneMockupListeners() {
    // Interactive button on the Virtual Phone Mockup
    const btnPhoneCopy = document.getElementById('btnPhoneCopyOtp');
    if (btnPhoneCopy) {
      btnPhoneCopy.addEventListener('click', () => {
        authManager.autoFillOtpFromPhone();
        this.ui.showToast('success', 'OTP Auto-Filled from Phone', 'Filled 6-digit code from your virtual smartphone SMS.');
      });
    }

    // Tapping the phone screen wakes up / focus
    const phoneDevice = document.getElementById('smartphoneDevice');
    if (phoneDevice) {
      phoneDevice.addEventListener('click', (e) => {
        if (e.target.id === 'btnPhoneCopyOtp') return;
        const standby = document.getElementById('phoneStandbyScreen');
        if (standby && standby.style.display !== 'none') {
          // If in standby and has phone number, can trigger simulation hint
          phoneDevice.classList.add('phone-vibrating');
          setTimeout(() => phoneDevice.classList.remove('phone-vibrating'), 400);
        }
      });
    }
  }

  setupDbmsListeners() {
    // Open DBMS Studio
    const btnOpenDbms = document.getElementById('btnOpenDbmsStudio');
    if (btnOpenDbms) {
      btnOpenDbms.addEventListener('click', () => {
        this.ui.openDbmsStudio();
      });
    }

    // Sidebar table selections
    const tableItems = document.querySelectorAll('.dbms-table-item');
    tableItems.forEach(item => {
      item.addEventListener('click', () => {
        const tbl = item.dataset.table;
        this.ui.selectDbmsTable(tbl);
      });
    });

    // Run custom SQL query button
    const btnRunSql = document.getElementById('btnRunDbmsSql');
    if (btnRunSql) {
      btnRunSql.addEventListener('click', () => {
        this.ui.runDbmsQuery();
      });
    }

    // Export SQL file button
    const btnExportSql = document.getElementById('btnExportDbmsSql');
    if (btnExportSql) {
      btnExportSql.addEventListener('click', () => {
        this.ui.exportSqlFile();
      });
    }
  }

  setupThemeToggle() {
    const toggleSwitches = document.querySelectorAll('.segmented-theme-switch, .theme-toggle-btn');
    toggleSwitches.forEach(sw => {
      sw.addEventListener('click', () => {
        themeManager.toggleTheme();
      });
    });

    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        authManager.soundEnabled = !authManager.soundEnabled;
        soundBtn.innerHTML = authManager.soundEnabled ? '🔔' : '🔕';
        this.ui.showToast('info', 'Audio System', authManager.soundEnabled ? 'Sound effects enabled' : 'Sound effects muted');
      });
    }
  }

  setupAuthListeners() {
    // Role selection tiles on Auth Gateway
    const roleTiles = document.querySelectorAll('.role-tile');
    roleTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        roleTiles.forEach(r => r.classList.remove('active'));
        tile.classList.add('active');
        this.currentRole = tile.dataset.role;
      });
    });

    // Mobile Number Input with Live Carrier Detection
    const phoneInput = document.getElementById('mobilePhoneInput');
    const carrierDisplay = document.getElementById('carrierDetectDisplay');
    const phoneCarrierText = document.getElementById('phoneCarrierText');

    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val;
        const carrier = authManager.detectCarrier(val);
        if (carrierDisplay) {
          carrierDisplay.innerHTML = `<span class="live-pulse-dot"></span> <span>${carrier}</span>`;
        }
        if (phoneCarrierText) {
          phoneCarrierText.textContent = carrier.split(' ')[0] + ' 5G';
        }
      });
    }

    // Request OTP Button
    const btnRequestOtp = document.getElementById('btnRequestOtp');
    if (btnRequestOtp) {
      btnRequestOtp.addEventListener('click', (e) => {
        e.preventDefault();
        const phone = phoneInput ? phoneInput.value.trim() : '';

        if (!phone || phone.length < 10) {
          this.ui.showToast('warning', 'Mobile Number Required', 'Please enter a valid 10-digit Indian mobile number');
          if (phoneInput) phoneInput.focus();
          return;
        }

        authManager.triggerSmsOtp(phone, this.currentRole);
      });
    }

    // Resend OTP
    const btnResend = document.getElementById('btnResendOtp');
    if (btnResend) {
      btnResend.addEventListener('click', () => {
        const phone = phoneInput ? phoneInput.value.trim() : '9876543210';
        authManager.triggerSmsOtp(phone, this.currentRole);
        this.ui.showToast('info', 'Fresh OTP Sent to Phone', `Sent new security code to your virtual mobile phone`);
      });
    }

    // Verify OTP Button — now shows Registration Step instead of direct login
    const btnVerify = document.getElementById('btnVerifyOtp');
    if (btnVerify) {
      btnVerify.addEventListener('click', (e) => {
        e.preventDefault();
        const res = authManager.verifySubmittedOtp();
        if (!res.success) {
          this.ui.showToast('warning', 'Verification Error', res.message);
          return;
        }

        // Show Registration Step (Step 2)
        this._showRegistrationStep(res.user.phone, res.user.role);
      });
    }

    // Judge Quick Demo Logins
    const demoStudent = document.getElementById('btnDemoStudent');
    const demoRecruiter = document.getElementById('btnDemoRecruiter');
    const demoAcademia = document.getElementById('btnDemoAcademia');

    if (demoStudent) {
      demoStudent.addEventListener('click', () => {
        const user = authManager.quickJudgeLogin('student');
        this.loginSuccess(user);
      });
    }

    if (demoRecruiter) {
      demoRecruiter.addEventListener('click', () => {
        const user = authManager.quickJudgeLogin('industry');
        this.loginSuccess(user);
      });
    }

    if (demoAcademia) {
      demoAcademia.addEventListener('click', () => {
        const user = authManager.quickJudgeLogin('academia');
        this.loginSuccess(user);
      });
    }
  }

  setupOtpInputNavigation() {
    const cells = document.querySelectorAll('.otp-cell');
    cells.forEach((cell, idx) => {
      cell.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        cell.value = val ? val[0] : '';
        if (cell.value) {
          cell.classList.add('filled');
          if (idx < cells.length - 1) {
            cells[idx + 1].focus();
          }
        } else {
          cell.classList.remove('filled');
        }
      });

      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !cell.value && idx > 0) {
          cells[idx - 1].focus();
        }
      });

      cell.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text').trim();
        const digits = text.replace(/\D/g, '');
        if (digits.length >= 6) {
          digits.slice(0, 6).split('').forEach((char, i) => {
            if (cells[i]) {
              cells[i].value = char;
              cells[i].classList.add('filled');
            }
          });
          cells[5].focus();
        }
      });
    });
  }

  loginSuccess(user) {
    this.currentRole = user.role;
    this._loggedInUser = user;
    try {
      sessionStorage.setItem('spars_active_role', user.role);
      sessionStorage.setItem('spars_active_user', JSON.stringify(user));
    } catch (e) {}

    // Transition view
    const authScreen = document.getElementById('authScreenView');
    const mainPortal = document.getElementById('mainPortalView');

    if (authScreen) authScreen.style.display = 'none';
    if (mainPortal) mainPortal.style.display = 'flex';

    // Update User Profile in header
    const phoneDisplay = document.getElementById('headerUserPhone');
    const roleDisplay = document.getElementById('headerUserRole');
    const avatarEl = document.querySelector('.user-avatar-hex');

    if (phoneDisplay) phoneDisplay.textContent = user.fullName ? user.fullName : `+91 ${user.phone}`;
    if (roleDisplay) {
      const names = { student: 'Student Scholar', industry: 'Corporate Recruiter', academia: 'Academic Dean' };
      roleDisplay.textContent = user.college ? user.college : (names[user.role] || 'Authorized User');
    }
    if (avatarEl && user.fullName) {
      const parts = user.fullName.trim().split(' ');
      avatarEl.textContent = (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1] || '')).toUpperCase();
    }

    // Update student hero welcome message dynamically
    const heroTitle = document.querySelector('#studentPortalView .hero-main-title h2');
    const heroSub   = document.querySelector('#studentPortalView .hero-main-title p');
    if (heroTitle && user.fullName) {
      heroTitle.textContent = `Welcome back, ${user.fullName}! 🚀`;
    }
    if (heroSub && user.college) {
      heroSub.textContent = `${user.college}${user.branch ? ' • ' + user.branch : ''} — Your SPARS Skill Passport is active and matching you with live industry openings.`;
    }

    // Ensure we have a valid User ID
    const generatedUserId = user.userId || user.studentId || `USR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Update DBMS Profile Card (User ID, Full Name, Phone, College, Branch)
    const setEl = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    setEl('profileUserId',   generatedUserId);
    setEl('profileFullName', user.fullName || 'Aarav Sharma');
    setEl('profilePhone',    `+91 ${user.phone}` || '+91 9876543210');
    setEl('profileCollege',  user.college  || 'Delhi Technological University (DTU)');
    setEl('profileBranch',   user.branch   || 'B.Tech in Computer Science & AI');
    setEl('profileSqlPhone', user.phone    || '9876543210');

    // Generate unique dynamic metrics for the newly registered student
    const randomCgpa = (8.2 + (Math.abs(user.fullName.charCodeAt(0)) % 15) / 10).toFixed(2);
    const randomReadiness = 75 + (Math.abs(user.fullName.length * 3) % 20);

    setEl('heroReadinessNum', `${randomReadiness}%`);
    setEl('heroCgpaNum', randomCgpa);
    setEl('heroOffersNum', (user.fullName.length % 3) + 1);

    this.switchPortalRole(user.role);
    const greeting = user.fullName ? `Welcome, ${user.fullName}!` : 'Authenticated Successfully';
    this.ui.showToast('success', greeting, `SPARS Portal unlocked (${user.role.toUpperCase()})`);
  }

  _showRegistrationStep(phone, role) {
    // Generate a preview User ID
    const previewId = `USR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    this._pendingUserId = previewId;
    this._pendingPhone = phone;
    this._pendingRole = role;

    // Hide OTP controls, show registration step
    const otpContainer = document.getElementById('otpInputContainer');
    const btnVerify = document.getElementById('btnVerifyOtp');
    const regStep = document.getElementById('registrationStep');
    const regPhoneDisplay = document.getElementById('regPhoneDisplay');
    const regUserIdDisplay = document.getElementById('regUserIdDisplay');

    if (otpContainer) otpContainer.style.display = 'none';
    if (btnVerify) btnVerify.style.display = 'none';
    if (regPhoneDisplay) regPhoneDisplay.value = `+91 ${phone}`;
    if (regUserIdDisplay) regUserIdDisplay.textContent = previewId;
    if (regStep) regStep.style.display = 'block';

    // Scroll card into view smoothly
    regStep?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    this.ui.showToast('success', 'OTP Verified ✅', 'Please complete your profile registration to enter the portal.');
  }

  setupRegistrationStep() {
    const nameInput   = document.getElementById('regFullNameInput');
    const collegeInput= document.getElementById('regCollegeInput');
    const branchInput = document.getElementById('regBranchInput');
    const previewCode = document.getElementById('regDbmsPreviewCode');

    const updatePreview = () => {
      if (!previewCode) return;
      const userId   = this._pendingUserId || 'USR-2026-XXXX';
      const phone    = this._pendingPhone || 'XXXXXXXXXX';
      const name     = nameInput?.value   || '<full_name>';
      const college  = collegeInput?.value || '<college_name>';
      const branch   = branchInput?.value  || '<branch>';
      const role     = this._pendingRole  || 'student';
      const ts       = new Date().toISOString().replace('T',' ').slice(0,19);

      previewCode.textContent =
`INSERT INTO users (
  user_id, full_name, mobile_number,
  college, role, is_verified,
  created_at
) VALUES (
  '${userId}',
  '${name}',
  '${phone}',
  '${college}',
  '${role}',
  TRUE,
  '${ts}'
);

INSERT INTO students (
  user_id, full_name, college, branch
) VALUES (
  '${userId}', '${name}',
  '${college}', '${branch}'
);`;
    };

    if (nameInput)    nameInput.addEventListener('input', updatePreview);
    if (collegeInput) collegeInput.addEventListener('input', updatePreview);
    if (branchInput)  branchInput.addEventListener('input', updatePreview);

    const btnReg = document.getElementById('btnCompleteRegistration');
    if (btnReg) {
      btnReg.addEventListener('click', () => {
        const fullName = nameInput?.value.trim();
        const college  = collegeInput?.value.trim();
        const branch   = branchInput?.value.trim() || 'B.Tech / Graduate Program';

        if (!fullName) {
          this.ui.showToast('warning', 'Full Name Required', 'Please enter your full name to continue.');
          nameInput?.focus();
          return;
        }
        if (!college) {
          this.ui.showToast('warning', 'College Name Required', 'Please enter your college or university name.');
          collegeInput?.focus();
          return;
        }

        // 1. Prepare the data for our Python FastAPI backend
        const backendPayload = {
            student_name: fullName,
            // We combine their college and branch to act as their baseline resume text
            resume_text: `I study at ${college} in ${branch}. I have skills in Python, React, and SQL.`,
            target_role: "backend developer"
        };

        // 2. Send the data to the Python server
        fetch('http://127.0.0.1:8000/api/workflow/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(backendPayload)
        })
        .then(response => response.json())
        .then(data => {
            // 3. The Python backend has successfully processed and saved the data!
            console.log("Success from Python Backend!", data);
            
            // Show a success message using the backend's calculated match score
            this.ui.showToast('success', 'AI Analysis Complete', `Your skill match score is ${data.match_score}`);

            // 4. Log the user into the frontend dashboard
            const user = {
                phone: this._pendingPhone,
                role: this._pendingRole || 'student',
                fullName,
                college,
                branch,
                userId: `USR-${data.database_id}`, // Using the real SQLite Database ID!
            };

            this.loginSuccess(user);
        })
        .catch(error => {
            console.error("Failed to connect to Python backend:", error);
            this.ui.showToast('warning', 'Server Error', 'Ensure your Python FastAPI server is running.');
        });
      });
    }
  }

  switchPortalRole(role) {
    this.currentRole = role;

    // Update navigation tab pills
    const tabs = document.querySelectorAll('.role-pill-tab');
    tabs.forEach(t => {
      if (t.dataset.role === role) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Toggle portal views
    const studentView = document.getElementById('studentPortalView');
    const industryView = document.getElementById('industryPortalView');
    const academiaView = document.getElementById('academiaPortalView');

    if (studentView) studentView.classList.toggle('active', role === 'student');
    if (industryView) industryView.classList.toggle('active', role === 'industry');
    if (academiaView) academiaView.classList.toggle('active', role === 'academia');

    // Trigger role-specific rendering
    if (role === 'student') {
      this.ui.renderStudentPortal();
    } else if (role === 'industry') {
      this.ui.renderIndustryPortal();
      this.fetchRealStudentsFromBackend();
    } else if (role === 'academia') {
      this.ui.renderAcademiaPortal();
    }
  }

  setupDashboardListeners() {
    // Role switcher tabs in main header
    const tabs = document.querySelectorAll('.role-pill-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const role = tab.dataset.role;
        this.switchPortalRole(role);
      });
    });
    // Look for the "Run Query" or "Execute" button in the DBMS UI
    const btnExecuteSql = document.querySelector('.sql-actions-bar button');
    if (btnExecuteSql) {
      btnExecuteSql.addEventListener('click', () => {
        this.executeLiveSQL();
      });
    }

    // Student target career dropdown (Live AI Connection)
    const roleSelect = document.getElementById('studentTargetRoleSelect');
    if (roleSelect) {
      roleSelect.addEventListener('change', async (e) => {
        const selectedRole = e.target.value;
        this.ui.selectedCareerRole = selectedRole;
        
        try {
          // 1. Send the requested role to Python's AI Gap Analysis endpoint
          const response = await fetch('http://127.0.0.1:8000/api/analysis/gap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              student_skills: ["python", "react"], // The student's current baseline skills
              target_role: selectedRole
            })
          });
          
          const aiData = await response.json();
          
          // 2. If the AI responds successfully, update the UI dynamically!
          if (aiData.match_score) {
            // Update the massive Radial Gauge Number
            const gaugeVal = document.querySelector('.gauge-val-big');
            if (gaugeVal) gaugeVal.textContent = aiData.match_score;
            
            // Update the red "Missing Skills" cloud
            // We target the second .skill-column-box which holds the missing skills
            const missingSkillsContainer = document.querySelectorAll('.skill-column-box .skill-tags-cloud')[1];
            if (missingSkillsContainer && aiData.missing_competencies) {
                missingSkillsContainer.innerHTML = aiData.missing_competencies
                    .map(skill => `<span class="skill-chip missing">${skill}</span>`)
                    .join('');
            }

            this.ui.showToast('info', 'AI Analysis Complete', `Career path optimized for ${aiData.target_role}`);
          }
        } catch (error) {
          console.error("AI Engine Error:", error);
          // Fallback to fake UI if the Python backend is off
          this.ui.renderSkillGapEngine(); 
        }
      });
    }

    // Opportunity filters
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(f => {
      f.addEventListener('click', () => {
        filterTabs.forEach(item => item.classList.remove('active'));
        f.classList.add('active');
        this.ui.currentFilter = f.dataset.filter;
        this.ui.renderOpportunities();
      });
    });

    // Candidate search in industry portal
    const searchInput = document.getElementById('candidateSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.ui.candidateSearchQuery = e.target.value;
        this.ui.renderCandidatePool();
      });
    }

    // Post job form
    const postJobForm = document.getElementById('postJobForm');
    if (postJobForm) {
      postJobForm.addEventListener('submit', (e) => {
        this.ui.postNewInternship(e);
      });
    }

    // Logout button
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('spars_active_role');
        window.location.reload();
      });
    }
  }
  // --- NEW INTEGRATION: Fetch Real Data from Python Backend ---
  async fetchRealStudentsFromBackend() {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/profiles');
      const data = await response.json();
      
      console.log("Real Python Data Retrieved:", data);
      
      const tableBody = document.getElementById('recruiterCandidatesTableBody');
      if (tableBody && data.profiles) {
        tableBody.innerHTML = ''; // Clear the fake mock data
        
        // Loop through the real database profiles and render them
        data.profiles.forEach(profile => {
          const skillsHtml = profile.skill_passport 
            ? profile.skill_passport.map(skill => `<span class="skill-chip mastered">${skill}</span>`).join('') 
            : '';

          const row = `
            <tr>
              <td>
                <div style="font-weight:700; color:var(--text-primary);">${profile.student_name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${profile.target_role}</div>
              </td>
              <td>Delhi Technological University (DTU)</td>
              <td>8.84</td>
              <td><div class="skill-tags-cloud">${skillsHtml}</div></td>
              <td><span class="pill-badge pill-cyan">Match: ${profile.match_score}</span></td>
              <td>
                <button class="btn-tactile btn-tactile-secondary" style="padding: 4px 10px; font-size: 0.75rem;">View Profile</button>
              </td>
            </tr>
          `;
          tableBody.insertAdjacentHTML('beforeend', row);
        });
      }
    } catch (error) {
      console.error("Failed to fetch from Python backend:", error);
    }
  }
  // --- NEW INTEGRATION: Live DBMS SQL Executor ---
  async executeLiveSQL() {
    // 1. Get the SQL query from the frontend text area
    const sqlTextarea = document.querySelector('.sql-input-textarea');
    const query = sqlTextarea ? sqlTextarea.value : "";
    
    if (!query) return;

    try {
      // 2. Send the query to your Python backend
      const response = await fetch('http://127.0.0.1:8000/api/dbms/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query })
      });
      
      const result = await response.json();
      
      // 3. Find the results table in the UI
      const resultsTable = document.querySelector('.dbms-results-table');
      if (!resultsTable) return;
      
      if (result.success && result.columns) {
        // Clear old results
        resultsTable.innerHTML = '';
        
        // Generate Table Headers dynamically based on the Python response
        const thead = document.createElement('thead');
        const headerRow = `<tr>${result.columns.map(col => `<th>${col}</th>`).join('')}</tr>`;
        thead.innerHTML = headerRow;
        resultsTable.appendChild(thead);
        
        // Generate Table Rows dynamically
        const tbody = document.createElement('tbody');
        result.data.forEach(rowData => {
          const rowHtml = `<tr>${result.columns.map(col => `<td>${rowData[col]}</td>`).join('')}</tr>`;
          tbody.insertAdjacentHTML('beforeend', rowHtml);
        });
        resultsTable.appendChild(tbody);
        
        this.ui.showToast('success', 'Query Successful', `Returned ${result.data.length} rows.`);
      } else if (result.error) {
        this.ui.showToast('warning', 'SQL Error', result.error);
      }
    } catch (error) {
      console.error("DBMS Error:", error);
      this.ui.showToast('warning', 'Connection Error', 'Could not reach the Python DBMS endpoint.');
    }
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  const app = new AppController();
  app.init();
});
