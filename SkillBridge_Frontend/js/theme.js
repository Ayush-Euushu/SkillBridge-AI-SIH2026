/* ==========================================================================
   SPARS THEME ENGINE (LIGHT / DARK THEME TOGGLE)
   ========================================================================== */

const THEME_STORAGE_KEY = 'spars_portal_theme';

export class ThemeManager {
  constructor() {
    this.currentTheme = this.getSavedTheme() || this.getSystemPreference();
    this.init();
  }

  getSavedTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  init() {
    this.applyTheme(this.currentTheme);

    // Listen for OS system theme changes if user hasn't explicitly set preference
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!this.getSavedTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Storage disabled');
    }

    this.updateToggleButtons();

    // Dispatch event for UI components or charts if needed
    window.dispatchEvent(new CustomEvent('sparsThemeChanged', { detail: { theme } }));
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    return nextTheme;
  }

  updateToggleButtons() {
    const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
    toggleButtons.forEach((btn) => {
      const icon = btn.querySelector('.theme-icon-indicator');
      const text = btn.querySelector('.theme-text-indicator');

      if (this.currentTheme === 'dark') {
        if (icon) icon.innerHTML = '☀️';
        if (text) text.textContent = 'Light Mode';
        btn.setAttribute('title', 'Switch to Light Theme');
        btn.setAttribute('aria-label', 'Switch to Light Theme');
      } else {
        if (icon) icon.innerHTML = '🌙';
        if (text) text.textContent = 'Dark Mode';
        btn.setAttribute('title', 'Switch to Dark Theme');
        btn.setAttribute('aria-label', 'Switch to Dark Theme');
      }
    });
  }
}

export const themeManager = new ThemeManager();
