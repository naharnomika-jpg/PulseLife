// PDF Reports View
import { store } from '../store.js';
import { AIEngine } from '../utils/ai.js';
import { PDFReporter } from '../utils/pdf.js';
import { Toast } from '../components/Toast.js';

export const ReportsView = {
  render() {
    const todayStr = new Date().toISOString().split('T')[0];
    const log = store.getLogForDate(todayStr) || store.getEmptyLogTemplate();
    const userObj = store.state.users[store.state.currentUser];
    const logs = store.getLogs();
    
    const analysis = AIEngine.generateInsights(log, userObj.details);
    const scores = analysis.scores;

    // Calculate simple historical averages for last 7 days to display in dashboard
    const dates = Object.keys(logs).slice(-7);
    let avgSleep = 7.5;
    let avgWater = 6;
    let totalWorkouts = 0;
    let avgFocus = 6;

    if (dates.length > 0) {
      let sumSleep = 0;
      let sumWater = 0;
      let sumFocus = 0;
      
      dates.forEach((d) => {
        const item = logs[d];
        sumSleep += AIEngine.calculateSleepDuration(item.sleep?.sleepTime, item.sleep?.wakeTime);
        sumWater += item.water?.amount || 0;
        sumFocus += item.productivity?.focus || 5;
        if (item.exercise && item.exercise.duration > 0) totalWorkouts++;
      });

      avgSleep = (sumSleep / dates.length).toFixed(1);
      avgWater = (sumWater / dates.length).toFixed(1);
      avgFocus = (sumFocus / dates.length).toFixed(1);
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 1.8rem; font-family: var(--font-heading);"><i class="fa-solid fa-file-export" style="color: #3b82f6;"></i> Lifestyle Reports</h1>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Export your habits logs history and AI coach tips as a professional PDF document.</p>
          </div>
          
          <button class="btn btn-primary" id="btn-download-pdf-report" style="box-shadow: var(--shadow-glow);">
            <i class="fa-solid fa-file-pdf"></i> Download PDF Report
          </button>
        </div>

        <!-- Metric summary grids -->
        <div class="grid-cols-4">
          <div class="glass-card" style="text-align: center;">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Avg Sleep Duration</span>
            <h3 style="font-size: 1.6rem; color: #8b5cf6; margin: 0.4rem 0; font-family: var(--font-heading);">${avgSleep} hours</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">7-day tracking average</span>
          </div>

          <div class="glass-card" style="text-align: center;">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Avg Hydration</span>
            <h3 style="font-size: 1.6rem; color: #3b82f6; margin: 0.4rem 0; font-family: var(--font-heading);">${avgWater} glasses</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Daily glasses average</span>
          </div>

          <div class="glass-card" style="text-align: center;">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Weekly Workouts</span>
            <h3 style="font-size: 1.6rem; color: #10b981; margin: 0.4rem 0; font-family: var(--font-heading);">${totalWorkouts} sessions</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Active training logs</span>
          </div>

          <div class="glass-card" style="text-align: center;">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Avg Focus Rating</span>
            <h3 style="font-size: 1.6rem; color: #60a5fa; margin: 0.4rem 0; font-family: var(--font-heading);">${avgFocus} / 10</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Productivity index</span>
          </div>
        </div>

        <!-- AI Coach recommendations summary -->
        <div class="glass-card">
          <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.2rem;">
            <i class="fa-solid fa-wand-magic-sparkles" style="color: #10b981;"></i> AI Executive Lifestyle Recommendations
          </h3>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="padding-bottom: 1rem; border-bottom: 1px dashed var(--border-color);">
              <strong style="color: #3b82f6; font-size: 0.95rem; display: block; margin-bottom: 0.2rem;">Dietary Routine</strong>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
                Incorporate nutrient-dense proteins (eggs, chicken breast, or organic tofu) to repair muscular tissues during recovery cycles. Replace processed trans-fats or junk sugars with low-glycemic complexes like oatmeal or quinoa.
              </p>
            </div>
            
            <div style="padding-bottom: 1rem; border-bottom: 1px dashed var(--border-color);">
              <strong style="color: #10b981; font-size: 0.95rem; display: block; margin-bottom: 0.2rem;">Exercise Program</strong>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
                Target at least 3 days of progressive cardio HIIT circuits mixed with 2 days of basic resistance squats, pushups, or barbell lifts. Complete 8,000 steps daily to promote metabolic cellular updates.
              </p>
            </div>

            <div>
              <strong style="color: #8b5cf6; font-size: 0.95rem; display: block; margin-bottom: 0.2rem;">Rest & Recovery</strong>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
                Wind down using blue-light blocks 45 minutes prior to bed. Maintain strict sleeping temperatures (18°C) and wake times to consolidate deep sleep waveforms and eliminate focus fatigue.
              </p>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  init() {
    const pdfBtn = document.getElementById('btn-download-pdf-report');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', () => {
        try {
          const userObj = store.state.users[store.state.currentUser];
          const todayStr = new Date().toISOString().split('T')[0];
          const logsList = store.getLogs();

          Toast.info('Rendering report cards to PDF format...');
          
          setTimeout(() => {
            PDFReporter.generate(userObj, todayStr, logsList);
            Toast.success('PDF report downloaded successfully!');
          }, 1000);

        } catch (e) {
          console.error(e);
          Toast.danger(`Failed to generate PDF: ${e.message}`);
        }
      });
    }
  }
};

export default ReportsView;
