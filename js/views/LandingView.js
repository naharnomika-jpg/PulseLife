// Landing page view
import { i18n } from '../utils/i18n.js';
import { store } from '../store.js';

export const LandingView = {
  render() {
    const isLogged = store.state.currentUser;
    const ctaLink = isLogged ? '#/dashboard' : '#/login';
    
    return `
      <div style="min-height: 100vh; display: flex; flex-direction: column;">
        <!-- Header -->
        <header class="navbar" style="position: static;">
          <a href="#" class="logo">
            <i class="fa-solid fa-heart-pulse"></i> PulseLife
          </a>
          <div style="display: flex; gap: 1rem;">
            ${isLogged ? `
              <a href="#/dashboard" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-gauge"></i> Dashboard
              </a>
            ` : `
              <a href="#/login" class="btn btn-secondary btn-sm">${i18n.t('login')}</a>
              <a href="#/login?tab=register" class="btn btn-primary btn-sm">${i18n.t('register')}</a>
            `}
          </div>
        </header>

        <!-- Hero Section -->
        <section style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4rem 2rem; background: radial-gradient(circle at center, rgba(59, 130, 246, 0.12) 0%, transparent 70%);">
          <div style="max-width: 800px; display: flex; flex-direction: column; gap: 1.5rem; align-items: center;">
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.85rem; font-weight: 700; color: #60a5fa; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-circle-nodes"></i>
              <span>INTRODUCING HEALTH INTELLIGENCE v1.0</span>
            </div>
            
            <h1 style="font-size: clamp(2.2rem, 5vw, 3.8rem); line-height: 1.1; font-weight: 800; font-family: var(--font-heading); color: var(--text-main);">
              ${i18n.t('landingTitle')}
            </h1>
            
            <p style="font-size: clamp(1rem, 2vw, 1.25rem); color: var(--text-muted); line-height: 1.6; max-width: 650px;">
              ${i18n.t('landingSub')}
            </p>
            
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
              <a href="${ctaLink}" class="btn btn-primary" style="font-size: 1.1rem; padding: 0.9rem 2rem; box-shadow: var(--shadow-glow);">
                ${i18n.t('getStarted')} <i class="fa-solid fa-arrow-right"></i>
              </a>
              <a href="#/login" class="btn btn-secondary" style="font-size: 1.1rem; padding: 0.9rem 2rem;">
                <i class="fa-solid fa-play"></i> Watch Demo
              </a>
            </div>
          </div>
        </section>

        <!-- Features Showcase Grid -->
        <section style="max-width: 1400px; margin: 0 auto; padding: 4rem 2rem; width: 100%;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Full-Suite Wellness Management</h2>
            <p style="color: var(--text-muted);">Engineered with next-gen habits collection and cognitive analytics.</p>
          </div>

          <div class="grid-cols-4">
            <div class="glass-card">
              <div class="card-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; margin-bottom: 1rem;">
                <i class="fa-solid fa-chart-line"></i>
              </div>
              <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; font-family: var(--font-heading);">Lifestyle Score</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">Calculates an overall index out of 100 across sleep, exercises, stress, and nutrition parameters.</p>
            </div>

            <div class="glass-card">
              <div class="card-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981; margin-bottom: 1rem;">
                <i class="fa-solid fa-robot"></i>
              </div>
              <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; font-family: var(--font-heading);">AI Coach Chat</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">Interact with an intelligent virtual wellness coach who answers queries and designs workout/diet schemes.</p>
            </div>

            <div class="glass-card">
              <div class="card-icon" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6; margin-bottom: 1rem;">
                <i class="fa-solid fa-microphone"></i>
              </div>
              <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; font-family: var(--font-heading);">Voice Input Log</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">Log habits hands-free using state-of-the-art Web Speech transcribers. Just talk to update parameters.</p>
            </div>

            <div class="glass-card">
              <div class="card-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; margin-bottom: 1rem;">
                <i class="fa-solid fa-trophy"></i>
              </div>
              <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; font-family: var(--font-heading);">Gamification</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">Unlock ranks, badges, levels, and earn XP points as you perform healthy challenges.</p>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer style="background-color: var(--bg-sidebar); border-top: 1px solid var(--border-color); padding: 2rem; text-align: center; font-size: 0.85rem; color: var(--text-muted);">
          <p>© 2026 PulseLife. Secured with client-side local database encryption. GDPR Compliant.</p>
        </footer>
      </div>
    `;
  },
  init() {}
};

export default LandingView;
