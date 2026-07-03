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

  getExerciseImage(name) {
    const n = name.toLowerCase();
    if (n.includes('pushup') || n.includes('push-up')) return 'images/exercises/pushups.png';
    if (n.includes('squat')) return 'images/exercises/squats.png';
    if (n.includes('plank')) return 'images/exercises/plank.png';
    if (n.includes('yoga') || n.includes('pose') || n.includes('dog') || n.includes('savasana') || n.includes('salutation') || n.includes('flow') || n.includes('meditation') || n.includes('child\'s') || n.includes('cow') || n.includes('cobra') || n.includes('pigeon')) return 'images/exercises/yoga.png';
    if (n.includes('stretch') || n.includes('cooldown') || n.includes('warmup') || n.includes('stretching')) return 'images/exercises/stretching.png';
    if (n.includes('run') || n.includes('jog') || n.includes('hiit') || n.includes('jack') || n.includes('climber') || n.includes('knee') || n.includes('cardio') || n.includes('burpee') || n.includes('crunch')) return 'images/exercises/cardio.png';
    return null;
  },

  getExerciseMediaHTML(name, size = 55) {
    // Generate short AI tracking analysis video loop (animated vector representation) for every exercise
    const n = name.toLowerCase();
    let animationContent = '';
    
    if (n.includes('pushup') || n.includes('push-up')) {
      animationContent = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; max-height: 100%;">
          <style>
            @keyframes pushupLift-${size} {
              0% { transform: translateY(8px) rotate(4deg); }
              100% { transform: translateY(-3px) rotate(0deg); }
            }
            .pushup-body-${size} { animation: pushupLift-${size} 1.2s ease-in-out infinite alternate; transform-origin: 20px 75px; stroke: #10b981; fill: none; stroke-width: 5; stroke-linecap: round; }
          </style>
          <line x1="10" y1="75" x2="90" y2="75" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
          <g class="pushup-body-${size}">
            <line x1="20" y1="50" x2="75" y2="50" />
            <circle cx="80" cy="50" r="4.5" fill="#10b981" />
            <polyline points="55,50 55,62 60,72" stroke-width="4.5" />
          </g>
          <path d="M 6,6 L 94,6 L 94,94 L 6,94 Z" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.3"/>
          <text x="10" y="16" fill="#10b981" font-size="7.5" font-family="monospace" opacity="0.6">AI MOTION: PUSHUP</text>
        </svg>
      `;
    } else if (n.includes('squat')) {
      animationContent = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; max-height: 100%;">
          <style>
            @keyframes squatMotion-${size} {
              0% { transform: translateY(12px); }
              100% { transform: translateY(-4px); }
            }
            .squat-body-${size} { animation: squatMotion-${size} 1.4s ease-in-out infinite alternate; fill: none; stroke: #3b82f6; stroke-width: 5; stroke-linecap: round; }
            .squat-head-${size} { animation: squatMotion-${size} 1.4s ease-in-out infinite alternate; fill: #3b82f6; }
          </style>
          <line x1="10" y1="88" x2="90" y2="88" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
          <circle cx="50" cy="28" r="7.5" class="squat-head-${size}" />
          <path d="M 50,35 L 50,52 L 38,72 M 50,52 L 62,72" class="squat-body-${size}" />
          <path d="M 50,42 L 32,32 M 50,42 L 68,32" class="squat-body-${size}" />
          <path d="M 6,6 L 94,6 L 94,94 L 6,94 Z" fill="none" stroke="#3b82f6" stroke-width="1.5" opacity="0.3"/>
          <text x="10" y="16" fill="#3b82f6" font-size="7.5" font-family="monospace" opacity="0.6">AI MOTION: SQUAT</text>
        </svg>
      `;
    } else if (n.includes('plank')) {
      animationContent = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; max-height: 100%;">
          <style>
            @keyframes plankHold-${size} {
              0% { opacity: 0.6; }
              100% { opacity: 1; }
            }
            .plank-body-${size} { fill: none; stroke: #3b82f6; stroke-width: 5; stroke-linecap: round; }
            .core-pulse-${size} { animation: plankHold-${size} 0.8s ease-in-out infinite alternate; fill: #ef4444; }
          </style>
          <line x1="10" y1="72" x2="90" y2="72" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
          <line x1="20" y1="52" x2="80" y2="52" class="plank-body-${size}" />
          <circle cx="85" cy="52" r="4.5" fill="#3b82f6" />
          <polyline points="68,52 68,72" stroke="#3b82f6" stroke-width="4.5" fill="none" />
          <line x1="20" y1="52" x2="20" y2="72" stroke="#3b82f6" stroke-width="4.5" />
          <circle cx="50" cy="52" r="5" class="core-pulse-${size}" />
          <path d="M 6,6 L 94,6 L 94,94 L 6,94 Z" fill="none" stroke="#3b82f6" stroke-width="1.5" opacity="0.3"/>
          <text x="10" y="16" fill="#3b82f6" font-size="7.5" font-family="monospace" opacity="0.6">AI MOTION: PLANK</text>
        </svg>
      `;
    } else if (n.includes('yoga') || n.includes('pose') || n.includes('dog') || n.includes('savasana') || n.includes('salutation') || n.includes('flow') || n.includes('meditation') || n.includes('child\'s') || n.includes('cow') || n.includes('cobra') || n.includes('pigeon')) {
      animationContent = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; max-height: 100%;">
          <style>
            @keyframes yogaBreath-${size} {
              0% { r: 4px; opacity: 0.3; }
              100% { r: 16px; opacity: 0.8; }
            }
            .yoga-pose-${size} { fill: none; stroke: #8b5cf6; stroke-width: 4.5; stroke-linecap: round; }
            .breath-wave-${size} { animation: yogaBreath-${size} 2s ease-in-out infinite alternate; fill: none; stroke: #a78bfa; stroke-width: 1.5; }
          </style>
          <circle cx="50" cy="42" r="7" fill="#8b5cf6" />
          <circle cx="50" cy="42" class="breath-wave-${size}" />
          <path d="M 50,49 L 50,70 M 50,56 L 32,47 M 50,56 L 68,47 M 50,70 L 32,80 M 50,70 L 68,80" class="yoga-pose-${size}" />
          <path d="M 6,6 L 94,6 L 94,94 L 6,94 Z" fill="none" stroke="#8b5cf6" stroke-width="1.5" opacity="0.3"/>
          <text x="10" y="16" fill="#8b5cf6" font-size="7.5" font-family="monospace" opacity="0.6">AI MOTION: YOGA</text>
        </svg>
      `;
    } else if (n.includes('stretch') || n.includes('cooldown') || n.includes('warmup') || n.includes('stretching')) {
      animationContent = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; max-height: 100%;">
          <style>
            @keyframes stretchFlex-${size} {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-12deg); }
            }
            .flex-spine-${size} { animation: stretchFlex-${size} 1.6s ease-in-out infinite alternate; transform-origin: 50px 72px; fill: none; stroke: #a78bfa; stroke-width: 4.5; stroke-linecap: round; }
          </style>
          <line x1="10" y1="76" x2="90" y2="76" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
          <g class="flex-spine-${size}">
            <line x1="50" y1="72" x2="50" y2="52" />
            <line x1="50" y1="52" x2="28" y2="38" />
            <circle cx="23" cy="33" r="4.5" fill="#a78bfa" />
            <line x1="28" y1="38" x2="22" y2="56" />
          </g>
          <path d="M 6,6 L 94,6 L 94,94 L 6,94 Z" fill="none" stroke="#a78bfa" stroke-width="1.5" opacity="0.3"/>
          <text x="10" y="16" fill="#a78bfa" font-size="7.5" font-family="monospace" opacity="0.6">AI MOTION: STRETCH</text>
        </svg>
      `;
    } else if (n.includes('run') || n.includes('jog') || n.includes('hiit') || n.includes('jack') || n.includes('climber') || n.includes('knee') || n.includes('cardio') || n.includes('burpee') || n.includes('crunch')) {
      animationContent = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; max-height: 100%;">
          <style>
            @keyframes runCycle-${size} {
              0% { transform: translateY(0) rotate(4deg); }
              50% { transform: translateY(-5px) rotate(-4deg); }
              100% { transform: translateY(0) rotate(4deg); }
            }
            .runner-${size} { animation: runCycle-${size} 0.6s linear infinite; fill: none; stroke: #f59e0b; stroke-width: 5; stroke-linecap: round; }
          </style>
          <line x1="10" y1="82" x2="90" y2="82" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
          <g class="runner-${size}" style="transform-origin: 50px 48px;">
            <circle cx="50" cy="24" r="5.5" fill="#f59e0b" style="stroke:none;" />
            <path d="M 50,30 L 50,52 L 36,70 M 50,52 L 60,67 M 50,36 L 34,42 M 50,36 L 66,45" />
          </g>
          <path d="M 6,6 L 94,6 L 94,94 L 6,94 Z" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.3"/>
          <text x="10" y="16" fill="#f59e0b" font-size="7.5" font-family="monospace" opacity="0.6">AI MOTION: CARDIO</text>
        </svg>
      `;
    } else if (n.includes('dumbbell') || n.includes('dumbell') || n.includes('db') || n.includes('curl') || n.includes('raise') || n.includes('press')) {
      animationContent = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; max-height: 100%;">
          <style>
            @keyframes dbLift-${size} {
              0% { transform: translateY(12px); }
              100% { transform: translateY(-12px); }
            }
            .db-${size} { animation: dbLift-${size} 1.2s ease-in-out infinite alternate; fill: #f59e0b; }
            .db-alt-${size} { animation: dbLift-${size} 1.2s ease-in-out infinite alternate-reverse; fill: #3b82f6; }
          </style>
          <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.08)" stroke-dasharray="2" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.08)" stroke-dasharray="2" />
          <g class="db-${size}">
            <rect x="22" y="46" width="16" height="8" rx="2" />
            <rect x="18" y="40" width="4" height="20" rx="1" />
            <rect x="38" y="40" width="4" height="20" rx="1" />
          </g>
          <g class="db-alt-${size}">
            <rect x="62" y="46" width="16" height="8" rx="2" />
            <rect x="58" y="40" width="4" height="20" rx="1" />
            <rect x="78" y="40" width="4" height="20" rx="1" />
          </g>
          <path d="M 6,6 L 94,6 L 94,94 L 6,94 Z" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.3"/>
          <text x="10" y="16" fill="#f59e0b" font-size="7.5" font-family="monospace" opacity="0.6">AI MOTION: DB</text>
        </svg>
      `;
    } else if (n.includes('barbell') || n.includes('deadlift') || n.includes('squat')) {
      animationContent = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; max-height: 100%;">
          <style>
            @keyframes bbLift-${size} {
              0% { transform: translateY(15px); }
              100% { transform: translateY(-10px); }
            }
            .bb-${size} { animation: bbLift-${size} 1.5s ease-in-out infinite alternate; fill: #8b5cf6; stroke: #8b5cf6; }
          </style>
          <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.08)" stroke-dasharray="2" />
          <g class="bb-${size}">
            <line x1="15" y1="50" x2="85" y2="50" stroke-width="3" stroke="#e2e8f0" />
            <rect x="22" y="38" width="5" height="24" rx="1" />
            <rect x="16" y="32" width="5" height="36" rx="1" fill="#ef4444" />
            <rect x="73" y="38" width="5" height="24" rx="1" />
            <rect x="79" y="32" width="5" height="36" rx="1" fill="#ef4444" />
          </g>
          <path d="M 6,6 L 94,6 L 94,94 L 6,94 Z" fill="none" stroke="#8b5cf6" stroke-width="1.5" opacity="0.3"/>
          <text x="10" y="16" fill="#8b5cf6" font-size="7.5" font-family="monospace" opacity="0.6">AI MOTION: BB</text>
        </svg>
      `;
    } else {
      animationContent = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; max-height: 100%;">
          <style>
            @keyframes pulse-${size} {
              0% { transform: scale(0.85); opacity: 0.4; }
              100% { transform: scale(1.05); opacity: 0.95; }
            }
            .pul-${size} { transform-origin: center; animation: pulse-${size} 1s ease-in-out infinite alternate; fill: #10b981; }
          </style>
          <circle cx="50" cy="30" r="10" class="pul-${size}" />
          <path d="M50,42 L50,70 M50,50 L32,42 M50,50 L68,42 M50,70 L38,90 M50,70 L62,90" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" class="pul-${size}" />
          <path d="M 6,6 L 94,6 L 94,94 L 6,94 Z" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.3"/>
          <text x="10" y="16" fill="#10b981" font-size="7.5" font-family="monospace" opacity="0.6">AI MOTION: BODY</text>
        </svg>
      `;
    }

    return `
      <div class="ai-generated-video-container" style="width: ${size}px; height: ${size}px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: #0b0f19; flex-shrink: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;" title="AI Motion Demonstration Video">
        ${animationContent}
        <div style="position: absolute; bottom: 2px; right: 4px; font-size: 0.55rem; color: #fff; background: rgba(0,0,0,0.6); padding: 1px 3px; border-radius: 3px; font-family: monospace; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">VIDEO</div>
      </div>
    `;
  },

  getMealDetails(category, text, dietFocus = 'Omnivore') {
    const cat = category.toLowerCase();
    const focus = (dietFocus || 'Omnivore').toLowerCase();
    
    let benefits = '';
    if (cat.includes('breakfast')) {
      benefits = focus.includes('vegan') || focus.includes('veget') 
        ? 'Provides complex carbohydrates for sustained morning energy, rich in plant-based dietary fibers, and packed with vitamins.'
        : 'High-quality morning proteins and healthy fats to stabilize blood sugar, jumpstart metabolism, and keep you full longer.';
    } else if (cat.includes('lunch')) {
      benefits = focus.includes('vegan') || focus.includes('veget')
        ? 'Abundant plant proteins, colorful leafy greens rich in minerals, and clean healthy fats for midday focus.'
        : 'Lean muscle building protein combined with complex carbs to fuel midday physical and cognitive tasks.';
    } else if (cat.includes('dinner')) {
      benefits = focus.includes('vegan') || focus.includes('veget')
        ? 'Easy to digest, nutrient-dense fiber, and low sodium to promote overnight recovery without sleep disruption.'
        : 'Restorative amino acids and high-quality omega fatty acids to rebuild tissues and support metabolic health during sleep.';
    } else {
      benefits = focus.includes('vegan') || focus.includes('veget')
        ? 'Excellent source of unsaturated fats, trace minerals, and vitamins to curb afternoon cravings naturally.'
        : 'Quick recovery proteins and micronutrient-dense fruits to keep energy levels stable between main courses.';
    }

    return {
      description: text,
      benefits: benefits
    };
  },

  getExerciseDetails(name) {
    const n = name.toLowerCase();
    
    // Knee Push-ups (Beginner)
    if (n.includes('knee push-up')) {
      return {
        description: 'An entry-level push-up variation with knees supporting the lower body weight, reducing total resistance.',
        benefits: 'Builds base upper-body strength in chest and triceps while protecting the lower back from strain.',
        precautions: 'Keep a straight line from head to knees. Do not let your hips sag toward the ground.'
      };
    }
    // Standard Push-ups (Intermediate)
    if (n.includes('standard push-up') || n.includes('standard pushups')) {
      return {
        description: 'A classic bodyweight movement that builds upper body strength by raising and lowering your torso using your arms.',
        benefits: 'Strengthens chest (pectoralis major), shoulders (deltoids), triceps, and abdominal core muscles.',
        precautions: 'Maintain a straight line from head to heels. Avoid letting your hips sag or flaring elbows wider than 45 degrees.'
      };
    }
    // Decline Push-ups (Advanced)
    if (n.includes('decline push-up') || n.includes('decline pushups')) {
      return {
        description: 'An advanced push-up variation where your feet are elevated on a bench or box, shifting more weight to the upper chest.',
        benefits: 'Targets the upper chest (clavicular head) and anterior deltoids, and demands higher core stabilization.',
        precautions: 'Keep elbows tucked. Keep core braced tightly to prevent hyperextension of the lumbar spine.'
      };
    }
    
    // Squat variations
    if (n.includes('bodyweight squat')) {
      return {
        description: 'A foundational lower body exercise using only your body weight to sit back and stand back up.',
        benefits: 'Develops basic mobility, joint strength, and coordination in quads, glutes, and hamstrings.',
        precautions: 'Keep heels flat on the floor. Push knees outward to stay aligned with your toes.'
      };
    }
    if (n.includes('goblet squat')) {
      return {
        description: 'An intermediate squat variation where a dumbbell is held in front of the chest, loading the anterior core.',
        benefits: 'Builds core strength, counterbalances the torso for deeper squat depth, and strengthens legs.',
        precautions: 'Keep the weight close to your chest. Maintain an upright chest throughout the repetition.'
      };
    }
    if (n.includes('barbell squat')) {
      return {
        description: 'A heavy compound barbell squat loading the bar across the upper back traps for advanced legs development.',
        benefits: 'Increases muscular hypertrophy in quads and glutes, enhances bone density, and builds trunk stiffness.',
        precautions: 'Ensure you have a safety rack. Engage core tightly, keep spine neutral, and squat to parallel depth.'
      };
    }

    // Plank variations
    if (n.includes('wall sit')) {
      return {
        description: 'A beginner static leg exercise where your back rests flat against a wall with thighs parallel to the ground.',
        benefits: 'Builds isometric endurance in the quadriceps, calves, and glutes with zero joint impact.',
        precautions: 'Keep your knees bent at exactly 90 degrees and push your lower back firmly into the wall.'
      };
    }
    if (n.includes('forearm plank') || n.includes('plank hold')) {
      return {
        description: 'An isometric static core lift where you maintain a straight torso resting on your forearms and toes.',
        benefits: 'Builds deep core endurance, strengthens lower back stabilizers, shoulders, and glutes.',
        precautions: 'Do not let your lower back arch or hips drop. Look straight down to keep your neck in a neutral alignment.'
      };
    }

    // Yoga variations
    if (n.includes('child\'s pose') || n.includes('easy pose') || n.includes('sphinx pose') || n.includes('corpse pose') || n.includes('savasana')) {
      return {
        description: 'Gentle, foundational yoga positions designed for deep breathing, physical relaxation, and recovery.',
        benefits: 'Lowers heart rate, gently stretches hips and spine, and calms the nervous system.',
        precautions: 'Relax all muscles. If you experience discomfort in joints, use a yoga block or blanket for support.'
      };
    }
    if (n.includes('downward facing') || n.includes('warrior i') || n.includes('cobra pose') || n.includes('bridge pose') || n.includes('tree pose')) {
      return {
        description: 'Active yoga positions that demand mild flexibility, muscle activation, and balance holds.',
        benefits: 'Strengthens shoulders, back, and thighs, improves posture, and increases range of motion.',
        precautions: 'Distribute weight evenly. Do not lock your joints (micro-bend knees or elbows if needed).'
      };
    }
    if (n.includes('sun salutation') || n.includes('headstand') || n.includes('crow pose') || n.includes('wheel pose') || n.includes('pigeon')) {
      return {
        description: 'Advanced, dynamic yoga flows or complex holds requiring high stability, balance, and deep focus.',
        benefits: 'Builds significant arm and core strength, deep hip flexibility, and advanced bodily control.',
        precautions: 'Prioritize breath control. Never force structural joints (like neck or lower back) into pain.'
      };
    }

    // Cardio variations
    if (n.includes('brisk walk') || n.includes('marching') || n.includes('step-touch') || n.includes('circle')) {
      return {
        description: 'Low-impact cardiovascular movements to activate blood circulation and warm up the body gently.',
        benefits: 'Supports daily physical activity, keeps joints moving, and burns light active calories.',
        precautions: 'Maintain a tall, upright posture. Breathe rhythmically through your nose.'
      };
    }
    if (n.includes('jumping jack') || n.includes('mountain climber') || n.includes('bicycle crunch') || n.includes('fast jog')) {
      return {
        description: 'Moderate-intensity cardio exercises designed to elevate heart rate and engage muscles.',
        benefits: 'Boosts aerobic fitness, strengthens heart muscle, and burns active calories.',
        precautions: 'Keep joints soft when landing. Brace core during mountain climbers and crunches.'
      };
    }
    if (n.includes('sprint') || n.includes('burpee') || n.includes('jump squat') || n.includes('tuck jump')) {
      return {
        description: 'High-intensity plyometric or interval exercises designed to maximize cardiorespiratory output.',
        benefits: 'Builds explosive leg power, burns calories long after the workout, and improves sprint capacity.',
        precautions: 'Land softly with knees slightly bent. Perform exercises with good form before increasing speed.'
      };
    }
    
    // Dumbbells & Barbells catch-alls
    if (n.includes('dumbbell') || n.includes('dumbell') || n.includes('db') || n.includes('curl') || n.includes('raise') || n.includes('press')) {
      return {
        description: 'Resistance exercises utilizing free-weights (dumbbells) to isolate specific muscle groups.',
        benefits: 'Corrects bilateral muscle strength imbalances, stimulates hypertrophy, and increases bone density.',
        precautions: 'Control the weights through both lifting and lowering phases. Do not swing your lower back for momentum.'
      };
    }
    if (n.includes('barbell') || n.includes('deadlift')) {
      return {
        description: 'Heavy compound barbell exercises activating multiple large muscle groups in the lumbar and lower limbs.',
        benefits: 'Builds posterior chain strength (spinal erectors, glutes, hamstrings), traps, and grip power.',
        precautions: 'Lock your core tight before lifting. Do not round your lower spine; pull back your shoulder blades.'
      };
    }
    
    return {
      description: 'Active lifestyle movements designed to engage muscles and support daily physical wellness goals.',
      benefits: 'Stimulates joint lubrication, boosts daily active calorie burn, and supports habit consistency.',
      precautions: 'Ensure you warm up properly before starting. Listen to your body and rest if you feel sudden sharp pain.'
    };
  },

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
                  <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.8rem;">
                    ${this.generatedWorkout.plan.map((ex, idx) => {
                      const mediaHTML = this.getExerciseMediaHTML(ex, 55);
                      return `
                        <li class="exercise-item-clickable" data-name="${ex}" style="display: flex; gap: 1rem; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.6rem; cursor: pointer; transition: background 0.2s; border-radius: 8px; padding: 0.4rem 0.6rem; margin-left: -0.6rem;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='none'">
                          <span style="font-size: 0.85rem; font-weight: 700; color: #10b981; border: 1px solid #10b981; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${idx+1}</span>
                          ${mediaHTML}
                          <span style="color: var(--text-main); font-weight: 500;">${ex}</span>
                        </li>
                      `;
                    }).join('')}
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
                    <div class="meal-item-clickable" data-category="Breakfast" data-desc="${this.generatedMeal.plan.Breakfast.replace(/"/g, '&quot;')}" data-img="/images/meals/breakfast.png" style="display: flex; gap: 1.2rem; align-items: center; padding-bottom: 0.8rem; border-bottom: 1px dashed var(--border-color); cursor: pointer; transition: background 0.2s; border-radius: 8px; padding: 0.4rem 0.6rem; margin-left: -0.6rem;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='none'">
                      <div style="width: 70px; height: 70px; border-radius: var(--border-radius-sm); overflow: hidden; border: 1px solid var(--border-color); flex-shrink: 0; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; position: relative;">
                        <img src="/images/meals/breakfast.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Breakfast">
                        <span style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(15, 23, 42, 0.75); color: #fff; font-size: 0.6rem; text-align: center; padding: 2px 0; font-weight: 600;">AI IMAGE</span>
                      </div>
                      <div style="flex: 1;">
                        <strong style="color: #3b82f6; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; margin-bottom: 0.2rem;"><i class="fa-solid fa-egg"></i> Breakfast</strong>
                        <p style="color: var(--text-main); font-size: 0.85rem; margin: 0;">${this.generatedMeal.plan.Breakfast}</p>
                      </div>
                    </div>

                    <div class="meal-item-clickable" data-category="Lunch" data-desc="${this.generatedMeal.plan.Lunch.replace(/"/g, '&quot;')}" data-img="/images/meals/lunch.png" style="display: flex; gap: 1.2rem; align-items: center; padding-bottom: 0.8rem; border-bottom: 1px dashed var(--border-color); cursor: pointer; transition: background 0.2s; border-radius: 8px; padding: 0.4rem 0.6rem; margin-left: -0.6rem;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='none'">
                      <div style="width: 70px; height: 70px; border-radius: var(--border-radius-sm); overflow: hidden; border: 1px solid var(--border-color); flex-shrink: 0; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; position: relative;">
                        <img src="/images/meals/lunch.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Lunch">
                        <span style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(15, 23, 42, 0.75); color: #fff; font-size: 0.6rem; text-align: center; padding: 2px 0; font-weight: 600;">AI IMAGE</span>
                      </div>
                      <div style="flex: 1;">
                        <strong style="color: #10b981; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; margin-bottom: 0.2rem;"><i class="fa-solid fa-bowl-rice"></i> Lunch</strong>
                        <p style="color: var(--text-main); font-size: 0.85rem; margin: 0;">${this.generatedMeal.plan.Lunch}</p>
                      </div>
                    </div>

                    <div class="meal-item-clickable" data-category="Dinner" data-desc="${this.generatedMeal.plan.Dinner.replace(/"/g, '&quot;')}" data-img="/images/meals/dinner.png" style="display: flex; gap: 1.2rem; align-items: center; padding-bottom: 0.8rem; border-bottom: 1px dashed var(--border-color); cursor: pointer; transition: background 0.2s; border-radius: 8px; padding: 0.4rem 0.6rem; margin-left: -0.6rem;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='none'">
                      <div style="width: 70px; height: 70px; border-radius: var(--border-radius-sm); overflow: hidden; border: 1px solid var(--border-color); flex-shrink: 0; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; position: relative;">
                        <img src="/images/meals/dinner.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Dinner">
                        <span style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(15, 23, 42, 0.75); color: #fff; font-size: 0.6rem; text-align: center; padding: 2px 0; font-weight: 600;">AI IMAGE</span>
                      </div>
                      <div style="flex: 1;">
                        <strong style="color: #8b5cf6; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; margin-bottom: 0.2rem;"><i class="fa-solid fa-plate-wheat"></i> Dinner</strong>
                        <p style="color: var(--text-main); font-size: 0.85rem; margin: 0;">${this.generatedMeal.plan.Dinner}</p>
                      </div>
                    </div>

                    <div class="meal-item-clickable" data-category="Snacks & Fluids" data-desc="${this.generatedMeal.plan.Snack.replace(/"/g, '&quot;')}" data-img="/images/meals/snack.png" style="display: flex; gap: 1.2rem; align-items: center; padding-bottom: 0.4rem; cursor: pointer; transition: background 0.2s; border-radius: 8px; padding: 0.4rem 0.6rem; margin-left: -0.6rem;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='none'">
                      <div style="width: 70px; height: 70px; border-radius: var(--border-radius-sm); overflow: hidden; border: 1px solid var(--border-color); flex-shrink: 0; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; position: relative;">
                        <img src="/images/meals/snack.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Snacks">
                        <span style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(15, 23, 42, 0.75); color: #fff; font-size: 0.6rem; text-align: center; padding: 2px 0; font-weight: 600;">AI IMAGE</span>
                      </div>
                      <div style="flex: 1;">
                        <strong style="color: #f59e0b; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; margin-bottom: 0.2rem;"><i class="fa-solid fa-cookie"></i> Snacks & Fluids</strong>
                        <p style="color: var(--text-main); font-size: 0.85rem; margin: 0;">${this.generatedMeal.plan.Snack}</p>
                      </div>
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

        <!-- Image Lightbox Modal Overlay -->
        <div id="exercise-lightbox-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(8px); z-index: 99999; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
          <div class="glass-card" style="position: relative; max-width: 500px; width: 90%; display: flex; flex-direction: column; gap: 1.2rem; padding: 2rem; border-radius: var(--border-radius-lg); text-align: center; box-shadow: var(--shadow-glow); border: 1px solid rgba(255,255,255,0.1);">
            <button id="lightbox-close-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; transition: color 0.2s;"><i class="fa-solid fa-xmark"></i></button>
            <h3 id="lightbox-exercise-name" style="font-size: 1.3rem; font-family: var(--font-heading); color: #10b981; margin: 0 1.5rem;">Exercise Name</h3>
            <div id="lightbox-exercise-media" style="width: 100%; display: flex; align-items: center; justify-content: center; min-height: 250px;"></div>
            
            <div style="text-align: left; font-size: 0.85rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.6rem; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.2rem;">
              <div><strong style="color: var(--text-main);"><i class="fa-solid fa-circle-info" style="color: #3b82f6; margin-right: 0.3rem;"></i> Description:</strong> <span id="lightbox-desc" style="display: block; margin-top: 0.15rem; color: var(--text-muted);">...</span></div>
              <div><strong style="color: var(--text-main);"><i class="fa-solid fa-circle-check" style="color: #10b981; margin-right: 0.3rem;"></i> Benefits:</strong> <span id="lightbox-benefits" style="display: block; margin-top: 0.15rem; color: var(--text-muted);">...</span></div>
              <div><strong style="color: var(--text-main);"><i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b; margin-right: 0.3rem;"></i> Precautions:</strong> <span id="lightbox-precautions" style="display: block; margin-top: 0.15rem; color: var(--text-muted);">...</span></div>
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
        window.router.handleRoute();
      });
    }
    if (tabMeal) {
      tabMeal.addEventListener('click', () => {
        this.activePlanner = 'meal';
        this.generatedWorkout = null;
        this.generatedMeal = null;
        this.generatedHabit = null;
        window.router.handleRoute();
      });
    }
    if (tabGoals) {
      tabGoals.addEventListener('click', () => {
        this.activePlanner = 'goals';
        this.generatedWorkout = null;
        this.generatedMeal = null;
        this.generatedHabit = null;
        window.router.handleRoute();
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
          window.router.handleRoute(); // Redraws and renders output
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
          window.router.handleRoute(); // Redraws
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
          window.router.handleRoute(); // Redraws
        }, 800);
      });
    }

    // 5. Connect exercise item click handlers using event delegation to trigger lightbox Modal
    const modal = document.getElementById('exercise-lightbox-modal');
    const modalName = document.getElementById('lightbox-exercise-name');
    const modalMedia = document.getElementById('lightbox-exercise-media');
    const modalDesc = document.getElementById('lightbox-desc');
    const modalBenefits = document.getElementById('lightbox-benefits');
    const modalPrecautions = document.getElementById('lightbox-precautions');
    const closeBtn = document.getElementById('lightbox-close-btn');

    document.addEventListener('click', (e) => {
      // 1. Check for exercise item click
      const exItem = e.target.closest('.exercise-item-clickable');
      if (exItem) {
        const name = exItem.getAttribute('data-name');

        if (modal && modalName && modalMedia && modalDesc && modalBenefits && modalPrecautions) {
          modalName.innerText = name;
          modalMedia.innerHTML = this.getExerciseMediaHTML(name, 250);

          const details = this.getExerciseDetails(name);
          modalDesc.innerText = details.description;
          modalBenefits.innerText = details.benefits;
          
          // Show precautions block for exercises
          const precautionsParent = modalPrecautions.parentElement;
          if (precautionsParent) precautionsParent.style.display = 'block';
          modalPrecautions.innerText = details.precautions;

          modal.style.display = 'flex';
          setTimeout(() => {
            modal.style.opacity = '1';
          }, 10);
        }
        return;
      }

      // 2. Check for meal item click
      const mealItem = e.target.closest('.meal-item-clickable');
      if (mealItem) {
        const category = mealItem.getAttribute('data-category');
        const desc = mealItem.getAttribute('data-desc');
        const img = mealItem.getAttribute('data-img');

        if (modal && modalName && modalMedia && modalDesc && modalBenefits && modalPrecautions) {
          modalName.innerText = `${category} Diet Details`;
          modalMedia.innerHTML = `<img src="${img}" style="max-width: 100%; max-height: 250px; border-radius: var(--border-radius-md); border: 1px solid var(--border-color); object-fit: cover;" alt="${category}">`;

          const details = this.getMealDetails(category, desc, this.generatedMeal?.pref || 'Omnivore');
          modalDesc.innerText = details.description;
          modalBenefits.innerText = details.benefits;
          
          // Hide precautions block for meals
          const precautionsParent = modalPrecautions.parentElement;
          if (precautionsParent) precautionsParent.style.display = 'none';

          modal.style.display = 'flex';
          setTimeout(() => {
            modal.style.opacity = '1';
          }, 10);
        }
        return;
      }
    });

    const hideModal = () => {
      if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      }
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', hideModal);
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          hideModal();
        }
      });
    }
  }
};

export default PlannerView;
