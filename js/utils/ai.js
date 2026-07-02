// PulseLife AI Intelligence & Analytical Engine
import { store } from '../store.js';

export const AIEngine = {
  // Calculates individual sub-scores and overall lifestyle score (out of 100)
  calculateScores(log) {
    // If log is empty/unfilled, return 0 for all lifestyle scores
    if (!log || (log.sleep?.sleepTime === '' && log.water?.amount === 0 && log.exercise?.duration === 0 && log.productivity?.hours === 0)) {
      return { lifestyle: 0, wellness: 0, productivity: 0, sleep: 0, habits: 0 };
    }

    // 1. Sleep Score (0-100)
    let sleepScore = 50;
    if (log.sleep) {
      const duration = this.calculateSleepDuration(log.sleep.sleepTime, log.sleep.wakeTime);
      const quality = Number(log.sleep.quality) || 5;
      
      // Optimal sleep: 7-9 hours
      let durationPoints = 0;
      if (duration >= 7 && duration <= 9) durationPoints = 60;
      else if (duration > 5 && duration < 7) durationPoints = 40;
      else if (duration > 9 && duration <= 10) durationPoints = 45;
      else durationPoints = 20;

      const qualityPoints = quality * 4; // Max 40 points
      sleepScore = Math.min(100, durationPoints + qualityPoints);
    }

    // 2. Wellness / Health Score (0-100)
    let wellnessScore = 50;
    const waterScore = log.water ? Math.min(100, (log.water.amount / (log.water.goal || 8)) * 100) : 50;
    
    let exerciseScore = 30; // base standard
    if (log.exercise) {
      const duration = Number(log.exercise.duration) || 0;
      const steps = Number(log.exercise.steps) || 0;
      exerciseScore = Math.min(100, (duration / 30) * 40 + (steps / 10000) * 60);
    }
    
    let dietScore = 70;
    if (log.diet) {
      const junkPenalty = (Number(log.diet.junk) || 0) * 15;
      const vegBonus = (Number(log.diet.vegetables) || 0) * 10 + (Number(log.diet.fruits) || 0) * 5;
      dietScore = Math.max(10, Math.min(100, dietScore - junkPenalty + vegBonus));
    }
    wellnessScore = Math.round((waterScore * 0.25) + (exerciseScore * 0.4) + (dietScore * 0.35));

    // 3. Productivity Score (0-100)
    let productivityScore = 50;
    if (log.productivity) {
      const hours = Number(log.productivity.hours) || 0;
      const tasks = Number(log.productivity.tasks) || 0;
      const focus = Number(log.productivity.focus) || 5;
      
      // Optimal working hours: 6-9
      let hoursPoints = 0;
      if (hours >= 6 && hours <= 9) hoursPoints = 40;
      else if (hours > 0 && hours < 6) hoursPoints = (hours / 6) * 30;
      else hoursPoints = 20; // Overworking penalizes score

      const taskPoints = Math.min(30, tasks * 6);
      const focusPoints = focus * 3; // max 30
      productivityScore = Math.min(100, Math.round(hoursPoints + taskPoints + focusPoints));
    }

    // 4. Habits Score (0-100)
    let habitsScore = 0;
    if (log.habits) {
      let count = 0;
      let total = 0;
      
      // Negative habits
      if (log.habits.smoking === false) { count++; } total++;
      if (log.habits.alcohol === false) { count++; } total++;
      if (Number(log.habits.caffeine) <= 2) { count++; } total++;

      // Positive habits
      if (log.habits.reading === true) { count++; } total++;
      if (log.habits.learning === true) { count++; } total++;
      if (log.habits.outdoor === true) { count++; } total++;

      habitsScore = Math.round((count / total) * 100);
    }

    // 5. Overall Lifestyle Score (Weighted)
    const lifestyle = Math.round(
      (sleepScore * 0.25) + 
      (wellnessScore * 0.35) + 
      (productivityScore * 0.25) + 
      (habitsScore * 0.15)
    );

    return {
      lifestyle,
      wellness: wellnessScore,
      productivity: productivityScore,
      sleep: Math.round(sleepScore),
      habits: habitsScore
    };
  },

  calculateSleepDuration(sleepTime, wakeTime) {
    if (!sleepTime || !wakeTime) return 0; // return 0 if no sleep time has been logged
    const [sH, sM] = sleepTime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);
    
    let diff = (wH * 60 + wM) - (sH * 60 + sM);
    if (diff < 0) {
      diff += 24 * 60; // slept overnight
    }
    return Number((diff / 60).toFixed(1));
  },

  // Generates analytical feedback summaries based on logs
  generateInsights(log, userDetails = {}) {
    const scores = this.calculateScores(log);
    const insights = [];
    const alerts = [];
    const challenges = [];

    const age = userDetails.age || 25;
    const occupation = userDetails.occupation || 'Professional';

    // 1. Core Alerts (Warnings)
    if (log.habits && log.habits.smoking) {
      alerts.push('Smoking: Severe warning. Smoking hinders cardiovascular fitness and reduces lung volume. Consider joining our smoke-cessation challenge.');
    }
    if (log.habits && Number(log.habits.caffeine) > 3) {
      alerts.push(`High Caffeine (${log.habits.caffeine} cups): Can trigger elevated anxiety, high cortisol levels, and disrupt deep sleep phases. Keep under 2 cups.`);
    }
    if (log.mental && Number(log.mental.stress) >= 7) {
      alerts.push(`Critical Stress (Level ${log.mental.stress}/10): High stress levels detected. Suggests immediate micro-breaks. Incorporate deep-breathing exercises.`);
    }
    if (log.sleep) {
      const duration = this.calculateSleepDuration(log.sleep.sleepTime, log.sleep.wakeTime);
      if (duration < 6) {
        alerts.push(`Short Sleep (${duration} hrs): Sleep deprivation hampers focus, weight loss, and immunity. Set a sleep reminder for 10:30 PM.`);
      }
    }
    if (log.screen) {
      const workScreen = Number(log.screen.work) || 0;
      const mobileScreen = Number(log.screen.mobile) || 0;
      if (workScreen + mobileScreen > 10) {
        alerts.push(`Digital Eye Strain (Screen time ${Math.round(workScreen + mobileScreen)} hrs): Implement the 20-20-20 rule to avoid strain.`);
      }
    }

    // 2. Health Suggestions
    // Hydration
    if (log.water) {
      if (log.water.amount < log.water.goal) {
        insights.push({
          category: 'Hydration',
          icon: 'fa-droplet',
          color: '#3b82f6',
          text: `Drink ${Math.max(1, log.water.goal - log.water.amount)} more glasses to hit your goal. Proper hydration reduces cognitive fatigue and keeps joints lubricated.`
        });
      } else {
        insights.push({
          category: 'Hydration',
          icon: 'fa-droplet',
          color: '#10b981',
          text: 'Perfect hydration today! Hit daily goal. Keeps muscles energized and skin clear.'
        });
      }
    }

    // Diet
    if (log.diet) {
      if (log.diet.junk > 1) {
        insights.push({
          category: 'Diet & Nutrition',
          icon: 'fa-apple-whole',
          color: '#ef4444',
          text: 'Increase complex proteins and veggies. High sugars and junk trigger energy crashes. Opt for almonds or fruits as healthy snacks.'
        });
      } else {
        insights.push({
          category: 'Diet & Nutrition',
          icon: 'fa-apple-whole',
          color: '#10b981',
          text: 'Nutritional balance looks clean. Protein supports muscle synthesis, while micronutrients from your greens build cell energy.'
        });
      }
    }

    // Exercise
    if (log.exercise) {
      const duration = Number(log.exercise.duration) || 0;
      if (duration < 30) {
        insights.push({
          category: 'Exercise & Activity',
          icon: 'fa-person-running',
          color: '#f59e0b',
          text: `Only logged ${duration} mins of active training. Target at least 30 minutes of moderate activity (e.g. brisk walking) to boost heart health.`
        });
      } else {
        insights.push({
          category: 'Exercise & Activity',
          icon: 'fa-person-running',
          color: '#10b981',
          text: `Great workout! Active duration: ${duration} mins. Promotes neural endorphins and burns body fat.`
        });
      }
    }

    // Sleep
    if (log.sleep) {
      const duration = this.calculateSleepDuration(log.sleep.sleepTime, log.sleep.wakeTime);
      const quality = Number(log.sleep.quality) || 5;
      if (quality < 6 || duration < 7) {
        insights.push({
          category: 'Sleep Optimization',
          icon: 'fa-bed',
          color: '#8b5cf6',
          text: 'To improve sleep quality, stop using phone screens 45 minutes before sleep. Try dark sheets and limit caffeine after 2:00 PM.'
        });
      } else {
        insights.push({
          category: 'Sleep Optimization',
          icon: 'fa-bed',
          color: '#10b981',
          text: `Restful sleep recorded (${duration} hours). Consistent sleep-wake cycles regulate circadian rhythms.`
        });
      }
    }

    // Mental wellness
    if (log.mental) {
      const med = Number(log.mental.meditation) || 0;
      if (med < 10) {
        insights.push({
          category: 'Mental Wellness',
          icon: 'fa-brain',
          color: '#8b5cf6',
          text: 'Dedicate 10 minutes to silent mindfulness or breathing exercises. It activates the parasympathetic system, reducing anxiety.'
        });
      } else {
        insights.push({
          category: 'Mental Wellness',
          icon: 'fa-brain',
          color: '#10b981',
          text: 'Mindful practice complete. Keeps anxiety levels grounded.'
        });
      }
    }

    // Productivity
    if (log.productivity) {
      const focus = Number(log.productivity.focus) || 5;
      if (focus < 6) {
        insights.push({
          category: 'Productivity',
          icon: 'fa-laptop-code',
          color: '#3b82f6',
          text: 'Focus score is low. Use the Pomodoro technique (25 min work, 5 min break). Block social media domains during task sprints.'
        });
      } else {
        insights.push({
          category: 'Productivity',
          icon: 'fa-laptop-code',
          color: '#10b981',
          text: `Superb focus! Work tasks executed: ${log.productivity.tasks}. Solid structure and focus.`
        });
      }
    }

    // 3. Dynamic Challenges generator
    challenges.push({ id: 'chal_water', text: 'Hydration Sprint: Drink 8 full glasses of water today.', completed: (log.water && log.water.amount >= 8) });
    challenges.push({ id: 'chal_walk', text: 'Step Challenge: Walk 10,000 steps.', completed: (log.exercise && log.exercise.steps >= 10000) });
    challenges.push({ id: 'chal_meditate', text: 'Mindful Moment: Complete 15 minutes of meditation.', completed: (log.mental && log.mental.meditation >= 15) });
    challenges.push({ id: 'chal_diet', text: 'Greens Only: Avoid junk foods and eat 3 servings of veggies.', completed: (log.diet && log.diet.junk === 0 && log.diet.vegetables >= 3) });
    challenges.push({ id: 'chal_reading', text: 'Self-Growth: Read a book or learn for 30 minutes.', completed: (log.habits && (log.habits.reading || log.habits.learning)) });

    return {
      scores,
      insights,
      alerts,
      challenges,
      motivationalMessage: this.getMotivationalMessage(scores.lifestyle)
    };
  },

  getMotivationalMessage(score) {
    if (score >= 85) {
      return "Phenomenal work! You are performing at peak potential. Keep maintaining this robust pace!";
    } else if (score >= 70) {
      return "Solid progress! Your habits show good consistency. Focus on sleep schedules to reach peak health levels.";
    } else if (score >= 50) {
      return "You're on track, but there is room to improve. Hydration, daily steps, and screen time management will elevate your wellness index.";
    } else {
      return "A journey of a thousand miles begins with a single step. Start logging today and cut junk foods to reboot your metabolism.";
    }
  },

  // AI Workout generator
  generateWorkoutPlan(type, level, duration) {
    const workouts = {
      Strength: {
        Beginner: ['Warmup dynamic stretches (5 min)', 'Bodyweight squats: 3 sets of 12 reps', 'Push-ups (knees allowed): 3 sets of 10 reps', 'Glute bridges: 3 sets of 15 reps', 'Plank hold: 3 sets of 30 seconds', 'Cooldown stretching (5 min)'],
        Intermediate: ['Warmup dynamic stretches (5 min)', 'Goblet squats: 4 sets of 12 reps (medium weight)', 'Standard Push-ups: 4 sets of 15 reps', 'Dumbbell Romanian Deadlifts: 4 sets of 12 reps', 'Dumbbell Shoulder Press: 3 sets of 10 reps', 'Plank hold: 3 sets of 60 seconds', 'Cooldown stretching (5 min)'],
        Advanced: ['Warmup dynamic stretches (5 min)', 'Barbell squats: 4 sets of 8 reps (heavy)', 'Weighted Push-ups / Dips: 4 sets of 10 reps', 'Barbell Deadlifts: 4 sets of 6 reps', 'Overhead Dumbbell Press: 4 sets of 8 reps', 'Hanging leg raises: 3 sets of 15 reps', 'Cooldown stretching (5 min)']
      },
      Yoga: {
        Beginner: ['Child\'s Pose: 2 mins', 'Cat-Cow Flow: 3 mins', 'Downward Facing Dog: 3 mins', 'Warrior I & II Pose: 5 mins', 'Tree Pose (balance): 3 mins', 'Savasana (relaxation): 5 mins'],
        Intermediate: ['Cat-Cow & Cobra Flow: 5 mins', 'Downward Dog to Plank Flow: 5 mins', 'Warrior III (balance): 4 mins', 'Crow Pose practice: 3 mins', 'Bridge Pose: 4 mins', 'Savasana with deep breathing: 5 mins'],
        Advanced: ['Sun Salutation (Surya Namaskar): 8 mins', 'Headstand (Sirsasana) practice: 5 mins', 'Wheel Pose (Urdhva Dhanurasana): 5 mins', 'Crow to Tripod Headstand Flow: 5 mins', 'Half Pigeon Pose (deep stretch): 5 mins', 'Savasana / Meditation: 5 mins']
      },
      Cardio: {
        Beginner: ['Slow jog / Brisk walk: 10 mins', 'Jumping jacks: 3 sets of 30 seconds', 'High knees: 3 sets of 30 seconds', 'Light jogging: 10 mins', 'Walking cooldown: 5 mins'],
        Intermediate: ['Fast jog: 10 mins', 'Jumping jacks: 4 sets of 45 seconds', 'Mountain climbers: 4 sets of 30 seconds', 'Bicycle crunches: 3 sets of 20 reps', 'HIIT sprints (30s sprint, 30s walk): 6 rounds', 'Walking cooldown: 5 mins'],
        Advanced: ['Fast running: 15 mins', 'Burpees: 4 sets of 15 reps', 'Jump squats: 4 sets of 20 reps', 'HIIT sprints (40s sprint, 20s jog): 10 rounds', 'Mountain climbers: 4 sets of 45 seconds', 'Walking cooldown: 5 mins']
      }
    };

    const selType = workouts[type] || workouts['Strength'];
    const selPlan = selType[level] || selType['Beginner'];
    
    // Scale or adjust based on duration (short, medium, long)
    return selPlan;
  },

  // AI Meal Planner
  generateMealPlan(preferences, targetCal) {
    const meals = {
      Omnivore: {
        Breakfast: 'Spinach & Feta Omelet (3 eggs) served with 1 slice of whole wheat toast. Calories: ~380 kcal. Protein: 28g.',
        Lunch: 'Grilled Chicken Breast (150g) with quinoa (1 cup) and steam-cooked broccoli. Calories: ~520 kcal. Protein: 45g.',
        Dinner: 'Baked Salmon Fillet (150g) with sweet potato mash and grilled asparagus. Calories: ~480 kcal. Protein: 38g.',
        Snack: 'Greek yogurt (150g) topped with a handful of blueberries and honey. Calories: ~180 kcal. Protein: 15g.'
      },
      Vegetarian: {
        Breakfast: 'Oatmeal cooked in almond milk, topped with sliced bananas, chia seeds, and almond butter. Calories: ~350 kcal. Protein: 12g.',
        Lunch: 'Chickpea & Avocado salad with cucumber, cherry tomatoes, and lemon-tahini dressing. Calories: ~450 kcal. Protein: 16g.',
        Dinner: 'Tofu stir-fry with mixed bell peppers, snap peas, brown rice, and low-sodium soy sauce. Calories: ~420 kcal. Protein: 22g.',
        Snack: 'Carrot sticks and sliced bell pepper served with hummus (3 tbsp). Calories: ~150 kcal. Protein: 5g.'
      },
      Vegan: {
        Breakfast: 'Tofu scramble (firm tofu with turmeric and spinach) served with sliced avocado. Calories: ~320 kcal. Protein: 18g.',
        Lunch: 'Lentil soup served with 1 slice of sourdough bread and side salad. Calories: ~440 kcal. Protein: 20g.',
        Dinner: 'Stuffed bell pepper with black beans, corn, quinoa, and topped with salsa. Calories: ~400 kcal. Protein: 15g.',
        Snack: 'A handful of raw almonds and walnuts. Calories: ~160 kcal. Protein: 6g.'
      }
    };

    const selPlan = meals[preferences] || meals['Omnivore'];
    return selPlan;
  },

  // Dynamic Chatbot responses
  chatResponse(message, currentLogs = {}, userDetails = {}) {
    const msg = message.toLowerCase();
    const age = userDetails.age || 25;
    const name = userDetails.name ? userDetails.name.split(' ')[0] : 'there';
    
    // Analyze today's latest habits for context
    const scores = this.calculateScores(currentLogs);
    
    // 1. SLEEP RESPONSE
    if (msg.includes('sleep') || msg.includes('dormir')) {
      const avgSleep = currentLogs.sleep ? this.calculateSleepDuration(currentLogs.sleep.sleepTime, currentLogs.sleep.wakeTime) : 7.5;
      return `Hello ${name}, looking at your logs, your sleep duration is roughly ${avgSleep} hours, with a quality score of ${currentLogs.sleep?.quality || 5}/10.<br><br>
              <strong>My AI recommendations for you:</strong><br>
              1. <strong>Circadian Anchor:</strong> Maintain a strict wake-up time even on weekends. This stabilizes your internal melatonin cycle.<br>
              2. <strong>Digital Wind-down:</strong> Avoid blue-light screens (mobile, gaming) at least 45 minutes prior to sleep. Blue light suppresses melatonin synthesis.<br>
              3. <strong>Temperature:</strong> Cool rooms (around 18°C) are clinically shown to facilitate deep slow-wave sleep.<br>
              4. <strong>Stimulants:</strong> Limit caffeine after 2:00 PM as its half-life ranges from 5 to 7 hours.`;
    }

    // 2. BREAKFAST / DIET RESPONSE
    if (msg.includes('breakfast') || msg.includes('desayuno') || msg.includes('eat') || msg.includes('food') || msg.includes('diet')) {
      const junkServings = currentLogs.diet ? currentLogs.diet.junk : 0;
      let reviewStr = junkServings > 0 ? `You logged ${junkServings} junk servings recently. I suggest substituting these with nutrient-dense options.` : `Your diet log shows healthy choices today!`;

      return `Hi ${name}. ${reviewStr}<br><br>
              <strong>Suggested Premium Healthy Breakfasts:</strong><br>
              - <strong>Option A (High Protein):</strong> 3 scrambled egg whites, 1 whole egg, cooked with spinach, served on 1 slice of toasted rye bread alongside half an avocado. (~400 kcal)<br>
              - <strong>Option B (Plant-based):</strong> 1 cup Rolled Oats boiled in oat milk, mixed with 1 scoop vegan protein powder, topped with walnuts, flaxseeds, and fresh raspberries. (~450 kcal)<br>
              - <strong>Option C (Quick/Light):</strong> Low-fat Greek yogurt, mixed with chia seeds, pumpkin seeds, and half a sliced banana. (~300 kcal)<br><br>
              Focus on low glycemic index carbs to avoid mid-day insulin spikes!`;
    }

    // 3. WORKOUT PLAN
    if (msg.includes('workout') || msg.includes('ejercicio') || msg.includes('exercise') || msg.includes('run')) {
      return `Sure ${name}! I've generated a fast, high-impact **Cardio + Core Strength HIIT** workout plan for you:<br><br>
              <strong>Duration:</strong> 25 minutes | <strong>Difficulty:</strong> Intermediate<br><br>
              1. <strong>Warmup (3 min):</strong> Gentle jogging in place, shoulder circles, and dynamic lunges.<br>
              2. <strong>Main Block (18 min) - Perform 3 rounds of the following:</strong><br>
                 - Jumping Jacks: 45 seconds work, 15 seconds rest.<br>
                 - Goblet/Air Squats: 45 seconds work, 15 seconds rest.<br>
                 - Push-ups: 45 seconds work, 15 seconds rest.<br>
                 - Mountain Climbers: 45 seconds work, 15 seconds rest.<br>
                 - High Knees: 45 seconds work, 15 seconds rest.<br>
                 - Plank Hold: 45 seconds work, 15 seconds rest.<br>
              3. <strong>Cooldown (4 min):</strong> Standing hamstring stretch, Cobra pose stretch, and slow deep breathing.`;
    }

    // 4. STRESS REDUCTION
    if (msg.includes('stress') || msg.includes('anxiety') || msg.includes('estrés') || msg.includes('meditate')) {
      const stressLevel = currentLogs.mental ? currentLogs.mental.stress : 5;
      return `Hi ${name}. I see your recorded stress level is ${stressLevel}/10.<br><br>
              <strong>Here are immediate, science-backed steps to reduce stress right now:</strong><br>
              1. <strong>Physiological Sigh:</strong> Take two quick inhales through the nose, followed by one long, slow exhale through the mouth. Repeat 3 times. This immediately slows heart rate by engaging the vagus nerve.<br>
              2. <strong>Box Breathing:</strong> Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat for 3 minutes.<br>
              3. <strong>Forest Bathing / Nature Walk:</strong> Step outside for 10 minutes. Natural light and shifting gaze from screens reduces visual amygdala activation.<br>
              4. <strong>Gratitude Focus:</strong> Write down 3 specific things you are grateful for today in the Gratitude section of your log.`;
    }

    // 5. HABIT ANALYSIS
    if (msg.includes('habit') || msg.includes('analyze') || msg.includes('consistency') || msg.includes('score')) {
      return `Here is your detailed lifestyle analysis, ${name}:<br><br>
              - <strong>Overall Health Score:</strong> ${scores.lifestyle}/100<br>
              - <strong>Wellness Index:</strong> ${scores.wellness}/100<br>
              - <strong>Productivity Index:</strong> ${scores.productivity}/100<br>
              - <strong>Sleep Hygiene:</strong> ${scores.sleep}/100<br>
              - <strong>Habit Strength:</strong> ${scores.habits}/100<br><br>
              <strong>Key Strengths:</strong> Your productivity and hydration focus is exemplary.<br>
              <strong>Focus Area:</strong> Reduce work screen times in the evenings and replace digital habits with reading or outdoor walking.`;
    }

    // 6. DEFAULT / FALLBACK
    return `Hello! I am your PulseLife AI Coach. I analyze your daily habits, sleep patterns, dietary inputs, and exercises to give you actionable advice.<br><br>
            You can ask me questions like:<br>
            - *"How can I sleep better?"*<br>
            - *"Suggest a healthy breakfast."*<br>
            - *"Create a workout plan."*<br>
            - *"How can I reduce stress?"*<br>
            - *"Analyze my habits."*<br><br>
            How can I help you improve your routine today?`;
  },

  async callGroqAPI(systemPrompt, userPrompt) {
    const key = store.state.settings.groqKey;
    if (!key || !key.startsWith('gsk_')) {
      throw new Error('Groq API Key is not configured.');
    }

    const response = await fetch('/api/groq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error code ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  async chatResponseAsync(message, currentLogs = {}, userDetails = {}) {
    try {
      const systemPrompt = `You are the PulseLife AI Wellness Coach. You are an expert in health, sleep, nutrition, and workout planning.
      
      CRITICAL FLOW PROTOCOL:
      1. FIRST priority: Ask the user about their routine, age, height, and weight. If they have not provided these details in their message, politely refuse to answer other general questions and ask them to share their routine, age, height, and weight first.
      2. Once they share their routine, age, height, and weight, acknowledge and save this context mentally.
      3. For all subsequent questions, answer precisely, directly, and in short form (maximum 2-3 sentences).
      4. Use simple HTML tags for formatting (e.g. <strong>, <br>, <ul>, <li>). Do NOT use markdown code blocks or triple backticks.
      
      Current User Profile (if needed): Age: ${userDetails.age}, Gender: ${userDetails.gender}, Height: ${userDetails.height}cm, Weight: ${userDetails.weight}kg, Occupation: ${userDetails.occupation}.
      Today's User Logs:
      - Sleep: ${JSON.stringify(currentLogs.sleep)}
      - Water: ${JSON.stringify(currentLogs.water)}
      - Diet: ${JSON.stringify(currentLogs.diet)}
      - Exercise: ${JSON.stringify(currentLogs.exercise)}
      - Mental Wellness: ${JSON.stringify(currentLogs.mental)}
      - Screen Time: ${JSON.stringify(currentLogs.screen)}
      - Productivity: ${JSON.stringify(currentLogs.productivity)}
      - Habits: ${JSON.stringify(currentLogs.habits)}`;

      return await this.callGroqAPI(systemPrompt, message);
    } catch (e) {
      console.error('Groq Chat Error:', e);
      return this.chatResponse(message, currentLogs, userDetails) + `<br><br><span style="color:#ef4444; font-size:0.8rem; font-weight:600;"><i class="fa-solid fa-triangle-exclamation"></i> Groq API failed (${e.message}). Switched to local offline Coach.</span>`;
    }
  },

  async generateWorkoutPlanAsync(type, level, duration) {
    try {
      const systemPrompt = `You are a fitness expert. Create a custom workout plan for: Category: ${type}, Level: ${level}, Duration: ${duration} minutes. 
      Return ONLY a JSON array of strings, where each string represents an exercise name with sets/reps or details. Return nothing else, no markdown code blocks, no backticks, no text wrappers.
      Example format: ["Warmup stretch: 5 min", "Bodyweight Squats: 3 sets of 15", "Pushups: 3 sets of 10", "Cooldown breathing: 3 min"]`;
      
      const responseText = await this.callGroqAPI(systemPrompt, `Generate ${type} ${level} workout.`);
      
      // Clean potential json markers if present
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const array = JSON.parse(cleaned);
      if (Array.isArray(array)) {
        return array;
      }
      throw new Error('Response is not a valid array.');
    } catch (e) {
      console.error('Groq Workout Plan Error:', e);
      return this.generateWorkoutPlan(type, level, duration);
    }
  },

  async generateMealPlanAsync(preferences, targetCal) {
    try {
      const systemPrompt = `You are a nutritionist. Generate a daily meal plan with: Diet preference: ${preferences}, Target Calories: ${targetCal} kcal. 
      Return ONLY a JSON object with keys: Breakfast, Lunch, Dinner, Snack. Each value must be a brief description with estimated calories and protein content. 
      Return nothing else, no explanation, no markdown backticks.
      Example format: {"Breakfast": "Oatmeal...", "Lunch": "Salad...", "Dinner": "Chicken...", "Snack": "Yogurt..."}`;
      
      const responseText = await this.callGroqAPI(systemPrompt, `Generate ${preferences} meal plan.`);
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const obj = JSON.parse(cleaned);
      if (obj.Breakfast && obj.Lunch && obj.Dinner && obj.Snack) {
        return obj;
      }
      throw new Error('Response is missing keys.');
    } catch (e) {
      console.error('Groq Meal Plan Error:', e);
      return this.generateMealPlan(preferences, targetCal);
    }
  }
};

export default AIEngine;
