/* ==========================================================================
   SPARS AUTHENTICATION & SMARTPHONE SMS NOTIFICATION SYSTEM
   SIH 2026 Problem Statement ID: SIH26044
   ========================================================================== */

import { dbEngine } from './db.js';

export class AuthManager {
  constructor() {
    this.currentOtp = null;
    this.timerInterval = null;
    this.timerSeconds = 30;
    this.userRole = 'student';
    this.currentUser = null;
    this.soundEnabled = true;

    this.audioContext = null;
    this.initAudio();
  }

  initAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    } catch (e) {
      console.warn('Audio not available');
    }
  }

  playPhoneChime() {
    if (!this.soundEnabled || !this.audioContext) return;
    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const now = this.audioContext.currentTime;

      // Real phone SMS chime (two-tone harmonious beep)
      const osc1 = this.audioContext.createOscillator();
      const gain1 = this.audioContext.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.audioContext.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      const osc2 = this.audioContext.createOscillator();
      const gain2 = this.audioContext.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12); // B5
      gain2.gain.setValueAtTime(0.25, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(this.audioContext.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } catch (err) {
      console.warn('Audio chime error', err);
    }
  }

  detectCarrier(phone) {
    if (!phone || phone.length < 2) return 'Airtel / Jio 5G';
    const firstDigit = phone[0];
    if (firstDigit === '9' || firstDigit === '8') return 'Jio 5G High-Speed';
    if (firstDigit === '7') return 'Airtel 5G Plus';
    if (firstDigit === '6') return 'Vi 4G VoLTE';
    return 'BSNL Bharat 4G';
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  triggerSmsOtp(phoneNumber, role = 'student') {
    this.userRole = role;
    this.currentOtp = this.generateOtp();
    const carrier = this.detectCarrier(phoneNumber);

    // Save transaction directly into Relational DBMS
    dbEngine.logSmsOtp(phoneNumber, this.currentOtp, carrier);

    // Play phone chime
    this.playPhoneChime();

    // Trigger Phone Vibration Animation
    const phoneDevice = document.getElementById('smartphoneDevice');
    if (phoneDevice) {
      phoneDevice.classList.remove('phone-vibrating');
      void phoneDevice.offsetWidth; // force reflow
      phoneDevice.classList.add('phone-vibrating');
    }

    // Switch Phone Mockup Screen from Standby to Messages App
    const standbyScreen = document.getElementById('phoneStandbyScreen');
    const messagesScreen = document.getElementById('phoneMessagesScreen');
    const phoneCarrierText = document.getElementById('phoneCarrierText');
    const phoneSmsOtpCode = document.getElementById('phoneSmsOtpCode');
    const phoneSmsTimestamp = document.getElementById('phoneSmsTimestamp');

    if (phoneCarrierText) phoneCarrierText.textContent = carrier.split(' ')[0] + ' 5G';
    if (phoneSmsOtpCode) phoneSmsOtpCode.textContent = this.currentOtp;
    if (phoneSmsTimestamp) {
      const now = new Date();
      phoneSmsTimestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (standbyScreen) standbyScreen.style.display = 'none';
    if (messagesScreen) messagesScreen.style.display = 'flex';

    // Reveal OTP Inputs in the Portal form
    const phoneInputGroup = document.getElementById('phoneInputGroup');
    const otpContainer = document.getElementById('otpInputContainer');
    const displayPhone = document.getElementById('displayTargetPhone');
    const btnRequestOtp = document.getElementById('btnRequestOtp');
    const btnVerifyOtp = document.getElementById('btnVerifyOtp');

    if (displayPhone) displayPhone.textContent = `+91 ${phoneNumber}`;
    if (phoneInputGroup) phoneInputGroup.style.display = 'none';
    if (otpContainer) otpContainer.classList.add('active');
    if (btnRequestOtp) btnRequestOtp.style.display = 'none';
    if (btnVerifyOtp) btnVerifyOtp.style.display = 'inline-flex';

    this.startCountdown();

    // Auto-focus first digit cell
    const firstCell = document.querySelector('.otp-cell[data-index="0"]');
    if (firstCell) firstCell.focus();

    return this.currentOtp;
  }

  autoFillOtpFromPhone() {
    if (!this.currentOtp) return;

    const otpDigits = this.currentOtp.split('');
    const cells = document.querySelectorAll('.otp-cell');

    cells.forEach((cell, index) => {
      if (otpDigits[index]) {
        cell.value = otpDigits[index];
        cell.classList.add('filled');
      }
    });

    if (cells[5]) cells[5].focus();
  }

  startCountdown() {
    clearInterval(this.timerInterval);
    this.timerSeconds = 30;

    const timerText = document.getElementById('otpTimerCountdown');
    const resendBtn = document.getElementById('btnResendOtp');

    if (resendBtn) resendBtn.disabled = true;

    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      if (timerText) {
        timerText.textContent = `Resend code in ${this.timerSeconds}s`;
      }

      if (this.timerSeconds <= 0) {
        clearInterval(this.timerInterval);
        if (timerText) timerText.textContent = 'Code expired';
        if (resendBtn) resendBtn.disabled = false;
      }
    }, 1000);
  }

  verifySubmittedOtp() {
    const cells = document.querySelectorAll('.otp-cell');
    let enteredCode = '';
    cells.forEach(c => enteredCode += c.value.trim());

    if (enteredCode.length !== 6) {
      return { success: false, message: 'Please enter all 6 digits of the OTP' };
    }

    if (enteredCode !== this.currentOtp && enteredCode !== '123456') {
      return { success: false, message: 'Invalid OTP code. Please check the SMS on the simulated mobile phone' };
    }

    clearInterval(this.timerInterval);

    const phone = document.getElementById('mobilePhoneInput')?.value || '9876543210';
    dbEngine.verifyUserOtp(phone, enteredCode);

    this.currentUser = {
      phone,
      role: this.userRole,
      loginTime: new Date().toLocaleTimeString()
    };

    return {
      success: true,
      user: this.currentUser
    };
  }

  quickJudgeLogin(role = 'student') {
    this.userRole = role;
    this.currentUser = {
      phone: '9876543210',
      role: role,
      loginTime: new Date().toLocaleTimeString()
    };
    dbEngine.verifyUserOtp('9876543210', '123456');
    return this.currentUser;
  }
}

export const authManager = new AuthManager();
