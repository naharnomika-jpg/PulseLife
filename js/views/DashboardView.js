// Dashboard page view
import { store } from '../store.js';
import { AIEngine } from '../utils/ai.js';
import { Toast } from '../components/Toast.js';
import { i18n } from '../utils/i18n.js';

export const DashboardView = {
  render() {
    const email = store.state.currentUser;
    const userObj = store.state.users[email];
    
    // Get logs for today (local timezone date key YYYY-MM-DD)
    const todayStr = new Date().toISOString().split('T')[0];
    const log = store.getLogForDate(todayStr) || store.getEmptyLogTemplate();
    
    // Run AI analysis
    const analysis = AIEngine.generateInsights(log, userObj.details);
    const scores = analysis.scores;

    // SVG parameters for progress circle
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeOffset = circumference - (scores.lifestyle / 100) * circumference;

    // Water percentages
    const waterAmt = log.water ? log.water.amount : 0;
    const waterGoal = log.water ? log.water.goal : 8;
    const waterPct = Math.min(100, Math.round((waterAmt / waterGoal) * 100));

    // Exercise percentages
    const steps = log.exercise ? log.exercise.steps : 0;
    const stepsPct = Math.min(100, Math.round((steps / 10000) * 100));

    return `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Welcome Hero Banner -->
        <div class="glass-card glow-card-blue" style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%); border-left: 5px solid #3b82f6;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h1 style="font-size: 1.8rem; margin-bottom: 0.2rem; font-family: var(--font-heading);">
                Welcome Back, ${userObj.name}!
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem;">
                "${analysis.motivationalMessage}"
              </p>
            </div>
            <div style="text-align: right;" class="hide-mobile">
              <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">Today's Date</span>
              <h3 style="font-size: 1.1rem; font-family: var(--font-heading);">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
            </div>
          </div>
        </div>

        <!-- Upper Metric Row Grid -->
        <div class="grid-cols-4">
          <!-- 1. Lifestyle score circle -->
          <div class="glass-card" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <div class="card-title" style="margin-bottom: 1rem;">${i18n.t('lifestyleScore')}</div>
            <div class="score-circle-container">
              <svg class="score-svg">
                <circle class="score-circle-bg" cx="60" cy="60" r="50"></circle>
                <circle class="score-circle-val" cx="60" cy="60" r="50" 
                        stroke="url(#blue-grad)"
                        stroke-dasharray="${circumference}" 
                        stroke-dashoffset="${strokeOffset}">
                </circle>
                <!-- SVG Gradient Definition -->
                <defs>
                  <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#60a5fa" />
                    <stop offset="100%" stop-color="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div class="score-text">
                <div class="score-number">${scores.lifestyle}</div>
                <div class="score-label">Index</div>
              </div>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem; line-height: 1.4;">
              Composite rank of your tracked habits.
            </p>
          </div>

          <!-- 2. Sleep Hygiene Card -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">Sleep Quality</div>
              <div class="card-icon" style="color: #8b5cf6;"><i class="fa-solid fa-moon"></i></div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 700; font-family: var(--font-heading);">${scores.sleep}<span style="font-size: 0.95rem; color: var(--text-muted);"> / 100</span></div>
            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
              Slept: <strong>${AIEngine.calculateSleepDuration(log.sleep?.sleepTime, log.sleep?.wakeTime)} hrs</strong> (Quality: ${log.sleep?.quality || 0}/10)
            </div>
            <div class="progress-bar-container" style="margin-top: 1.2rem;">
              <div class="progress-bar purple" style="width: ${scores.sleep}%;"></div>
            </div>
          </div>

          <!-- 3. Wellness / Activity Card -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">${i18n.t('wellnessScore')}</div>
              <div class="card-icon" style="color: #10b981;"><i class="fa-solid fa-heart"></i></div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 700; font-family: var(--font-heading);">${scores.wellness}<span style="font-size: 0.95rem; color: var(--text-muted);"> / 100</span></div>
            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
              Water: <strong>${waterAmt}/${waterGoal} gls</strong> (${waterPct}%)<br>
              Steps: <strong>${steps.toLocaleString()} / 10,000</strong> (${stepsPct}%)
            </div>
            <div class="progress-bar-container" style="margin-top: 0.5rem;">
              <div class="progress-bar green" style="width: ${scores.wellness}%;"></div>
            </div>
          </div>

          <!-- 4. Productivity Index Card -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">Productivity</div>
              <div class="card-icon" style="color: #3b82f6;"><i class="fa-solid fa-briefcase"></i></div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 700; font-family: var(--font-heading);">${scores.productivity}<span style="font-size: 0.95rem; color: var(--text-muted);"> / 100</span></div>
            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
              Focus Rating: <strong>${log.productivity?.focus || 0}/10</strong><br>
              Tasks Completed: <strong>${log.productivity?.tasks || 0} tasks</strong>
            </div>
            <div class="progress-bar-container" style="margin-top: 1.2rem;">
              <div class="progress-bar" style="width: ${scores.productivity}%;"></div>
            </div>
          </div>
        </div>

        <!-- Alerts Block -->
        <div class="glass-card success-border" style="border-left: 4px solid ${analysis.alerts.length > 0 ? '#ef4444' : '#10b981'};">
          <h3 style="font-size: 1rem; display: flex; align-items: center; gap: 0.5rem; color: ${analysis.alerts.length > 0 ? '#ef4444' : '#10b981'}; margin-bottom: 0.5rem;">
            <i class="fa-solid ${analysis.alerts.length > 0 ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i>
            ${i18n.t('alertsTitle')}
          </h3>
          ${analysis.alerts.length === 0 ? `
            <p style="font-size: 0.85rem; color: var(--text-muted);">${i18n.t('noAlerts')}</p>
          ` : `
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; padding-left: 0.5rem;">
              ${analysis.alerts.map(al => `<li style="font-size: 0.85rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.3rem;"><i class="fa-solid fa-angle-right" style="color: #ef4444;"></i> ${al}</li>`).join('')}
            </ul>
          `}
        </div>

        <!-- Dashboard Columns -->
        <div class="grid-cols-3">
          
          <!-- Column 1: Today's Goals & Daily Actions (Spans 1 col) -->
          <div class="glass-card" style="display: flex; flex-direction: column; gap: 1.2rem;">
            <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
              <i class="fa-solid fa-circle-check" style="color: #3b82f6;"></i> Action Center
            </h3>

            <!-- Quick Water logger -->
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">Quick Hydration Log</label>
              <div style="display: flex; gap: 0.8rem; align-items: center; margin-top: 0.4rem;">
                <div style="font-size: 1.2rem; font-weight: 700; color: #3b82f6;"><span id="dash-water-display">${waterAmt}</span> / ${waterGoal} gls</div>
                <button class="btn btn-primary btn-sm" id="btn-quick-water" style="padding: 0.3rem 0.6rem;">
                  <i class="fa-solid fa-plus"></i> 1 Glass
                </button>
              </div>
            </div>

            <!-- Challenges Check List -->
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.5rem;">
                Today's Gamified Challenges
              </label>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem;">
                ${analysis.challenges.map(ch => `
                  <li style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; padding: 0.4rem; border-radius: var(--border-radius-sm); background: var(--border-color);">
                    <input type="checkbox" id="challenge-${ch.id}" ${ch.completed ? 'checked disabled' : ''} style="cursor: pointer; width: 16px; height: 16px;">
                    <span style="text-decoration: ${ch.completed ? 'line-through' : 'none'}; opacity: ${ch.completed ? 0.6 : 1};" id="label-challenge-${ch.id}">
                      ${ch.text}
                    </span>
                    ${ch.completed ? '<i class="fa-solid fa-check-double" style="color:#10b981; margin-left:auto;"></i>' : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- Column 2 & 3: AI Coach Insights (Spans 2 cols) -->
          <div class="glass-card" style="grid-column: span 2; display: flex; flex-direction: column; gap: 1rem;">
            <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
              <i class="fa-solid fa-wand-magic-sparkles" style="color: #10b981;"></i> ${i18n.t('aiCoachInsights')}
            </h3>

            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
              ${analysis.insights.length === 0 ? `
                <p style="font-size: 0.9rem; color: var(--text-muted); text-align: center; padding: 2rem 0;">
                  No specific habits logged for today yet. Use the <a href="#/logs">Log Habit Panel</a> to enter details and unlock personalized AI insights.
                </p>
              ` : analysis.insights.map(ins => `
                <div class="glass-card" style="padding: 1rem; border-left: 4px solid ${ins.color}; background: rgba(255,255,255,0.01);">
                  <div style="display: flex; gap: 0.8rem; align-items: flex-start;">
                    <i class="fa-solid ${ins.icon}" style="color: ${ins.color}; font-size: 1.2rem; margin-top: 0.2rem;"></i>
                    <div>
                      <strong style="font-size: 0.95rem; color: var(--text-main); display: block; margin-bottom: 0.15rem;">${ins.category}</strong>
                      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">${ins.text}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

      </div>
    `;
  },

  init() {
    const todayStr = new Date().toISOString().split('T')[0];
    const log = store.getLogForDate(todayStr) || store.getEmptyLogTemplate();

    // Bind Quick Water buttons
    const quickWaterBtn = document.getElementById('btn-quick-water');
    if (quickWaterBtn) {
      quickWaterBtn.addEventListener('click', () => {
        const curAmt = log.water ? log.water.amount : 0;
        const newAmt = curAmt + 1;
        
        // Save to store
        store.saveDailyLog(todayStr, {
          water: { amount: newAmt, goal: log.water ? log.water.goal : 8 }
        });

        // Update display text
        document.getElementById('dash-water-display').innerText = newAmt;
        Toast.success('+1 Glass logged! Hydration score synced.');

        // Reload page to reflect overall score circles and alerts updates
        setTimeout(() => window.router.handleRoute(), 400);
      });
    }

    // Bind checkbox clicks for manual challenge completion incentives
    const todayStrKey = new Date().toISOString().split('T')[0];
    const userEmail = store.state.currentUser;

    const list = [
      { id: 'chal_water', logField: 'water', data: { amount: 8, goal: 8 } },
      { id: 'chal_walk', logField: 'exercise', data: { steps: 10000, duration: 45, calories: 400, type: 'Running' } },
      { id: 'chal_meditate', logField: 'mental', data: { meditation: 15, mood: 'Good', stress: 4 } },
      { id: 'chal_diet', logField: 'diet', data: { junk: 0, vegetables: 3, fruits: 2, protein: 70, sugar: 15 } },
      { id: 'chal_reading', logField: 'habits', data: { reading: true, learning: true, caffeine: 1 } }
    ];

    list.forEach((item) => {
      const chbox = document.getElementById(`challenge-${item.id}`);
      if (chbox && !chbox.disabled) {
        chbox.addEventListener('change', (e) => {
          if (e.target.checked) {
            // Update log parameter
            store.saveDailyLog(todayStrKey, {
              [item.logField]: {
                ...log[item.logField],
                ...item.data
              }
            });

            // Grant bonus points directly
            const gamification = store.state.gamification[userEmail];
            gamification.points += 15; // 15 challenge completions points
            gamification.level = Math.floor(gamification.points / 100) + 1;
            store.saveState();

            Toast.success(`Challenge Completed! +15 bonus points awarded.`);
            setTimeout(() => window.router.handleRoute(), 500);
          }
        });
      }
    });
  }
};

export default DashboardView;
