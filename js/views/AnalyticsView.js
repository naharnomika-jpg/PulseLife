// Analytics & Trend Charts view
import { store } from '../store.js';
import { AIEngine } from '../utils/ai.js';
import { i18n } from '../utils/i18n.js';

export const AnalyticsView = {
  render() {
    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div>
          <h1 style="font-size: 1.8rem; font-family: var(--font-heading);">${i18n.t('analyticsTitle')}</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Track sleep, calories, mood stability, and habit consistency over time.</p>
        </div>

        <!-- 30-Day Habit Grid Calendar -->
        <div class="glass-card glow-card-green">
          <div class="card-header">
            <div class="card-title"><i class="fa-solid fa-calendar-days" style="color: #10b981;"></i> ${i18n.t('habitConsistencyCalendar')}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; gap: 1rem;">
              <span><i class="fa-solid fa-square" style="color: rgba(16, 185, 129, 0.25); border: 1px solid #10b981;"></i> Completed</span>
              <span><i class="fa-solid fa-square" style="color: rgba(59, 130, 246, 0.25); border: 1px solid #3b82f6;"></i> Partial</span>
              <span><i class="fa-solid fa-square" style="color: var(--border-color);"></i> Unlogged</span>
            </div>
          </div>

          <div class="calendar-grid" id="analytics-calendar-grid">
            <!-- Headers -->
            <div class="calendar-day-header">SUN</div>
            <div class="calendar-day-header">MON</div>
            <div class="calendar-day-header">TUE</div>
            <div class="calendar-day-header">WED</div>
            <div class="calendar-day-header">THU</div>
            <div class="calendar-day-header">FRI</div>
            <div class="calendar-day-header">SAT</div>
            
            <!-- Days injected by JS -->
          </div>
          
          <div id="calendar-tooltip" style="display: none; margin-top: 1rem; padding: 0.8rem; border-radius: var(--border-radius-sm); background: var(--border-color); font-size: 0.85rem; border-left: 3px solid #10b981;">
            Select a square above to review that day's logs.
          </div>
        </div>

        <!-- Chart JS Canvas Grid -->
        <div class="grid-cols-2">
          
          <!-- Sleep Quality & Hours Chart -->
          <div class="glass-card">
            <h3 style="font-size: 1rem; margin-bottom: 1rem; font-family: var(--font-heading); color: var(--text-main);">
              <i class="fa-solid fa-bed" style="color: #8b5cf6;"></i> ${i18n.t('chartSleep')}
            </h3>
            <div style="position: relative; height: 260px; width: 100%;">
              <canvas id="chart-sleep"></canvas>
            </div>
          </div>

          <!-- Hydration Tracker -->
          <div class="glass-card">
            <h3 style="font-size: 1rem; margin-bottom: 1rem; font-family: var(--font-heading); color: var(--text-main);">
              <i class="fa-solid fa-droplet" style="color: #3b82f6;"></i> ${i18n.t('chartWater')}
            </h3>
            <div style="position: relative; height: 260px; width: 100%;">
              <canvas id="chart-water"></canvas>
            </div>
          </div>

          <!-- Calories & Steps -->
          <div class="glass-card">
            <h3 style="font-size: 1rem; margin-bottom: 1rem; font-family: var(--font-heading); color: var(--text-main);">
              <i class="fa-solid fa-person-running" style="color: #10b981;"></i> ${i18n.t('chartCalories')}
            </h3>
            <div style="position: relative; height: 260px; width: 100%;">
              <canvas id="chart-calories"></canvas>
            </div>
          </div>

          <!-- Mood & Stress Levels -->
          <div class="glass-card">
            <h3 style="font-size: 1rem; margin-bottom: 1rem; font-family: var(--font-heading); color: var(--text-main);">
              <i class="fa-solid fa-brain" style="color: #ef4444;"></i> ${i18n.t('chartMood')}
            </h3>
            <div style="position: relative; height: 260px; width: 100%;">
              <canvas id="chart-mental"></canvas>
            </div>
          </div>

          <!-- Productivity & Screen Time -->
          <div class="glass-card" style="grid-column: span 2;">
            <h3 style="font-size: 1rem; margin-bottom: 1rem; font-family: var(--font-heading); color: var(--text-main);">
              <i class="fa-solid fa-display" style="color: #60a5fa;"></i> ${i18n.t('chartProductivity')}
            </h3>
            <div style="position: relative; height: 280px; width: 100%;">
              <canvas id="chart-productivity"></canvas>
            </div>
          </div>

        </div>

      </div>
    `;
  },

  init() {
    const logs = store.getLogs();
    
    // Generate dates: last 7 days including today
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    // Prepare arrays. Fill with simulated defaults if database is short (to look elegant and professional!)
    const chartLabels = dates.map(d => {
      const parts = d.split('-');
      return `${parts[1]}/${parts[2]}`; // MM/DD
    });

    const mockData = {
      'sleepHrs': [0, 0, 0, 0, 0, 0, 0],
      'sleepQual': [0, 0, 0, 0, 0, 0, 0],
      'waterAmt': [0, 0, 0, 0, 0, 0, 0],
      'steps': [0, 0, 0, 0, 0, 0, 0],
      'calories': [0, 0, 0, 0, 0, 0, 0],
      'mood': [0, 0, 0, 0, 0, 0, 0], // 1-10 mapping
      'stress': [0, 0, 0, 0, 0, 0, 0],
      'prodHours': [0, 0, 0, 0, 0, 0, 0],
      'workScreen': [0, 0, 0, 0, 0, 0, 0]
    };

    // Replace mock items with actual logged values where available
    dates.forEach((d, idx) => {
      const log = logs[d];
      if (log) {
        if (log.sleep) {
          mockData.sleepHrs[idx] = AIEngine.calculateSleepDuration(log.sleep.sleepTime, log.sleep.wakeTime);
          mockData.sleepQual[idx] = Number(log.sleep.quality) || 7;
        }
        if (log.water) {
          mockData.waterAmt[idx] = log.water.amount;
        }
        if (log.exercise) {
          mockData.steps[idx] = log.exercise.steps;
          mockData.calories[idx] = log.exercise.calories;
        }
        if (log.mental) {
          const moodMap = { 'Excellent': 9, 'Good': 7, 'Neutral': 5, 'Tired': 4, 'Anxious': 3, 'Stressed': 2 };
          mockData.mood[idx] = moodMap[log.mental.mood] || 5;
          mockData.stress[idx] = log.mental.stress;
        }
        if (log.productivity) {
          mockData.prodHours[idx] = log.productivity.hours;
        }
        if (log.screen) {
          mockData.workScreen[idx] = log.screen.work;
        }
      }
    });

    // Color definitions
    const isDark = document.body.classList.contains('dark-mode');
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const ticksColor = isDark ? '#94a3b8' : '#64748b';

    // 1. SLEEP CHART
    new Chart(document.getElementById('chart-sleep'), {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          { label: 'Hours Rested', data: mockData.sleepHrs, backgroundColor: '#8b5cf6', yAxisID: 'y' },
          { label: 'Quality Score', data: mockData.sleepQual, type: 'line', borderColor: '#10b981', tension: 0.3, yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: ticksColor } } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: ticksColor } },
          y: { type: 'linear', position: 'left', grid: { color: gridColor }, ticks: { color: ticksColor } },
          y1: { type: 'linear', position: 'right', min: 0, max: 10, grid: { drawOnChartArea: false }, ticks: { color: ticksColor } }
        }
      }
    });

    // 2. WATER CHART
    new Chart(document.getElementById('chart-water'), {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{ label: 'Glasses Drunk', data: mockData.waterAmt, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.3 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: ticksColor } } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: ticksColor } },
          y: { grid: { color: gridColor }, ticks: { color: ticksColor } }
        }
      }
    });

    // 3. CALORIES & STEPS
    new Chart(document.getElementById('chart-calories'), {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          { label: 'Calories Burned (kcal)', data: mockData.calories, backgroundColor: '#10b981', yAxisID: 'y' },
          { label: 'Steps Walked', data: mockData.steps, type: 'line', borderColor: '#3b82f6', tension: 0.3, yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: ticksColor } } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: ticksColor } },
          y: { type: 'linear', position: 'left', grid: { color: gridColor }, ticks: { color: ticksColor } },
          y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, ticks: { color: ticksColor } }
        }
      }
    });

    // 4. MOOD & STRESS
    new Chart(document.getElementById('chart-mental'), {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          { label: 'Mood Rating', data: mockData.mood, borderColor: '#10b981', tension: 0.3 },
          { label: 'Stress Level', data: mockData.stress, borderColor: '#ef4444', tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: ticksColor } } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: ticksColor } },
          y: { grid: { color: gridColor }, ticks: { color: ticksColor }, min: 0, max: 10 }
        }
      }
    });

    // 5. PRODUCTIVITY VS SCREEN TIME
    new Chart(document.getElementById('chart-productivity'), {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          { label: 'Work Hours', data: mockData.prodHours, backgroundColor: '#3b82f6' },
          { label: 'Work Screen Time', data: mockData.workScreen, backgroundColor: 'rgba(59, 130, 246, 0.3)' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: ticksColor } } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: ticksColor } },
          y: { grid: { color: gridColor }, ticks: { color: ticksColor } }
        }
      }
    });

    // Build the 30-Day Habit Grid Calendar
    this.buildHabitCalendar(logs);
  },

  buildHabitCalendar(logs) {
    const calendarGrid = document.getElementById('analytics-calendar-grid');
    const tooltip = document.getElementById('calendar-tooltip');
    
    // We want to generate the last 28 days of grid squares (4 weeks) plus headers
    const calendarDays = [];
    const dateToday = new Date();
    
    // Generate dates: last 28 days
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(dateToday.getDate() - i);
      calendarDays.push(d);
    }

    // Determine starting spacer matching week day of first item (to align columns)
    const firstDayOfWeek = calendarDays[0].getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const spacer = document.createElement('div');
      spacer.style.visibility = 'hidden';
      calendarGrid.appendChild(spacer);
    }

    calendarDays.forEach((dayDate) => {
      const dStr = dayDate.toISOString().split('T')[0];
      const log = logs[dStr];
      
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.innerText = dayDate.getDate();
      dayEl.style.cursor = 'pointer';

      // Evaluate habit completion color
      if (log) {
        const scores = AIEngine.calculateScores(log);
        if (scores.lifestyle >= 75) {
          dayEl.classList.add('completed');
        } else {
          dayEl.classList.add('partial');
        }
      }

      // Hover/Click to view details inside the tooltip element
      dayEl.addEventListener('click', () => {
        tooltip.style.display = 'block';
        if (log) {
          const scores = AIEngine.calculateScores(log);
          tooltip.style.borderLeftColor = scores.lifestyle >= 75 ? '#10b981' : '#3b82f6';
          tooltip.innerHTML = `
            <strong>Habit Record for ${dStr}:</strong><br>
            - Overall Lifestyle Score: <strong>${scores.lifestyle}/100</strong><br>
            - Sleep: <strong>${AIEngine.calculateSleepDuration(log.sleep?.sleepTime, log.sleep?.wakeTime)} hrs</strong> (Quality: ${log.sleep?.quality}/10)<br>
            - Water: <strong>${log.water?.amount || 0}/${log.water?.goal || 8} glasses</strong><br>
            - Steps Walked: <strong>${(log.exercise?.steps || 0).toLocaleString()} steps</strong> (Burned: ${log.exercise?.calories || 0} kcal)<br>
            - Focus Index: <strong>${log.productivity?.focus || 0}/10</strong> | Study/Work: <strong>${log.productivity?.hours || 0} hrs</strong>
          `;
        } else {
          tooltip.style.borderLeftColor = 'var(--border-color)';
          tooltip.innerHTML = `<strong>Unlogged day (${dStr}):</strong> No metrics were registered on this date. Click <a href="#/logs">here</a> to log details.`;
        }
      });

      calendarGrid.appendChild(dayEl);
    });
  }
};

export default AnalyticsView;
