// Habit tracking log view
import { store } from '../store.js';
import { Toast } from '../components/Toast.js';
import { VoiceLogger } from '../utils/voice.js';
import { i18n } from '../utils/i18n.js';

export const LogsView = {
  render() {
    const todayStr = new Date().toISOString().split('T')[0];
    const log = store.getLogForDate(todayStr) || store.getEmptyLogTemplate();
    const userObj = store.state.users[store.state.currentUser];

    return `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- View Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 1.8rem; font-family: var(--font-heading);">${i18n.t('logDailyHabits')}</h1>
            <p style="color: var(--text-muted); font-size: 0.9rem;">${i18n.t('logSubtitle')}</p>
          </div>
          <div style="display: flex; gap: 0.8rem;">
            <button class="btn btn-secondary btn-sm" id="btn-sync-wearable">
              <i class="fa-solid fa-clock-rotate-left"></i> ${i18n.t('fitbitSync')}
            </button>
          </div>
        </div>

        <!-- Voice Logging Banner -->
        <div class="glass-card glow-card-green" style="background: rgba(16, 185, 129, 0.05); border-left: 4px solid #10b981; padding: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <button class="voice-record-btn" id="btn-voice-mic" title="Record Voice Log">
              <i class="fa-solid fa-microphone"></i>
            </button>
            <div style="flex: 1; min-width: 250px;">
              <strong style="font-size: 0.95rem; display: block; margin-bottom: 0.15rem;">${i18n.t('voiceLogging')}</strong>
              <p style="font-size: 0.85rem; color: var(--text-muted);" id="voice-transcript-status">
                ${i18n.t('speechPlaceholder')}
              </p>
            </div>
          </div>
        </div>

        <!-- Log Forms Grid Panel Layout -->
        <div class="logs-layout">
          
          <!-- Sticky Form Section Navigation Links -->
          <div class="glass-card logs-nav-card" style="padding: 1rem;">
            <ul class="logs-section-links">
              <li><a href="#logs-personal" class="active"><i class="fa-solid fa-user"></i> Personal Details</a></li>
              <li><a href="#logs-sleep"><i class="fa-solid fa-bed"></i> Sleep Parameters</a></li>
              <li><a href="#logs-hydration"><i class="fa-solid fa-droplet"></i> Water & Drinks</a></li>
              <li><a href="#logs-diet"><i class="fa-solid fa-apple-whole"></i> Diet & Intake</a></li>
              <li><a href="#logs-exercise"><i class="fa-solid fa-person-running"></i> Exercise Logs</a></li>
              <li><a href="#logs-mental"><i class="fa-solid fa-brain"></i> Mental Wellness</a></li>
              <li><a href="#logs-screen"><i class="fa-solid fa-display"></i> Screen Times</a></li>
              <li><a href="#logs-productivity"><i class="fa-solid fa-laptop-code"></i> Productivity</a></li>
              <li><a href="#logs-habits"><i class="fa-solid fa-circle-check"></i> Daily Habits</a></li>
            </ul>
          </div>

          <!-- Main Input Scroll Area -->
          <form id="logs-form" class="logs-form-scroll">
            
            <!-- SECTION 1: PERSONAL DETAILS -->
            <div class="glass-card" id="logs-personal">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <i class="fa-solid fa-user" style="color: #3b82f6;"></i> Personal Details (Static Profile)
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" id="log-profile-name" class="form-control" value="${userObj.name}">
                </div>
                <div class="form-group">
                  <label>Age</label>
                  <input type="number" id="log-profile-age" class="form-control" value="${userObj.details.age}">
                </div>
                <div class="form-group">
                  <label>Gender</label>
                  <input type="text" id="log-profile-gender" class="form-control" value="${userObj.details.gender}">
                </div>
                <div class="form-group">
                  <label>Occupation</label>
                  <input type="text" id="log-profile-occupation" class="form-control" value="${userObj.details.occupation}">
                </div>
                <div class="form-group">
                  <label>Height (cm)</label>
                  <input type="number" id="log-profile-height" class="form-control" value="${userObj.details.height}">
                </div>
                <div class="form-group">
                  <label>Weight (kg)</label>
                  <input type="number" id="log-profile-weight" class="form-control" value="${userObj.details.weight}">
                </div>
              </div>
            </div>

            <!-- SECTION 2: SLEEP -->
            <div class="glass-card" id="logs-sleep">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <i class="fa-solid fa-bed" style="color: #8b5cf6;"></i> Sleep Tracker
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label>Bed Time</label>
                  <input type="time" id="log-sleep-bed" class="form-control" value="${log.sleep?.sleepTime || '22:30'}">
                </div>
                <div class="form-group">
                  <label>Wake Time</label>
                  <input type="time" id="log-sleep-wake" class="form-control" value="${log.sleep?.wakeTime || '07:00'}">
                </div>
                <div class="form-group">
                  <label>Quality (1-10)</label>
                  <input type="range" id="log-sleep-quality" class="form-control" min="1" max="10" value="${log.sleep?.quality || 7}" style="padding:0;">
                </div>
              </div>
            </div>

            <!-- SECTION 3: WATER -->
            <div class="glass-card" id="logs-hydration">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <i class="fa-solid fa-droplet" style="color: #3b82f6;"></i> Water Intake
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label>Glasses Drunk</label>
                  <input type="number" id="log-water-amt" class="form-control" min="0" value="${log.water?.amount || 0}">
                </div>
                <div class="form-group">
                  <label>Daily Goal (Glasses)</label>
                  <input type="number" id="log-water-goal" class="form-control" min="1" value="${log.water?.goal || 8}">
                </div>
              </div>
            </div>

            <!-- SECTION 4: DIET -->
            <div class="glass-card" id="logs-diet">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <i class="fa-solid fa-apple-whole" style="color: #ef4444;"></i> Diet & Nutrition
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div class="form-group">
                  <label>Breakfast Description</label>
                  <input type="text" id="log-diet-breakfast" class="form-control" placeholder="Oatmeal / Scrambled Eggs" value="${log.diet?.breakfast || ''}">
                </div>
                <div class="form-group">
                  <label>Lunch Description</label>
                  <input type="text" id="log-diet-lunch" class="form-control" placeholder="Quinoa Bowl / Chicken Salad" value="${log.diet?.lunch || ''}">
                </div>
                <div class="form-group">
                  <label>Dinner Description</label>
                  <input type="text" id="log-diet-dinner" class="form-control" placeholder="Salmon Asparagus" value="${log.diet?.dinner || ''}">
                </div>
                <div class="form-group">
                  <label>Snack / Others</label>
                  <input type="text" id="log-diet-snacks" class="form-control" placeholder="Nuts / Fruits" value="${log.diet?.snacks || ''}">
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem;">
                <div class="form-group">
                  <label>Junk Food Servings</label>
                  <input type="number" id="log-diet-junk" class="form-control" min="0" value="${log.diet?.junk || 0}">
                </div>
                <div class="form-group">
                  <label>Protein (grams)</label>
                  <input type="number" id="log-diet-protein" class="form-control" min="0" value="${log.diet?.protein || 0}">
                </div>
                <div class="form-group">
                  <label>Sugar (grams)</label>
                  <input type="number" id="log-diet-sugar" class="form-control" min="0" value="${log.diet?.sugar || 0}">
                </div>
                <div class="form-group">
                  <label>Veggies Servings</label>
                  <input type="number" id="log-diet-veg" class="form-control" min="0" value="${log.diet?.vegetables || 0}">
                </div>
                <div class="form-group">
                  <label>Fruit Servings</label>
                  <input type="number" id="log-diet-fruit" class="form-control" min="0" value="${log.diet?.fruits || 0}">
                </div>
              </div>
            </div>

            <!-- SECTION 5: EXERCISE -->
            <div class="glass-card" id="logs-exercise">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <i class="fa-solid fa-person-running" style="color: #10b981;"></i> Workout & Exercise
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
                <div class="form-group">
                  <label>Workout Duration (mins)</label>
                  <input type="number" id="log-workout-duration" class="form-control" min="0" value="${log.exercise?.duration || 0}">
                </div>
                <div class="form-group">
                  <label>Workout Type</label>
                  <input type="text" id="log-workout-type" class="form-control" placeholder="Cardio / Strength / Yoga" value="${log.exercise?.type || ''}">
                </div>
                <div class="form-group">
                  <label>Steps Walked</label>
                  <input type="number" id="log-workout-steps" class="form-control" min="0" value="${log.exercise?.steps || 0}">
                </div>
                <div class="form-group">
                  <label>Calories Burned</label>
                  <input type="number" id="log-workout-calories" class="form-control" min="0" value="${log.exercise?.calories || 0}">
                </div>
              </div>
            </div>

            <!-- SECTION 6: MENTAL HEALTH -->
            <div class="glass-card" id="logs-mental">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <i class="fa-solid fa-brain" style="color: #8b5cf6;"></i> Mental Health & Stress
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;" class="hide-mobile">
                <div class="form-group">
                  <label>Mood</label>
                  <select id="log-mental-mood" class="form-control">
                    <option value="Excellent" ${log.mental?.mood === 'Excellent' ? 'selected' : ''}>Excellent</option>
                    <option value="Good" ${log.mental?.mood === 'Good' ? 'selected' : ''}>Good</option>
                    <option value="Neutral" ${log.mental?.mood === 'Neutral' || !log.mental?.mood ? 'selected' : ''}>Neutral</option>
                    <option value="Tired" ${log.mental?.mood === 'Tired' ? 'selected' : ''}>Tired</option>
                    <option value="Anxious" ${log.mental?.mood === 'Anxious' ? 'selected' : ''}>Anxious</option>
                    <option value="Stressed" ${log.mental?.mood === 'Stressed' ? 'selected' : ''}>Stressed</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Stress (1-10)</label>
                  <input type="number" id="log-mental-stress" class="form-control" min="1" max="10" value="${log.mental?.stress || 5}">
                </div>
                <div class="form-group">
                  <label>Anxiety (1-10)</label>
                  <input type="number" id="log-mental-anxiety" class="form-control" min="1" max="10" value="${log.mental?.anxiety || 4}">
                </div>
                <div class="form-group">
                  <label>Meditation (mins)</label>
                  <input type="number" id="log-mental-meditation" class="form-control" min="0" value="${log.mental?.meditation || 0}">
                </div>
              </div>
              <!-- Mobile sliders fallbacks -->
              <div class="form-group">
                <label>Gratitude Journal Entry</label>
                <textarea id="log-mental-gratitude" class="form-control" rows="2" placeholder="What are you grateful for today?">${log.mental?.gratitude || ''}</textarea>
              </div>
            </div>

            <!-- SECTION 7: SCREEN TIME -->
            <div class="glass-card" id="logs-screen">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <i class="fa-solid fa-display" style="color: #60a5fa;"></i> Screen Time (hours)
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem;">
                <div class="form-group">
                  <label>Mobile Screen</label>
                  <input type="number" step="0.5" id="log-screen-mobile" class="form-control" min="0" value="${log.screen?.mobile || 0}">
                </div>
                <div class="form-group">
                  <label>Social Media</label>
                  <input type="number" step="0.5" id="log-screen-social" class="form-control" min="0" value="${log.screen?.social || 0}">
                </div>
                <div class="form-group">
                  <label>Gaming Screen</label>
                  <input type="number" step="0.5" id="log-screen-gaming" class="form-control" min="0" value="${log.screen?.gaming || 0}">
                </div>
                <div class="form-group">
                  <label>Work Screen</label>
                  <input type="number" step="0.5" id="log-screen-work" class="form-control" min="0" value="${log.screen?.work || 0}">
                </div>
              </div>
            </div>

            <!-- SECTION 8: PRODUCTIVITY -->
            <div class="glass-card" id="logs-productivity">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <i class="fa-solid fa-laptop-code" style="color: #3b82f6;"></i> Work & Productivity
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
                <div class="form-group">
                  <label>Work/Study Hours</label>
                  <input type="number" step="0.5" id="log-prod-hours" class="form-control" min="0" value="${log.productivity?.hours || 0}">
                </div>
                <div class="form-group">
                  <label>Tasks Completed</label>
                  <input type="number" id="log-prod-tasks" class="form-control" min="0" value="${log.productivity?.tasks || 0}">
                </div>
                <div class="form-group">
                  <label>Focus Score (1-10)</label>
                  <input type="number" id="log-prod-focus" class="form-control" min="1" max="10" value="${log.productivity?.focus || 5}">
                </div>
                <div class="form-group">
                  <label>Break Time (mins)</label>
                  <input type="number" id="log-prod-breaks" class="form-control" min="0" value="${log.productivity?.breaks || 0}">
                </div>
              </div>
            </div>

            <!-- SECTION 9: HABITS -->
            <div class="glass-card" id="logs-habits">
              <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Lifestyle Habits
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <input type="checkbox" id="log-habits-smoking" style="width: 18px; height: 18px;" ${log.habits?.smoking ? 'checked' : ''}>
                  <label for="log-habits-smoking" style="font-size: 0.9rem; font-weight: 500;">Smoking Active</label>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <input type="checkbox" id="log-habits-alcohol" style="width: 18px; height: 18px;" ${log.habits?.alcohol ? 'checked' : ''}>
                  <label for="log-habits-alcohol" style="font-size: 0.9rem; font-weight: 500;">Alcohol Today</label>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <input type="checkbox" id="log-habits-reading" style="width: 18px; height: 18px;" ${log.habits?.reading ? 'checked' : ''}>
                  <label for="log-habits-reading" style="font-size: 0.9rem; font-weight: 500;">Reading Books</label>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <input type="checkbox" id="log-habits-learning" style="width: 18px; height: 18px;" ${log.habits?.learning ? 'checked' : ''}>
                  <label for="log-habits-learning" style="font-size: 0.9rem; font-weight: 500;">Learning Skills</label>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <input type="checkbox" id="log-habits-outdoor" style="width: 18px; height: 18px;" ${log.habits?.outdoor ? 'checked' : ''}>
                  <label for="log-habits-outdoor" style="font-size: 0.9rem; font-weight: 500;">Outdoor Action</label>
                </div>
              </div>
              <div class="form-group" style="max-width: 250px;">
                <label>Caffeine Cups (Coffee/Tea)</label>
                <input type="number" id="log-habits-caffeine" class="form-control" min="0" value="${log.habits?.caffeine || 0}">
              </div>
            </div>

            <!-- Submit Logs button -->
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; box-shadow: var(--shadow-glow);">
              <i class="fa-solid fa-floppy-disk"></i> ${i18n.t('submitLogs')}
            </button>
            
          </form>
        </div>

      </div>
    `;
  },

  init() {
    const form = document.getElementById('logs-form');
    const todayStr = new Date().toISOString().split('T')[0];

    // Scroll Spy highlight logic for logs sidebar section links
    const sectionLinks = document.querySelectorAll('.logs-section-links a');
    sectionLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        
        sectionLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Fitbit sync simulation
    const syncBtn = document.getElementById('btn-sync-wearable');
    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        Toast.info('Connecting with Fitbit Health Cloud (Simulated)...');
        syncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Syncing...';
        
        setTimeout(() => {
          // Sync data
          document.getElementById('log-sleep-bed').value = '23:15';
          document.getElementById('log-sleep-wake').value = '06:45';
          document.getElementById('log-sleep-quality').value = '8';
          document.getElementById('log-workout-steps').value = '9500';
          document.getElementById('log-workout-calories').value = '480';
          document.getElementById('log-workout-duration').value = '40';
          document.getElementById('log-workout-type').value = 'Cycling';

          syncBtn.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> ' + i18n.t('fitbitSync');
          Toast.success(i18n.t('fitbitSuccess'));
        }, 1500);
      });
    }

    // Voice Logging speech command recognition triggering
    const micBtn = document.getElementById('btn-voice-mic');
    const statusText = document.getElementById('voice-transcript-status');

    if (micBtn) {
      micBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (VoiceLogger.isRecording) {
          VoiceLogger.stop();
          micBtn.classList.remove('recording');
          statusText.innerText = i18n.t('speechPlaceholder');
        } else {
          micBtn.classList.add('recording');
          statusText.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Listening... Speak now.';
          
          VoiceLogger.start(
            (result) => {
              micBtn.classList.remove('recording');
              statusText.innerHTML = `<strong>Transcribed:</strong> "${result.transcript}"`;
              
              // Automatically apply parsed inputs
              const data = result.parsedData;
              let toastMsg = [];
              
              if (data.water !== undefined) {
                document.getElementById('log-water-amt').value = data.water;
                toastMsg.push(`Water: ${data.water} glasses`);
              }
              if (data.sleepDuration !== undefined) {
                // Approximate bed/wake to match sleep hours
                document.getElementById('log-sleep-bed').value = '23:00';
                document.getElementById('log-sleep-wake').value = `0${7 + Math.floor(data.sleepDuration - 8)}:00`.slice(-5);
                document.getElementById('log-sleep-quality').value = '8';
                toastMsg.push(`Sleep Duration: ${data.sleepDuration} hrs`);
              }
              if (data.steps !== undefined) {
                document.getElementById('log-workout-steps').value = data.steps;
                toastMsg.push(`Steps: ${data.steps}`);
              }
              if (data.calories !== undefined) {
                document.getElementById('log-workout-calories').value = data.calories;
                toastMsg.push(`Calories: ${data.calories}`);
              }
              if (data.meditation !== undefined) {
                document.getElementById('log-mental-meditation').value = data.meditation;
                toastMsg.push(`Meditation: ${data.meditation} mins`);
              }

              if (toastMsg.length > 0) {
                Toast.success(`Voice parameters loaded: ${toastMsg.join(', ')}`);
              } else {
                Toast.warning(`Transcribed speech successfully, but didn't identify exact lifestyle keywords. Try saying 'I drank 5 glasses of water' or 'I walked 8000 steps'.`);
              }
            },
            (errorMsg) => {
              micBtn.classList.remove('recording');
              statusText.innerText = i18n.t('speechPlaceholder');
              Toast.danger(errorMsg);
            }
          );
        }
      });
    }

    // Submit handler
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Gather all inputs
        const logData = {
          sleep: {
            sleepTime: document.getElementById('log-sleep-bed').value,
            wakeTime: document.getElementById('log-sleep-wake').value,
            quality: Number(document.getElementById('log-sleep-quality').value)
          },
          water: {
            amount: Number(document.getElementById('log-water-amt').value),
            goal: Number(document.getElementById('log-water-goal').value)
          },
          diet: {
            breakfast: document.getElementById('log-diet-breakfast').value,
            lunch: document.getElementById('log-diet-lunch').value,
            dinner: document.getElementById('log-diet-dinner').value,
            snacks: document.getElementById('log-diet-snacks').value,
            junk: Number(document.getElementById('log-diet-junk').value),
            protein: Number(document.getElementById('log-diet-protein').value),
            sugar: Number(document.getElementById('log-diet-sugar').value),
            vegetables: Number(document.getElementById('log-diet-veg').value),
            fruits: Number(document.getElementById('log-diet-fruit').value)
          },
          exercise: {
            duration: Number(document.getElementById('log-workout-duration').value),
            type: document.getElementById('log-workout-type').value,
            steps: Number(document.getElementById('log-workout-steps').value),
            calories: Number(document.getElementById('log-workout-calories').value)
          },
          mental: {
            mood: document.getElementById('log-mental-mood').value,
            stress: Number(document.getElementById('log-mental-stress').value),
            anxiety: Number(document.getElementById('log-mental-anxiety').value),
            meditation: Number(document.getElementById('log-mental-meditation').value),
            gratitude: document.getElementById('log-mental-gratitude').value
          },
          screen: {
            mobile: Number(document.getElementById('log-screen-mobile').value),
            social: Number(document.getElementById('log-screen-social').value),
            gaming: Number(document.getElementById('log-screen-gaming').value),
            work: Number(document.getElementById('log-screen-work').value)
          },
          productivity: {
            hours: Number(document.getElementById('log-prod-hours').value),
            tasks: Number(document.getElementById('log-prod-tasks').value),
            focus: Number(document.getElementById('log-prod-focus').value),
            breaks: Number(document.getElementById('log-prod-breaks').value)
          },
          habits: {
            smoking: document.getElementById('log-habits-smoking').checked,
            alcohol: document.getElementById('log-habits-alcohol').checked,
            reading: document.getElementById('log-habits-reading').checked,
            learning: document.getElementById('log-habits-learning').checked,
            outdoor: document.getElementById('log-habits-outdoor').checked,
            caffeine: Number(document.getElementById('log-habits-caffeine').value)
          }
        };

        // 2. Save dynamic profile details
        const profileName = document.getElementById('log-profile-name').value;
        const profileDetails = {
          age: Number(document.getElementById('log-profile-age').value),
          gender: document.getElementById('log-profile-gender').value,
          occupation: document.getElementById('log-profile-occupation').value,
          height: Number(document.getElementById('log-profile-height').value),
          weight: Number(document.getElementById('log-profile-weight').value)
        };

        // Save structures
        store.updateProfileDetails(profileName, profileDetails);
        store.saveDailyLog(todayStr, logData);

        Toast.success('Logs stored successfully! Level points updated.');
        window.router.navigateTo('dashboard');
      });
    }
  }
};

export default LogsView;
