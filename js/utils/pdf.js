// PDF Report Generation Utility using jsPDF CDN
import { store } from '../store.js';
import { AIEngine } from './ai.js';

export const PDFReporter = {
  generate(userObj, dateStr, logsList) {
    const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!jsPDFClass) {
      throw new Error('jsPDF is not loaded. Please verify internet connection and CDN status.');
    }

    const doc = new jsPDFClass({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const gamification = store.state.gamification[userObj.email] || { points: 0, streak: 0, level: 1, badges: [] };
    const latestLog = logsList[dateStr] || store.getEmptyLogTemplate();
    const aiAnalysis = AIEngine.generateInsights(latestLog, userObj.details);

    // Styling configurations
    const primaryColor = [37, 99, 235]; // Royal Blue
    const accentColor = [16, 185, 129]; // Emerald Green
    const darkTextColor = [30, 41, 59]; // Slate 800
    const lightTextColor = [100, 116, 139]; // Slate 500
    
    // Page 1: Header & Health Scores
    // ----------------------------------------------------
    
    // Draw background header panel
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 210, 45, 'F');

    // App Logo & Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('PulseLife AI Wellness Report', 15, 20);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // Cool gray
    doc.text(`Generated: ${new Date().toLocaleString()} | Account: ${userObj.email}`, 15, 30);
    doc.text(`System Level: ${gamification.level} | Total Points: ${gamification.points} pts`, 15, 36);

    // Profile Details Card
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 52, 180, 25, 2, 2, 'FD');
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('USER PROFILE SUMMARY', 20, 58);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...darkTextColor);
    doc.text(`Name: ${userObj.name}`, 20, 64);
    doc.text(`Age: ${userObj.details.age} yrs`, 20, 70);
    doc.text(`Occupation: ${userObj.details.occupation}`, 80, 64);
    doc.text(`Gender: ${userObj.details.gender}`, 80, 70);
    doc.text(`Height: ${userObj.details.height} cm`, 140, 64);
    doc.text(`Weight: ${userObj.details.weight} kg`, 140, 70);

    // Lifestyle Scores Circle/Box Panel
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('LIFESTYLE METRIC ANALYSIS', 15, 92);
    
    // Horizontal rule
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 95, 195, 95);

    // Render metrics boxes
    const metrics = [
      { label: 'Overall Lifestyle', val: `${aiAnalysis.scores.lifestyle}/100`, desc: 'Weighted Wellness' },
      { label: 'Sleep Hygiene', val: `${aiAnalysis.scores.sleep}/100`, desc: 'Duration & Depth' },
      { label: 'Activity Index', val: `${aiAnalysis.scores.wellness}/100`, desc: 'Exercise & Water' },
      { label: 'Productivity Index', val: `${aiAnalysis.scores.productivity}/100`, desc: 'Work Hours & Focus' }
    ];

    let startX = 15;
    metrics.forEach((m, idx) => {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(startX, 100, 42, 28, 2, 2, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...lightTextColor);
      doc.text(m.label.toUpperCase(), startX + 3, 106);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(...primaryColor);
      doc.text(m.val, startX + 3, 116);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...darkTextColor);
      doc.text(m.desc, startX + 3, 124);

      startX += 46;
    });

    // AI Coach Insights Section
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('AI COACH DIRECTIVES & IDEAL ROUTINES', 15, 142);
    doc.line(15, 145, 195, 145);

    let startY = 152;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkTextColor);

    if (aiAnalysis.insights.length === 0) {
      doc.text('No critical insights compiled yet. Log more parameters to unlock AI directives.', 20, startY);
      startY += 10;
    } else {
      aiAnalysis.insights.slice(0, 4).forEach((insight) => {
        // Bullet point
        doc.setFillColor(...primaryColor);
        doc.circle(18, startY - 1.5, 1, 'F');
        
        doc.setFont('Helvetica', 'bold');
        doc.text(`${insight.category}: `, 22, startY);
        
        doc.setFont('Helvetica', 'normal');
        // Wrap text to fit page width
        const lines = doc.splitTextToSize(insight.text, 120);
        doc.text(lines, 60, startY);
        startY += (lines.length * 5) + 2;
      });
    }

    // Pattern Alerts Warning Box
    if (aiAnalysis.alerts.length > 0) {
      doc.setFillColor(254, 242, 242); // soft red
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(15, startY + 2, 180, 22, 2, 2, 'FD');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(185, 28, 28);
      doc.text('UNHEALTHY RISK PATTERN ALERTS', 20, startY + 8);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      const alertLine = doc.splitTextToSize(aiAnalysis.alerts.join(' | '), 170);
      doc.text(alertLine, 20, startY + 14);
    } else {
      doc.setFillColor(240, 253, 250); // soft emerald
      doc.setDrawColor(204, 251, 241);
      doc.roundedRect(15, startY + 2, 180, 15, 2, 2, 'FD');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 118, 110);
      doc.text('HEALTH AND METRIC ALERT STABILITY', 20, startY + 8);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('All lifestyle biomarkers currently registered within optimal safety ranges.', 20, startY + 12);
    }

    // Footer
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...lightTextColor);
    doc.text('PulseLife AI is a wellness assistant. If you experience medical distress, consult a certified physician.', 15, 282);
    doc.text('Page 1 of 2', 185, 282);

    // Page 2: Weekly Log history Table
    // ----------------------------------------------------
    doc.addPage();
    
    // Draw background header panel
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('PulseLife Habit History & Charts', 15, 16);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('HISTORICAL DAILY HABIT SHEETS (LAST 7 LOGS)', 15, 40);
    doc.line(15, 43, 195, 43);

    // Create a historical table manually
    const tableHeaderY = 50;
    doc.setFillColor(241, 245, 249);
    doc.rect(15, tableHeaderY, 180, 8, 'F');
    doc.setTextColor(...darkTextColor);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    
    doc.text('DATE', 18, tableHeaderY + 5.5);
    doc.text('SLEEP', 48, tableHeaderY + 5.5);
    doc.text('WATER', 75, tableHeaderY + 5.5);
    doc.text('EXERCISE', 105, tableHeaderY + 5.5);
    doc.text('CALORIES', 135, tableHeaderY + 5.5);
    doc.text('FOCUS', 165, tableHeaderY + 5.5);

    let rowY = tableHeaderY + 8;
    const sortedDates = Object.keys(logsList).sort((a,b) => new Date(b) - new Date(a)).slice(0, 7);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);

    if (sortedDates.length === 0) {
      doc.text('No history logs populated. Please fill logs in the logs panel first.', 20, rowY + 6);
    } else {
      sortedDates.forEach((d) => {
        const item = logsList[d];
        
        // Alternating row background colors
        doc.setFillColor(rowY % 2 === 0 ? 255 : 248, rowY % 2 === 0 ? 255 : 250, rowY % 2 === 0 ? 255 : 252);
        doc.rect(15, rowY, 180, 8, 'F');
        
        doc.setTextColor(...darkTextColor);
        doc.text(d, 18, rowY + 5.5);
        
        const slDuration = AIEngine.calculateSleepDuration(item.sleep?.sleepTime, item.sleep?.wakeTime);
        doc.text(`${slDuration}h (Qual: ${item.sleep?.quality || 5}/10)`, 48, rowY + 5.5);
        doc.text(`${item.water?.amount || 0}/${item.water?.goal || 8} gls`, 75, rowY + 5.5);
        doc.text(`${item.exercise?.duration || 0}m (${item.exercise?.type || 'None'})`, 105, rowY + 5.5);
        doc.text(`${item.exercise?.calories || 0} kcal`, 135, rowY + 5.5);
        doc.text(`${item.productivity?.focus || 5}/10`, 165, rowY + 5.5);

        rowY += 8;
      });
    }

    // Achievements section
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('UNLOCKED SYSTEM BADGES', 15, rowY + 15);
    doc.line(15, rowY + 18, 195, rowY + 18);

    let badgeY = rowY + 26;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    
    const badgeNames = {
      hydro_king: '👑 HYDRO KING - Drank enough water to hit active goals.',
      early_bird: '🌅 EARLY BIRD - Woke up before 7:00 AM to unlock early momentum.',
      streak_beginner: '🔥 STREAK BEGINNER - Logged daily lifestyle habits 3 days in a row.',
      streak_master: '⚡ STREAK MASTER - Maintained a perfect 7-day log streak.',
      focus_master: '🎯 FOCUS MASTER - Achieved a perfect 9+/10 daily focus rating.',
      mindful_monk: '🧘 MINDFUL MONK - Meditated for 15+ minutes in a single day.',
      healthy_eater: '🥗 HEALTHY EATER - Avoided junk snacks and logged fresh green inputs.',
      workout_warrior: '🏋️ WORKOUT WARRIOR - Burned over 400 calories in exercises.'
    };

    if (gamification.badges.length === 0) {
      doc.text('No badges unlocked yet. Keep logging healthy habits to unlock achievements!', 20, badgeY);
    } else {
      gamification.badges.forEach((b) => {
        const text = badgeNames[b] || b.toUpperCase();
        doc.setTextColor(...accentColor);
        doc.text('✓', 18, badgeY);
        doc.setTextColor(...darkTextColor);
        doc.text(text, 23, badgeY);
        badgeY += 6;
      });
    }

    // PDF Security Notice
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 230, 180, 25, 2, 2, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryColor);
    doc.text('GDPR PRIVACY & LOCAL ENCRYPTION STATEMENTS', 20, 236);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...lightTextColor);
    doc.text('All personal data is encrypted client-side and saved exclusively in your local sandbox browser database.', 20, 242);
    doc.text('PulseLife does not transmit your records to external health-aggregators without explicit credentials approval.', 20, 247);

    // Page 2 Footer
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...lightTextColor);
    doc.text('PulseLife AI is a wellness assistant. If you experience medical distress, consult a certified physician.', 15, 282);
    doc.text('Page 2 of 2', 185, 282);

    // Trigger save
    doc.save(`PulseLife_Report_${dateStr}.pdf`);
  }
};

export default PDFReporter;
