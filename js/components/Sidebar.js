// Sidebar navigation panel component
import { store } from '../store.js';

export const Sidebar = {
  render(currentPath, isAdmin = false) {
    const lang = store.state.settings.lang || 'en';

    // Sidebar items localized dictionary
    const t = {
      en: {
        dashboard: 'Dashboard',
        logs: 'Log Daily Habits',
        analytics: 'Analytics & Trends',
        chat: 'AI Chat Assistant',
        planners: 'AI Health Planners',
        rewards: 'Streaks & Achievements',
        reports: 'PDF Reports',
        settings: 'Settings & Profile',
        admin: 'Admin Dashboard'
      },
      es: {
        dashboard: 'Panel de Control',
        logs: 'Registrar Hábitos',
        analytics: 'Análisis y Tendencias',
        chat: 'Asistente de IA',
        planners: 'Planificadores de IA',
        rewards: 'Rachas y Logros',
        reports: 'Reportes PDF',
        settings: 'Ajustes y Perfil',
        admin: 'Consola de Admin'
      },
      fr: {
        dashboard: 'Tableau de Bord',
        logs: 'Enregistrer Habitudes',
        analytics: 'Analyses & Tendances',
        chat: 'Assistant IA',
        planners: 'Planificateurs IA',
        rewards: 'Streaks & Trophées',
        reports: 'Rapports PDF',
        settings: 'Paramètres & Profil',
        admin: 'Console Admin'
      }
    }[lang];

    const activeClass = (path) => currentPath === path ? 'active' : '';

    return `
      <aside class="sidebar">
        <ul class="sidebar-nav">
          <li>
            <a href="#/dashboard" class="${activeClass('dashboard')}">
              <i class="fa-solid fa-chart-pie"></i>
              <span>${t.dashboard}</span>
            </a>
          </li>
          <li>
            <a href="#/logs" class="${activeClass('logs')}">
              <i class="fa-solid fa-clipboard-list"></i>
              <span>${t.logs}</span>
            </a>
          </li>
          <li>
            <a href="#/analytics" class="${activeClass('analytics')}">
              <i class="fa-solid fa-chart-line"></i>
              <span>${t.analytics}</span>
            </a>
          </li>
          <li>
            <a href="#/chat" class="${activeClass('chat')}">
              <i class="fa-solid fa-robot"></i>
              <span>${t.chat}</span>
            </a>
          </li>
          <li>
            <a href="#/planners" class="${activeClass('planners')}">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>${t.planners}</span>
            </a>
          </li>
          <li>
            <a href="#/gamification" class="${activeClass('gamification')}">
              <i class="fa-solid fa-fire-flame-curved"></i>
              <span>${t.rewards}</span>
            </a>
          </li>
          <li>
            <a href="#/reports" class="${activeClass('reports')}">
              <i class="fa-solid fa-file-export"></i>
              <span>${t.reports}</span>
            </a>
          </li>
          <li>
            <a href="#/settings" class="${activeClass('settings')}">
              <i class="fa-solid fa-gear"></i>
              <span>${t.settings}</span>
            </a>
          </li>
          ${isAdmin ? `
            <li style="border-top: 1px solid var(--border-color); margin-top: 0.8rem; padding-top: 0.8rem;">
              <a href="#/admin" class="${activeClass('admin')}" style="color: #10b981;">
                <i class="fa-solid fa-shield-halved" style="color: #10b981;"></i>
                <span>${t.admin}</span>
              </a>
            </li>
          ` : ''}
        </ul>

        <div style="padding: 1rem; border-radius: var(--border-radius-sm); background: var(--border-color); font-size: 0.75rem; color: var(--text-muted); text-align: center;" class="hide-mobile">
          <strong>PulseLife v1.0.0</strong><br>
          AI-Powered Health Companion
        </div>
      </aside>
    `;
  }
};

export default Sidebar;
