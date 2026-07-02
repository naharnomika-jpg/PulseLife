// Responsive navigation header component
import { store } from '../store.js';

export const Navbar = {
  render(userObj) {
    const gamification = store.state.gamification[userObj.email] || { points: 0, streak: 0, level: 1 };
    const firstInitial = userObj.name ? userObj.name.charAt(0).toUpperCase() : 'U';
    const lang = store.state.settings.lang || 'en';
    
    // Dynamic translations helper for navbar actions
    const t = {
      en: { points: 'pts', streak: 'day streak', logout: 'Logout' },
      es: { points: 'pts', streak: 'días de racha', logout: 'Cerrar sesión' },
      fr: { points: 'pts', streak: 'jours de streak', logout: 'Déconnexion' }
    }[lang];

    return `
      <nav class="navbar">
        <a href="#/dashboard" class="logo">
          <i class="fa-solid fa-heart-pulse"></i> PulseLife
        </a>

        <div class="nav-actions">
          <!-- Gamification Quick Stats -->
          <div style="display: flex; gap: 1rem; align-items: center; background: rgba(59, 130, 246, 0.1); padding: 0.4rem 1rem; border-radius: 50px; border: 1px solid rgba(59, 130, 246, 0.2);">
            <div style="display: flex; align-items: center; gap: 0.4rem; color: #10b981; font-weight: 700; font-size: 0.9rem;" title="Level">
              <i class="fa-solid fa-medal"></i>
              <span>Lvl ${gamification.level}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem; color: #3b82f6; font-weight: 700; font-size: 0.9rem;" title="Total Points">
              <i class="fa-solid fa-star"></i>
              <span>${gamification.points} ${t.points}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem; color: #f59e0b; font-weight: 700; font-size: 0.9rem;" title="Daily Streak">
              <i class="fa-solid fa-fire"></i>
              <span>${gamification.streak} ${t.streak}</span>
            </div>
          </div>

          <!-- Language Selector -->
          <select id="navbar-lang-select" class="lang-dropdown">
            <option value="en" ${lang === 'en' ? 'selected' : ''}>🇬🇧 EN</option>
            <option value="es" ${lang === 'es' ? 'selected' : ''}>🇪🇸 ES</option>
            <option value="fr" ${lang === 'fr' ? 'selected' : ''}>🇫🇷 FR</option>
          </select>

          <!-- Theme Toggle -->
          <button id="navbar-theme-toggle" class="theme-toggle" title="Toggle Theme">
            <i class="fa-solid fa-moon"></i>
          </button>

          <!-- User Menu Profile -->
          <div class="user-menu" style="position: relative;" id="user-menu-trigger">
            <div class="avatar">${firstInitial}</div>
            <span style="font-weight: 600; font-size: 0.9rem;" class="hide-mobile">${userObj.name.split(' ')[0]}</span>
            <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem; color: var(--text-muted);"></i>

            <!-- Dropdown Menu -->
            <div id="navbar-user-dropdown" class="glass-card" style="display: none; position: absolute; top: 45px; right: 0; width: 180px; z-index: 10000; padding: 0.8rem; box-shadow: var(--shadow-main); background: var(--bg-sidebar);">
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; text-align: left;">
                <li>
                  <a href="#/settings" style="display: flex; align-items: center; gap: 0.8rem; text-decoration: none; color: var(--text-main); font-size: 0.9rem; padding: 0.4rem;" onclick="document.getElementById('navbar-user-dropdown').style.display='none'">
                    <i class="fa-solid fa-user-gear"></i> Settings
                  </a>
                </li>
                <li style="border-top: 1px solid var(--border-color); margin-top: 0.4rem; padding-top: 0.4rem;">
                  <button id="navbar-logout-btn" style="display: flex; align-items: center; gap: 0.8rem; width: 100%; border: none; background: none; color: #ef4444; font-size: 0.9rem; padding: 0.4rem; text-align: left; cursor: pointer; font-weight: 600;">
                    <i class="fa-solid fa-right-from-bracket"></i> ${t.logout}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    `;
  }
};

// Global click listeners for dropdown and logout execution
document.addEventListener('click', (e) => {
  const trigger = document.getElementById('user-menu-trigger');
  const dropdown = document.getElementById('navbar-user-dropdown');
  if (trigger && dropdown) {
    if (trigger.contains(e.target)) {
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    } else if (!dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  }

  // Handle Logout click
  const logoutBtn = document.getElementById('navbar-logout-btn');
  if (logoutBtn && logoutBtn.contains(e.target)) {
    store.logout();
    window.location.hash = '#/login';
  }

  // Handle Language selector change
  const langSelect = document.getElementById('navbar-lang-select');
  if (langSelect && e.target === langSelect) {
    langSelect.addEventListener('change', (evt) => {
      const selectedLang = evt.target.value;
      store.setLanguage(selectedLang);
      window.location.reload(); // Reload SPA to trigger translation engine refresh
    });
  }
});

export default Navbar;
