// Web Speech API Voice-to-Text Habit Logger
import { Toast } from '../components/Toast.js';

export const VoiceLogger = {
  recognition: null,
  isRecording: false,

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API is not supported in this browser.');
      return false;
    }
    
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    return true;
  },

  start(onResult, onError) {
    if (this.isRecording) return;
    
    if (!this.recognition) {
      const supported = this.init();
      if (!supported) {
        onError('Voice commands are not supported in your browser. Please try Chrome/Edge.');
        return;
      }
    }

    try {
      this.recognition.start();
      this.isRecording = true;
      Toast.info('Voice log activated. Speak clearly...');
    } catch (e) {
      console.error(e);
      onError(e.message);
    }

    this.recognition.onresult = (event) => {
      this.isRecording = false;
      const transcript = event.results[0][0].transcript;
      const parsedData = this.parseTranscript(transcript);
      onResult({ transcript, parsedData });
    };

    this.recognition.onerror = (event) => {
      this.isRecording = false;
      console.error('Speech error:', event.error);
      onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isRecording = false;
    };
  },

  stop() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
  },

  // Parses spoken strings for key numeric indicators
  parseTranscript(text) {
    const textLower = text.toLowerCase();
    const data = {};

    // 1. Water Intake
    // Matches "X glasses of water", "drank X glasses", "X cups of water", "water X glasses"
    const waterRegex = /(\d+)\s*(?:glasses|glass|cups|cup|water)/i;
    const waterMatch = textLower.match(waterRegex);
    if (waterMatch) {
      data.water = parseInt(waterMatch[1]);
    }

    // 2. Sleep Hours
    // Matches "slept X hours", "sleep X hours", "X hours of sleep"
    const sleepRegex = /(?:slept|sleep)\s*(\d+(?:\.\d+)?)\s*hours?/i;
    const sleepMatch = textLower.match(sleepRegex);
    if (sleepMatch) {
      data.sleepDuration = parseFloat(sleepMatch[1]);
    }

    // 3. Steps
    // Matches "walked X steps", "X steps"
    const stepsRegex = /(\d+)\s*(?:steps|step)/i;
    const stepsMatch = textLower.match(stepsRegex);
    if (stepsMatch) {
      data.steps = parseInt(stepsMatch[1]);
    }

    // 4. Calories
    // Matches "burned X calories", "X calories", "X cal"
    const caloriesRegex = /(\d+)\s*(?:calories|calorie|cal|kcal)/i;
    const caloriesMatch = textLower.match(caloriesRegex);
    if (caloriesMatch) {
      data.calories = parseInt(caloriesMatch[1]);
    }

    // 5. Meditation duration
    // Matches "meditated X minutes", "X minutes of meditation"
    const medRegex = /(\d+)\s*(?:minutes of meditation|minute of meditation|meditated|meditation)/i;
    const medMatch = textLower.match(medRegex);
    if (medMatch) {
      data.meditation = parseInt(medMatch[1]);
    }

    return data;
  }
};

export default VoiceLogger;
