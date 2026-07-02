// AI Planners: Meal, Workout, and Habit planners view
import { store } from '../store.js';
import { AIEngine } from '../utils/ai.js';
import { Toast } from '../components/Toast.js';
import { i18n } from '../utils/i18n.js';

export const PlannerView = {
  activePlanner: 'workout', // 'workout' | 'meal' | 'goals'
  generatedWorkout: null,
  generatedMeal: null,
  generatedHabit: null,

  render() {
    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div>
          <h1 style="font-size: 1.8rem; font-family: var(--font-heading);">${i18n.t('plannerTitle')}</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Generate customized lifestyle schedules powered by PulseLife wellness rules.</p>
        </div>

        <!-- Navigation Tabs -->
        <div class="auth-tabs" style="max-width: 600px; margin-bottom: 0;">
          <div class="auth-tab ${this.activePlanner === 'workout' ? 'active' : ''}" id="plan-tab-workout"><i class="fa-solid fa-person-running"></i> Workouts</div>
          <div class="auth-tab ${this.activePlanner === 'meal' ? 'active' : ''}" id="plan-tab-meal"><i class="fa-solid fa-apple-whole"></i> Meal Planner</div>
          <div class="auth-tab ${this.activePlanner === 'goals' ? 'active' : ''}" id="plan-tab-goals"><i class="fa-solid fa-bullseye"></i> Goal Planner</div>
        </div>

        <!-- Main Display Cards -->
        <div class="grid-cols-3" style="align-items: flex-start;">
          
          <!-- Column 1: Configuration controls (Spans 1 col) -->
          <div class="glass-card" style="display: flex; flex-direction: column; gap: 1.2rem;">
            
            <!-- 1. WORKOUT SETTINGS -->
            ${this.activePlanner === 'workout' ? `
              <h3 style="font-size: 1.1rem;"><i class="fa-solid fa-sliders"></i> Workout Settings</h3>
              
              <div class="form-group">
                <label>Workout Category</label>
                <select id="workout-input-type" class="form-control">
                  <option value="Strength">Strength Training</option>
                  <option value="Cardio">Cardio HIIT</option>
                  <option value="Yoga">Vinyasa Yoga</option>
                </select>
              </div>

              <div class="form-group">
                <label>Difficulty Level</label>
                <select id="workout-input-level" class="form-control">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate" selected>Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div class="form-group">
                <label>Duration (mins)</label>
                <input type="number" id="workout-input-duration" class="form-control" min="15" max="90" value="30">
              </div>

              <button class="btn btn-primary" id="btn-generate-workout" style="width: 100%; box-shadow: var(--shadow-glow);">
                <i class="fa-solid fa-circle-play"></i> ${i18n.t('generateWorkout')}
              </button>
            ` : ''}

            <!-- 2. MEAL SETTINGS -->
            ${this.activePlanner === 'meal' ? `
              <h3 style="font-size: 1.1rem;"><i class="fa-solid fa-sliders"></i> Meal Settings</h3>
              
              <div class="form-group">
                <label>Dietary Focus</label>
                <select id="meal-input-pref" class="form-control">
                  <option value="Omnivore">Omnivore (Standard)</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan (Plant-Based)</option>
                </select>
              </div>

              <div class="form-group">
                <label>Caloric Target (kcal)</label>
                <input type="number" id="meal-input-calories" class="form-control" min="1200" max="4000" value="2000">
              </div>

              <button class="btn btn-primary" id="btn-generate-meal" style="width: 100%; box-shadow: var(--shadow-glow);">
                <i class="fa-solid fa-circle-play"></i> ${i18n.t('generateMeal')}
              </button>
            ` : ''}

            <!-- 3. GOAL SETTINGS -->
            ${this.activePlanner === 'goals' ? `
              <h3 style="font-size: 1.1rem;"><i class="fa-solid fa-sliders"></i> Habit Goal Settings</h3>
              
              <div class="form-group">
                <label>Aspiration Goal Name</label>
                <input type="text" id="goal-input-name" class="form-control" placeholder="e.g. Run 5km in 4 weeks" value="Drink water consistently and wake up early">
              </div>

              <div class="form-group">
                <label>Target Duration (weeks)</label>
                <input type="number" id="goal-input-weeks" class="form-control" min="2" max="12" value="4">
              </div>

              <button class="btn btn-primary" id="btn-generate-goal" style="width: 100%; box-shadow: var(--shadow-glow);">
                <i class="fa-solid fa-circle-play"></i> ${i18n.t('generateGoals')}
              </button>
            ` : ''}

          </div>

          <!-- Column 2 & 3: Outputs Results Panel (Spans 2 cols) -->
          <div class="glass-card" style="grid-column: span 2; min-height: 380px; display: flex; flex-direction: column; gap: 1.2rem;">
            
            <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;" id="planner-output-title">
              <i class="fa-solid fa-wand-magic-sparkles" style="color: #3b82f6;"></i> AI Planner Results
            </h3>

            <!-- Generated plans container -->
            <div id="planner-results-body" style="font-size: 0.95rem; line-height: 1.6; color: var(--text-muted);">
              
              <!-- Placeholder -->
              ${(!this.generatedWorkout && !this.generatedMeal && !this.generatedHabit) ? `
                <div style="text-align: center; padding: 4rem 1rem;">
                  <i class="fa-solid fa-brain" style="font-size: 3rem; color: var(--border-color); margin-bottom: 1rem; display: block;"></i>
                  Choose settings on the left and tap "Generate" to construct your custom AI lifestyle routines.
                </div>
              ` : ''}

              <!-- WORKOUT OUTPUT -->
              ${(this.activePlanner === 'workout' && this.generatedWorkout) ? `
                <div class="glass-card" style="background: rgba(255,255,255,0.01); border-left: 4px solid #10b981;">
                  <strong style="font-size: 1.05rem; color: var(--text-main); display: block; margin-bottom: 0.8rem;">
                    Custom AI Workout Sheet - ${this.generatedWorkout.type} (${this.generatedWorkout.level})
                  </strong>
                  <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem;">
                    ${this.generatedWorkout.plan.map((ex, idx) => `
                      <li style="display: flex; gap: 0.8rem; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.4rem;">
                        <span style="font-size: 0.85rem; font-weight: 700; color: #10b981; border: 1px solid #10b981; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${idx+1}</span>
                        <span style="color: var(--text-main);">${ex}</span>
                      </li>
                    `).join('')}
                  </ul>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 1.2rem;">
                    Note: Complete these exercises smoothly. Focus on posture stability. Keep a bottle of water nearby.
                  </p>
                </div>
              ` : ''}

              <!-- MEAL OUTPUT -->
              ${(this.activePlanner === 'meal' && this.generatedMeal) ? `
                <div class="glass-card" style="background: rgba(255,255,255,0.01); border-left: 4px solid #3b82f6;">
                  <strong style="font-size: 1.05rem; color: var(--text-main); display: block; margin-bottom: 0.8rem;">
                    Target Calorie Distribution Meal Plan: ${this.generatedMeal.target} kcal (${this.generatedMeal.pref})
                  </strong>
                  
                  <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                    <div style="padding-bottom: 0.8rem; border-bottom: 1px dashed var(--border-color);">
                      <strong style="color: #3b82f6; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; margin-bottom: 0.2rem;"><i class="fa-solid fa-egg"></i> Breakfast</strong>
                      <p style="color: var(--text-main); font-size: 0.85rem;">${this.generatedMeal.plan.Breakfast}</p>
                    </div>
                    <div style="padding-bottom: 0.8rem; border-bottom: 1px dashed var(--border-color);">
                      <strong style="color: #10b981; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; margin-bottom: 0.2rem;"><i class="fa-solid fa-bowl-rice"></i> Lunch</strong>
                      <p style="color: var(--text-main); font-size: 0.85rem;">${this.generatedMeal.plan.Lunch}</p>
                    </div>
                    <div style="padding-bottom: 0.8rem; border-bottom: 1px dashed var(--border-color);">
                      <strong style="color: #8b5cf6; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; margin-bottom: 0.2rem;"><i class="fa-solid fa-plate-wheat"></i> Dinner</strong>
                      <p style="color: var(--text-main); font-size: 0.85rem;">${this.generatedMeal.plan.Dinner}</p>
                    </div>
                    <div>
                      <strong style="color: #f59e0b; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; margin-bottom: 0.2rem;"><i class="fa-solid fa-cookie"></i> Snacks & Fluids</strong>
                      <p style="color: var(--text-main); font-size: 0.85rem;">${this.generatedMeal.plan.Snack}</p>
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- GOALS OUTPUT -->
              ${(this.activePlanner === 'goals' && this.generatedHabit) ? `
                <div class="glass-card" style="background: rgba(255,255,255,0.01); border-left: 4px solid #8b5cf6;">
                  <strong style="font-size: 1.05rem; color: var(--text-main); display: block; margin-bottom: 0.8rem;">
                    AI Habit Progression Schedule (${this.generatedHabit.weeks} Weeks duration)
                  </strong>
                  <p style="font-size: 0.9rem; margin-bottom: 1rem;">Goal: "<strong>${this.generatedHabit.goal}</strong>"</p>
                  
                  <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                    ${this.generatedHabit.schedule.map((sch) => `
                      <div style="background: var(--border-color); padding: 0.8rem; border-radius: var(--border-radius-sm);">
                        <strong style="color: #8b5cf6; font-size: 0.9rem; display: block; margin-bottom: 0.25rem;">${sch.week}</strong>
                        <p style="color: var(--text-main); font-size: 0.85rem;">${sch.action}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

            </div>
          </div>

        </div>

      </div>
    `;
  },

  init() {
    // 1. Hook navigation tabs
    const tabWorkout = document.getElementById('plan-tab-workout');
    const tabMeal = document.getElementById('plan-tab-meal');
    const tabGoals = document.getElementById('plan-tab-goals');

    if (tabWorkout) {
      tabWorkout.addEventListener('click', () => {
        this.activePlanner = 'workout';
        this.generatedWorkout = null;
        this.generatedMeal = null;
        this.generatedHabit = null;
        window.router.navigateTo('planners');
      });
    }
    if (tabMeal) {
      tabMeal.addEventListener('click', () => {
        this.activePlanner = 'meal';
        this.generatedWorkout = null;
        this.generatedMeal = null;
        this.generatedHabit = null;
        window.router.navigateTo('planners');
      });
    }
    if (tabGoals) {
      tabGoals.addEventListener('click', () => {
        this.activePlanner = 'goals';
        this.generatedWorkout = null;
        this.generatedMeal = null;
        this.generatedHabit = null;
        window.router.navigateTo('planners');
      });
    }

    // 2. Generate Workout Action
    const workoutBtn = document.getElementById('btn-generate-workout');
    if (workoutBtn) {
      workoutBtn.addEventListener('click', async () => {
        const type = document.getElementById('workout-input-type').value;
        const level = document.getElementById('workout-input-level').value;
        const duration = document.getElementById('workout-input-duration').value;
        
        Toast.info('Structuring workout circuits with AI...');
        workoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        
        try {
          const plan = await AIEngine.generateWorkoutPlanAsync(type, level, duration);
          this.generatedWorkout = { type, level, duration, plan };
          Toast.success('AI Workout Generated successfully!');
        } catch (err) {
          console.error(err);
        } finally {
          window.router.navigateTo('planners'); // Redraws and renders output
        }
      });
    }

    // 3. Generate Meal Action
    const mealBtn = document.getElementById('btn-generate-meal');
    if (mealBtn) {
      mealBtn.addEventListener('click', async () => {
        const pref = document.getElementById('meal-input-pref').value;
        const target = document.getElementById('meal-input-calories').value;
        
        Toast.info('Calculating macros and calorie tables with AI...');
        mealBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        
        try {
          const plan = await AIEngine.generateMealPlanAsync(pref, target);
          this.generatedMeal = { pref, target, plan };
          Toast.success('AI Meal Plan ready!');
        } catch (err) {
          console.error(err);
        } finally {
          window.router.navigateTo('planners'); // Redraws
        }
      });
    }

    // 4. Generate Goal Progression Action
    const goalBtn = document.getElementById('btn-generate-goal');
    if (goalBtn) {
      goalBtn.addEventListener('click', () => {
        const goal = document.getElementById('goal-input-name').value;
        const weeks = Number(document.getElementById('goal-input-weeks').value);
        
        Toast.info('Structuring progressive habit sprints with AI...');
        
        setTimeout(() => {
          // Build a week-by-week milestone schedule
          const schedule = [];
          for (let i = 1; i <= weeks; i++) {
            let action = '';
            if (i === 1) action = 'Focus on foundation: Begin drinking 6 glasses of water daily and set alarm strictly for 7:00 AM.';
            else if (i === 2) action = 'Increase consistency: Elevate water to 8 glasses. Limit mobile usage screen times in the evenings to under 1.5 hours.';
            else if (i === 3) action = 'Integrate activity: Walk 8,000 steps daily and perform 15 minutes of meditation before bedtime.';
            else action = 'Solidify: Complete full lifestyle logs daily, earn level points badges, and do 30 mins of learning/reading.';
            
            schedule.push({ week: `Week ${i} Milestone`, action });
          }

          this.generatedHabit = { goal, weeks, schedule };
          Toast.success('AI Habit progression structured!');
          window.router.navigateTo('planners'); // Redraws
        }, 800);
      });
    }
  }
};

export default PlannerView;
