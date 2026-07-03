// Gamification view: streaks, level meters, unlocked badges
import { store } from '../store.js';

export const GamificationView = {
  render() {
    const email = store.state.currentUser;
    const gam = store.state.gamification[email] || { points: 0, streak: 0, level: 1, badges: [] };
    
    // Level progress calculations
    const curLevel = gam.level || 1;
    const basePoints = (curLevel - 1) * 100;
    const levelPoints = gam.points || 0;
    const levelXp = levelPoints - basePoints;
    const levelXpPct = Math.min(100, Math.round((levelXp / 100) * 100));

    // Badges inventory structure
    const badgesInventory = [
      { id: 'hydro_king', name: 'Hydro King', icon: 'fa-droplet', desc: 'Drink at least 8 glasses of water in a single day.', color: 'blue' },
      { id: 'early_bird', name: 'Early Bird', icon: 'fa-sun', desc: 'Wake up before 7:00 AM to unlock early momentum.', color: 'gold' },
      { id: 'focus_master', name: 'Focus Master', icon: 'fa-crosshairs', desc: 'Record a focus rating of 9/10 or higher.', color: 'blue' },
      { id: 'mindful_monk', name: 'Mindful Monk', icon: 'fa-brain', desc: 'Complete 15 minutes or more of calm meditation.', color: 'gold' },
      { id: 'healthy_eater', name: 'Healthy Eater', icon: 'fa-apple-whole', desc: 'Avoid junk snacks and consume 3+ green servings.', color: 'gold' },
      { id: 'workout_warrior', name: 'Workout Warrior', icon: 'fa-dumbbell', desc: 'Burn 400+ active calories in daily workout logs.', color: 'blue' }
    ];

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div>
          <h1 style="font-size: 1.8rem; font-family: var(--font-heading);"><i class="fa-solid fa-trophy" style="color: #f59e0b;"></i> Achievements</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Unlock levels, earn XP points, and complete challenges to build positive habits.</p>
        </div>

        <!-- Levels and XP progress bar card -->
        <div class="glass-card glow-card-blue" style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">SYSTEM RANK LEVEL</span>
              <h2 style="font-size: 1.8rem; font-family: var(--font-heading);">Rank Level ${curLevel}</h2>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 1.1rem; font-weight: 700; color: #3b82f6;">${gam.points} Total XP</span>
              <p style="font-size: 0.8rem; color: var(--text-muted);">${100 - levelXp} XP to Level ${curLevel + 1}</p>
            </div>
          </div>
          
          <div class="progress-bar-container" style="height: 12px; border-radius: 6px;">
            <div class="progress-bar purple" style="width: ${levelXpPct}%;"></div>
          </div>
        </div>

        <div class="grid-cols-3">
          <!-- Weekly Group Challenges list (spans 3 columns) -->
          <div class="glass-card" style="grid-column: span 3; display: flex; flex-direction: column; gap: 1rem;">
            <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
              <i class="fa-solid fa-calendar-check" style="color: #10b981;"></i> Active Weekly Challenges
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; background: var(--border-color); padding: 0.8rem 1rem; border-radius: var(--border-radius-sm);">
                <div>
                  <strong style="font-size: 0.9rem; color: var(--text-main); display: block;">Perfect Sleep</strong>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">Achieve a sleep quality rating of 8 or above.</span>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: #f59e0b;">+50 XP</span>
                  <div style="font-size: 0.75rem; color: #10b981; font-weight: 600;">Active</div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; background: var(--border-color); padding: 0.8rem 1rem; border-radius: var(--border-radius-sm);">
                <div>
                  <strong style="font-size: 0.9rem; color: var(--text-main); display: block;">Hydration Marathon</strong>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">Drink 8+ water glasses in 5 different days.</span>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: #f59e0b;">+100 XP</span>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">2 / 5 Days</div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; background: var(--border-color); padding: 0.8rem 1rem; border-radius: var(--border-radius-sm);">
                <div>
                  <strong style="font-size: 0.9rem; color: var(--text-main); display: block;">Zen Master</strong>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">Accumulate 60 minutes of meditation log.</span>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: #f59e0b;">+80 XP</span>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">25 / 60 mins</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Badges Grid card -->
        <div class="glass-card">
          <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
            <i class="fa-solid fa-medal" style="color: #3b82f6;"></i> Unlocked Achievement Badges
          </h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 2rem;">
            ${badgesInventory.map((b) => {
              const isUnlocked = gam.badges && gam.badges.includes(b.id);
              return `
                <div class="badge-item ${isUnlocked ? 'unlocked ' + b.color : ''}" id="badge-item-${b.id}">
                  <div class="badge-icon">
                    <i class="fa-solid ${b.icon}"></i>
                  </div>
                  <span class="badge-name">${b.name}</span>
                  <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">
                    ${isUnlocked ? '✓ Unlocked' : 'Locked'}
                  </span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Description tooltip block -->
          <div id="badge-description-box" style="display: none; margin-top: 2rem; padding: 1rem; border-radius: var(--border-radius-sm); background: var(--border-color); font-size: 0.85rem; border-left: 3px solid #3b82f6;">
            Click a badge above to review its unlocking rules.
          </div>
        </div>

      </div>
    `;
  },

  init() {
    // Connect Badges grid click events to display badge description tooltips
    const email = store.state.currentUser;
    const gam = store.state.gamification[email] || { badges: [] };
    const userBadges = gam.badges || [];

    const badgeDescriptions = {
      hydro_king: '👑 HYDRO KING: Awarded when you log water intake greater than or equal to your daily glass goals. (+50 XP)',
      early_bird: '🌅 EARLY BIRD: Awarded when you rise before 7:00 AM to unlock daily morning activities. (+50 XP)',
      focus_master: '🎯 FOCUS MASTER: Awarded when you log a daily study or work focus rating of 9/10 or above. (+75 XP)',
      mindful_monk: '🧘 MINDFUL MONK: Awarded when you meditate for a calm 15 minutes or longer in a single session. (+50 XP)',
      healthy_eater: '🥗 HEALTHY EATER: Awarded when you log zero junk servings and eat healthy veggies or fruit. (+50 XP)',
      workout_warrior: '🏋️ WORKOUT WARRIOR: Awarded when your daily exercise calorie burn exceed 400 kcal. (+50 XP)'
    };

    const descBox = document.getElementById('badge-description-box');

    Object.keys(badgeDescriptions).forEach((badgeId) => {
      const bEl = document.getElementById(`badge-item-${badgeId}`);
      if (bEl) {
        bEl.addEventListener('click', () => {
          descBox.style.display = 'block';
          const isUnlocked = userBadges.includes(badgeId);
          descBox.style.borderLeftColor = isUnlocked ? '#10b981' : '#3b82f6';
          descBox.innerHTML = `
            <strong>${badgeDescriptions[badgeId].split(':')[0]}:</strong><br>
            ${badgeDescriptions[badgeId].split(':')[1]}<br>
            <span style="font-size: 0.75rem; font-weight: 700; color: ${isUnlocked ? '#10b981' : '#ef4444'};">
              Status: ${isUnlocked ? '✓ Active achievement badge (Unlocked)' : '✗ Locked - Keep logging parameters to unlock!'}
            </span>
          `;
        });
      }
    });
  }
};

export default GamificationView;
