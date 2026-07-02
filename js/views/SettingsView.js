// Settings and Profile configuration view
import { store } from '../store.js';
import { Toast } from '../components/Toast.js';
import { i18n } from '../utils/i18n.js';

export const SettingsView = {
  render() {
    const userObj = store.state.users[store.state.currentUser];
    const lang = store.state.settings.lang;

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div>
          <h1 style="font-size: 1.8rem; font-family: var(--font-heading);">${i18n.t('profileSettings')}</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Configure your personal health biomarkers and application preferences.</p>
        </div>

        <div class="grid-cols-3" style="align-items: flex-start;">
          
          <!-- Column 1 & 2: Biomarkers profile details (Spans 2 cols) -->
          <div class="glass-card" style="grid-column: span 2;">
            <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.2rem;">
              <i class="fa-solid fa-user-gear" style="color: #3b82f6;"></i> Update Personal Biomarkers
            </h3>

            <form id="settings-profile-form" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="set-name" class="form-control" value="${userObj.name}" required>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label>Age (years)</label>
                  <input type="number" id="set-age" class="form-control" value="${userObj.details.age}" required>
                </div>
                <div class="form-group">
                  <label>Gender</label>
                  <select id="set-gender" class="form-control">
                    <option value="Male" ${userObj.details.gender === 'Male' ? 'selected' : ''}>Male</option>
                    <option value="Female" ${userObj.details.gender === 'Female' ? 'selected' : ''}>Female</option>
                    <option value="Non-binary" ${userObj.details.gender === 'Non-binary' ? 'selected' : ''}>Non-binary</option>
                    <option value="Other" ${userObj.details.gender === 'Other' ? 'selected' : ''}>Other</option>
                  </select>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label>Height (cm)</label>
                  <input type="number" id="set-height" class="form-control" value="${userObj.details.height}" required>
                </div>
                <div class="form-group">
                  <label>Weight (kg)</label>
                  <input type="number" id="set-weight" class="form-control" value="${userObj.details.weight}" required>
                </div>
              </div>

              <div class="form-group">
                <label>Occupation</label>
                <input type="text" id="set-occupation" class="form-control" value="${userObj.details.occupation}" required>
              </div>

              <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem;">
                <i class="fa-solid fa-floppy-disk"></i> Save Profile Details
              </button>
            </form>
          </div>

          <!-- Column 3: Language, Toggles, and Feedback (Spans 1 col) -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <!-- Preferences Panel -->
            <div class="glass-card">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.2rem;">
                <i class="fa-solid fa-sliders" style="color: #10b981;"></i> Preferences
              </h3>

              <div class="form-group">
                <label>${i18n.t('selectLanguage')}</label>
                <select id="settings-lang-select" class="form-control">
                  <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
                  <option value="es" ${lang === 'es' ? 'selected' : ''}>Español</option>
                  <option value="fr" ${lang === 'fr' ? 'selected' : ''}>Français</option>
                </select>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1rem;">
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">${i18n.t('darkMode')}</label>
                <input type="checkbox" id="settings-theme-checkbox" style="width: 20px; height: 20px; cursor: pointer;"
                  ${store.state.settings.theme === 'dark' ? 'checked' : ''}>
              </div>
            </div>

            <!-- API Configuration Card -->
            <div class="glass-card">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <i class="fa-solid fa-key" style="color: #f59e0b;"></i> API Configuration
              </h3>
              
              <form id="settings-api-form" style="display: flex; flex-direction: column; gap: 0.8rem;">
                <div class="form-group">
                  <label>Groq API Key</label>
                  <input type="password" id="set-groq-key" class="form-control" 
                    value="${store.state.settings.groqKey || ''}" 
                    placeholder="Enter your gsk_... key" style="font-family: monospace;">
                </div>
                <button type="submit" class="btn btn-secondary btn-sm" style="width: 100%;">
                  Save API Key
                </button>
              </form>
            </div>

            <!-- Submit Feedback Card -->
            <div class="glass-card">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <i class="fa-solid fa-comment-dots" style="color: #8b5cf6;"></i> Send Feedback
              </h3>
              
              <form id="settings-feedback-form" style="display: flex; flex-direction: column; gap: 0.8rem;">
                <div class="form-group">
                  <label>Message</label>
                  <textarea id="feedback-message" class="form-control" rows="3" placeholder="Suggest a feature or report a bug..." required></textarea>
                </div>
                <button type="submit" class="btn btn-secondary btn-sm" style="width: 100%;">
                  Submit Feedback
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    `;
  },

  init() {
    const profileForm = document.getElementById('settings-profile-form');
    const apiForm = document.getElementById('settings-api-form');
    const feedbackForm = document.getElementById('settings-feedback-form');
    const langSelect = document.getElementById('settings-lang-select');
    const themeCheckbox = document.getElementById('settings-theme-checkbox');

    // Profile Details Update Submit
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('set-name').value;
        const details = {
          age: Number(document.getElementById('set-age').value),
          gender: document.getElementById('set-gender').value,
          height: Number(document.getElementById('set-height').value),
          weight: Number(document.getElementById('set-weight').value),
          occupation: document.getElementById('set-occupation').value
        };

        store.updateProfileDetails(name, details);
        Toast.success('Bio metrics updated. Caloric guidelines successfully re-calculated.');
        setTimeout(() => window.router.navigateTo('dashboard'), 500);
      });
    }

    // API Key Update Submit
    if (apiForm) {
      apiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const keyVal = document.getElementById('set-groq-key').value.trim();
        store.setGroqKey(keyVal);
        Toast.success('Groq API Key successfully updated.');
      });
    }

    // Feedback Submit
    if (feedbackForm) {
      feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msgVal = document.getElementById('feedback-message').value;
        store.addFeedback(msgVal);
        document.getElementById('feedback-message').value = '';
        Toast.success('Feedback successfully dispatched. Thank you!');
      });
    }

    // System Language Selector
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        store.setLanguage(e.target.value);
        Toast.success('System language configuration stored.');
        setTimeout(() => window.location.reload(), 300);
      });
    }

    // Theme Checkbox Toggle
    if (themeCheckbox) {
      themeCheckbox.addEventListener('change', (e) => {
        const nextTheme = e.target.checked ? 'dark' : 'light';
        
        document.body.classList.remove('dark-mode', 'light-mode');
        document.body.classList.add(`${nextTheme}-mode`);
        
        store.setTheme(nextTheme);
        Toast.success(`Theme updated: ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
      });
    }
  }
};

export default SettingsView;
