// Translation Dictionary and Localizer for PulseLife
import { store } from '../store.js';

const translations = {
  en: {
    // General / Landing
    landingTitle: 'Elevate Your Health, Maximize Productivity',
    landingSub: 'PulseLife tracks your daily lifestyle habits, uses intelligent local analytics, and yields direct wellness actions to help you thrive.',
    getStarted: 'Get Started Today',
    login: 'Login',
    register: 'Register',
    email: 'Email Address',
    password: 'Password',
    name: 'Full Name',
    age: 'Age',
    gender: 'Gender',
    height: 'Height (cm)',
    weight: 'Weight (kg)',
    occupation: 'Occupation',
    forgotPassword: 'Forgot Password?',
    resetBtn: 'Send Reset Link',
    backToLogin: 'Back to Login',
    googleSignIn: 'Sign in with Google',
    dontHaveAccount: 'Don\'t have an account?',
    alreadyHaveAccount: 'Already have an account?',
    
    // Dashboard
    dashboardTitle: 'Your Daily Health Summary',
    lifestyleScore: 'Lifestyle Score',
    todayGoals: 'Today\'s Challenges & Goals',
    aiCoachInsights: 'AI Coach Insights',
    wellnessScore: 'Wellness Score',
    productivityScore: 'Productivity Score',
    habitRate: 'Habit Completion Rate',
    weeklyProgress: 'Weekly Progress',
    monthlyImprovement: 'Monthly Trend',
    alertsTitle: 'Pattern & Safety Alerts',
    noAlerts: 'Excellent! No unhealthy lifestyle patterns detected today.',

    // Logs Section
    logDailyHabits: 'Daily Lifestyle Log',
    logSubtitle: 'Save your metrics to receive personalized health tips & level rewards.',
    voiceLogging: 'Voice-Input Log',
    speechPlaceholder: 'Click mic & speak (e.g. "I slept 8 hours and drank 5 glasses of water")',
    fitbitSync: 'Sync Fitbit Wearable',
    fitbitSuccess: 'Successfully fetched wearable data! Sleep: 7.5 hrs, Steps: 9240, Calories: 450.',
    submitLogs: 'Save Daily Logs',

    // Analytics
    analyticsTitle: 'Analytics & Trends Dashboard',
    chartSleep: 'Sleep Quality & Hours',
    chartWater: 'Water Intake (glasses)',
    chartCalories: 'Calories Burned vs Steps',
    chartMood: 'Mood & Stress Levels',
    chartProductivity: 'Productivity vs Work Screen Time',
    habitConsistencyCalendar: 'Habit Consistency Calendar',

    // Planners
    plannerTitle: 'AI Planners & Goal Sheets',
    workoutPlanner: 'Workout Plan Generator',
    mealPlanner: 'Meal Plan Creator',
    goalPlanner: 'Habit Planner & Milestones',
    generateWorkout: 'Generate AI Workout',
    generateMeal: 'Generate AI Meal Plan',
    generateGoals: 'Generate AI Habit Plan',
    
    // Settings
    profileSettings: 'Profile Settings',
    saveProfile: 'Save Changes',
    selectLanguage: 'System Language',
    darkMode: 'Dark Mode',
    bodyMassIndex: 'Body Mass Index (BMI)'
  },
  es: {
    // General / Landing
    landingTitle: 'Eleva tu Salud, Maximiza tu Productividad',
    landingSub: 'PulseLife rastrea tus hábitos diarios, analiza tus métricas y te brinda recomendaciones inteligentes de bienestar.',
    getStarted: 'Comienza Hoy',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    name: 'Nombre Completo',
    age: 'Edad',
    gender: 'Género',
    height: 'Altura (cm)',
    weight: 'Peso (kg)',
    occupation: 'Ocupación',
    forgotPassword: '¿Olvidó su contraseña?',
    resetBtn: 'Enviar Enlace de Restablecimiento',
    backToLogin: 'Volver a Iniciar Sesión',
    googleSignIn: 'Iniciar sesión con Google',
    dontHaveAccount: '¿No tienes una cuenta?',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',

    // Dashboard
    dashboardTitle: 'Resumen de Salud Diario',
    lifestyleScore: 'Puntuación de Estilo',
    todayGoals: 'Desafíos y Metas de Hoy',
    aiCoachInsights: 'Consejos del Coach de IA',
    wellnessScore: 'Puntuación de Bienestar',
    productivityScore: 'Productividad',
    habitRate: 'Hábitos Completados',
    weeklyProgress: 'Progreso Semanal',
    monthlyImprovement: 'Tendencia Mensual',
    alertsTitle: 'Alertas de Patrones',
    noAlerts: '¡Excelente! No se detectaron patrones de estilo de vida poco saludables hoy.',

    // Logs Section
    logDailyHabits: 'Registro de Hábitos Diarios',
    logSubtitle: 'Guarda tus datos para recibir consejos de salud y puntos de nivel.',
    voiceLogging: 'Registro de Voz',
    speechPlaceholder: 'Presiona el mic y habla (ej. "Dormí 8 horas y tomé 5 vasos de agua")',
    fitbitSync: 'Sincronizar Fitbit Wearable',
    fitbitSuccess: '¡Datos sincronizados! Sueño: 7.5 hrs, Pasos: 9240, Calorías: 450.',
    submitLogs: 'Guardar Registro',

    // Analytics
    analyticsTitle: 'Estadísticas e Historial de Hábitos',
    chartSleep: 'Calidad de Sueño y Horas',
    chartWater: 'Consumo de Agua (vasos)',
    chartCalories: 'Calorías Quemadas vs Pasos',
    chartMood: 'Niveles de Estado de Ánimo y Estrés',
    chartProductivity: 'Productivity vs Pantalla de Trabajo',
    habitConsistencyCalendar: 'Calendario de Consistencia de Hábitos',

    // Planners
    plannerTitle: 'Planificadores de IA y Metas',
    workoutPlanner: 'Generador de Entrenamiento de IA',
    mealPlanner: 'Planificador de Comidas de IA',
    goalPlanner: 'Planificador de Metas de IA',
    generateWorkout: 'Generar Entrenamiento',
    generateMeal: 'Generar Plan de Comidas',
    generateGoals: 'Generar Metas de Hábitos',

    // Settings
    profileSettings: 'Configuración del Perfil',
    saveProfile: 'Guardar Cambios',
    selectLanguage: 'Idioma del Sistema',
    darkMode: 'Modo Oscuro',
    bodyMassIndex: 'Índice de Masa Corporal (IMC)'
  },
  fr: {
    // General / Landing
    landingTitle: 'Améliorez Votre Santé, Maximisez Votre Productivité',
    landingSub: 'PulseLife suit vos habitudes quotidiennes, analyse vos données et fournit des recommandations bien-être personnalisées.',
    getStarted: 'Commencer Aujourd\'hui',
    login: 'Se Connecter',
    register: 'S\'inscrire',
    email: 'Adresse E-mail',
    password: 'Mot de Passe',
    name: 'Nom Complet',
    age: 'Âge',
    gender: 'Genre',
    height: 'Taille (cm)',
    weight: 'Poids (kg)',
    occupation: 'Profession',
    forgotPassword: 'Mot de passe oublié ?',
    resetBtn: 'Envoyer le lien de réinitialisation',
    backToLogin: 'Retour à la Connexion',
    googleSignIn: 'Se connecter avec Google',
    dontHaveAccount: 'Pas encore de compte ?',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',

    // Dashboard
    dashboardTitle: 'Votre Résumé Santé Quotidien',
    lifestyleScore: 'Score de Vie',
    todayGoals: 'Défis et Objectifs du Jour',
    aiCoachInsights: 'Conseils du Coach IA',
    wellnessScore: 'Score Bien-être',
    productivityScore: 'Productivité',
    habitRate: 'Complétion des Habitudes',
    weeklyProgress: 'Progrès Hebdomadaire',
    monthlyImprovement: 'Tendance Mensuelle',
    alertsTitle: 'Alertes et Comportements',
    noAlerts: 'Excellent ! Aucun comportement malsain détecté aujourd\'hui.',

    // Logs Section
    logDailyHabits: 'Journal de Vie Quotidien',
    logSubtitle: 'Enregistrez vos données pour obtenir des conseils IA et des points.',
    voiceLogging: 'Journalisation Vocale',
    speechPlaceholder: 'Cliquez sur le micro et parlez (ex. "J\'ai dormi 8 heures et bu 5 verres d\'eau")',
    fitbitSync: 'Synchroniser Fitbit Wearable',
    fitbitSuccess: 'Données wearable importées ! Sommeil : 7.5h, Pas : 9240, Calories : 450.',
    submitLogs: 'Enregistrer le Journal',

    // Analytics
    analyticsTitle: 'Tableau des Tendances & Historiques',
    chartSleep: 'Heures et Qualité du Sommeil',
    chartWater: 'Eau consommée (verres)',
    chartCalories: 'Calories brûlées vs Pas',
    chartMood: 'Niveaux d\'Humeur et de Stress',
    chartProductivity: 'Productivité vs Écran de Travail',
    habitConsistencyCalendar: 'Calendrier de Régularité',

    // Planners
    plannerTitle: 'Planificateurs IA et Objectifs',
    workoutPlanner: 'Générateur d\'Entraînement IA',
    mealPlanner: 'Planificateur de Repas IA',
    goalPlanner: 'Planificateur d\'Habitudes & Objectifs',
    generateWorkout: 'Générer Entraînement',
    generateMeal: 'Générer Plan de Repas',
    generateGoals: 'Générer Objectifs d\'Habitudes',

    // Settings
    profileSettings: 'Paramètres du Profil',
    saveProfile: 'Enregistrer les Modifications',
    selectLanguage: 'Langue du Système',
    darkMode: 'Mode Sombre',
    bodyMassIndex: 'Indice de Masse Corporelle (IMC)'
  },
  hi: {
    // General / Landing
    landingTitle: 'स्वास्थ्य को बेहतर बनाएं, उत्पादकता को अधिकतम करें',
    landingSub: 'पल्सलाइफ आपके दैनिक जीवन शैली की आदतों को ट्रैक करता है, स्थानीय विश्लेषण का उपयोग करता है, और कल्याण के लिए सीधे सुझाव देता है।',
    getStarted: 'आज ही शुरू करें',
    login: 'लॉगिन',
    register: 'रजिस्टर करें',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    name: 'पूरा नाम',
    age: 'उम्र',
    gender: 'लिंग',
    height: 'ऊंचाई (सेमी)',
    weight: 'वजन (किग्रा)',
    forgotPassword: 'पासवर्ड भूल गए?',
    resetBtn: 'रीसेट लिंक भेजें',
    backToLogin: 'लॉगिन पर वापस जाएं',
    googleSignIn: 'गूगल के साथ साइन इन करें',
    dontHaveAccount: 'खाता नहीं है?',
    alreadyHaveAccount: 'पहले से ही खाता है?',
    
    // Dashboard
    dashboardTitle: 'दैनिक स्वास्थ्य सारांश',
    lifestyleScore: 'जीवनशैली स्कोर',
    todayGoals: 'आज की चुनौतियां और लक्ष्य',
    aiCoachInsights: 'एआई कोच अंतर्दृष्टि',
    wellnessScore: 'कल्याण स्कोर',
    productivityScore: 'उत्पादकता स्कोर',
    habitRate: 'आदत पूर्णता दर',
    weeklyProgress: 'साप्ताहिक प्रगति',
    monthlyImprovement: 'मासिक रुझान',
    alertsTitle: 'पैटर्न और सुरक्षा अलर्ट',
    noAlerts: 'उत्कृष्ट! आज कोई अस्वस्थ जीवनशैली पैटर्न नहीं पाया गया।',

    // Logs Section
    logDailyHabits: 'दैनिक जीवनशैली लॉग',
    logSubtitle: 'व्यक्तिगत स्वास्थ्य सुझाव और स्तर पुरस्कार प्राप्त करने के लिए अपनी मेट्रिक्स सहेजें।',
    voiceLogging: 'आवाज-इनपुट लॉग',
    speechPlaceholder: 'माइक पर क्लिक करें और बोलें (उदा. "मैंने 8 घंटे नींद ली और 5 गिलास पानी पिया")',
    fitbitSync: 'सिंक करें फिटबिट वियरेबल',
    fitbitSuccess: 'वियरेबल डेटा सफलतापूर्वक प्राप्त हुआ! नींद: 7.5 घंटे, कदम: 9240, कैलोरी: 450।',
    submitLogs: 'दैनिक लॉग सहेजें',

    // Analytics
    analyticsTitle: 'विश्लेषण और रुझान डैशबोर्ड',
    chartSleep: 'नींद की गुणवत्ता और घंटे',
    chartWater: 'पानी का सेवन (गिलास)',
    chartCalories: 'बर्न कैलोरी बनाम कदम',
    chartMood: 'मनोदशा और तनाव का स्तर',
    chartProductivity: 'उत्पादकता बनाम कार्य स्क्रीन समय',
    habitConsistencyCalendar: 'आदत निरंतरता कैलेंडर',

    // Planners
    plannerTitle: 'एआई योजनाकार और लक्ष्य पत्रक',
    workoutPlanner: 'वर्कआउट योजना निर्माता',
    mealPlanner: 'भोजन योजना निर्माता',
    goalPlanner: 'आदत योजनाकार और मील के पत्थर',
    generateWorkout: 'एआई वर्कआउट बनाएं',
    generateMeal: 'एआई भोजन योजना बनाएं',
    generateGoals: 'एआई आदत योजना बनाएं',
    
    // Settings
    profileSettings: 'प्रोफ़ाइल सेटिंग्स',
    saveProfile: 'परिवर्तन सहेजें',
    selectLanguage: 'सिस्टम भाषा',
    darkMode: 'डार्क मोड',
    bodyMassIndex: 'बॉडी मास इंडेक्स (BMI)'
  }
};

export const i18n = {
  t(key) {
    const lang = store.state.settings.lang || 'en';
    return (translations[lang] && translations[lang][key]) || translations['en'][key] || key;
  }
};

export default i18n;
