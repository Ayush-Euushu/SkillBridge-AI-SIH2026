# SPARS - SIH 2026 (Problem Statement ID: SIH26044)
## Portal for Academia–Industry Collaboration for Skill Mapping, Internships and Placement

**Team Name:** SPARS  
**Theme:** Smart Automation  
**Category:** Software  
**Sponsoring Body:** Ministry of Ayush & AICTE (All India Institute of Ayurveda Linked)

---

## 🌟 Key Features & Capabilities

### 1. 📱 Dedicated Smartphone Device Simulation (No Screen-Top Popups!)
- An interactive, titanium smartphone device mockup is rendered directly on screen beside the portal.
- Features digital clock, battery indicator, and live carrier network detection (`Jio 5G`, `Airtel 5G`, `Vi 4G`).
- When the user enters their mobile number and clicks **"Send OTP to Mobile Phone"**:
  - The smartphone device vibrates with realistic CSS haptic animations.
  - An authentic two-tone notification chime sounds via Web Audio API.
  - The phone transitions from standby to the **Messages App** showing the official SMS text bubble from `SPARS-GOV`:
    > *"Your verification OTP for SPARS Portal (SIH26044) is: [482910]. Valid for 5 mins."*
  - The user can click **"📋 Copy & Fill"** on the smartphone screen or manually enter the 6 digits into the portal!

### 2. 🗄️ Connected Relational Database Management System (DBMS)
- Full SQL database schema (`backend/schema.sql`) with ACID-compliant relational tables:
  - `users`: User identity, mobile numbers, roles, and verification status.
  - `sms_otp_logs`: Complete audit trail of generated SMS verification codes, carrier providers, and delivery status.
  - `students`: Academic profiles, CGPA, verified technical competencies, and cryptographic skill passport hashes.
  - `jobs`: Internship and placement openings with required skill sets and stipend details.
  - `applications`: Real-time application tracking (Applied ➔ Assessed ➔ Interviewed ➔ Offered).
  - `curriculum_audit`: Academic syllabus vs 2026 industry demand comparison matrix.
  - `mous`: Institutional corporate tie-ups and reserved student slots.
- **Interactive Live DBMS Studio**:
  - Accessible via the **"🗄️ Live DBMS Studio"** button in the top navigation bar.
  - Run real SQL queries (e.g. `SELECT * FROM students;` or `SELECT * FROM sms_otp_logs;`).
  - View row counts, query execution times in milliseconds, and export the database as a `.sql` dump file!

### 3. 🌓 Persistent Light & Dark Theme System
- Designed with high-contrast, bespoke aesthetics (NOT generic AI templates).
- **Light Theme**: Crisp Swiss luxury GovTech design with national saffron and emerald accents.
- **Dark Theme**: Bioluminescent obsidian night (`#06090f` and `#0e1422`) with glowing cyan borders and cybernetic mesh overlay.
- One-click segmented toggle with instant persistence in `localStorage`.

### 4. 🎓 🏢 🏛️ Triple Stakeholder Portals
- **Student Scholar Portal**:
  - Interactive AI Skill Gap Radial Gauge with dynamic percentage scoring.
  - Select target industry roles to see Mastered Competencies vs Missing Demands.
  - 1-Click personalized learning pathways mapping missing skills to NPTEL / SWAYAM / Coursera courses.
  - 1-Click Direct Application with SPARS Skill Passport.
  - Verified Digital Offer Letter preview and download.
- **Corporate Recruiter Portal**:
  - Post new internships and jobs directly to the DBMS.
  - AI Candidate Matcher pre-screening applicants with compatibility scores.
  - Candidate Dossier modal with GitHub / repository credentials and direct interview invites.
- **Academic Dean & TPO Portal**:
  - Automated Curriculum-to-Industry 2026 Gap Matrix.
  - Department placement rate analytics.
  - Active Industry MoU manager.
  - Export AICTE Curriculum Reform dossier.

---

## 🚀 How to Run

1. Simply double-click `index.html` to open directly in any web browser (Chrome, Edge, Firefox, Brave, Safari).
2. Or run with Python:
   ```bash
   python serve.py
   ```
   and visit `http://localhost:8080`.
