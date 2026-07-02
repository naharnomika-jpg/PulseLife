// AI Coach Chat page view
import { store } from '../store.js';
import { AIEngine } from '../utils/ai.js';
import { Toast } from '../components/Toast.js';

export const ChatView = {
  chatHistory: [
    { sender: 'bot', text: 'Hello! I am your PulseLife AI Wellness Coach. 🤖<br><br>Before we start, please tell me your <strong>age, height, weight, and daily routine</strong>. This helps me customize health suggestions for you!' }
  ],

  render() {
    const userObj = store.state.users[store.state.currentUser];
    const name = userObj.name.split(' ')[0];

    return `
      <div style="display: flex; flex-direction: column; gap: 1.5rem; height: 100%;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="font-size: 1.8rem; font-family: var(--font-heading);"><i class="fa-solid fa-robot" style="color: #3b82f6;"></i> AI Coach Chat</h1>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Ask questions about sleep hygiene, workouts, diet planners, or habits trends.</p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-clear-chat">
            <i class="fa-solid fa-trash-can"></i> Clear History
          </button>
        </div>

        <!-- Chat Panel Layout -->
        <div class="chat-container">
          <!-- Coach Info Header -->
          <div class="chat-header">
            <div class="avatar" style="background: var(--primary-gradient);"><i class="fa-solid fa-robot"></i></div>
            <div>
              <strong style="font-size: 0.95rem; display: block; color: var(--text-main);">PulseLife Coach</strong>
              <span style="font-size: 0.75rem; color: #10b981; display: flex; align-items: center; gap: 0.3rem;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span> Active Intelligence
              </span>
            </div>
          </div>

          <!-- Chat Bubbles Stream -->
          <div class="chat-body" id="chat-stream-body">
            ${this.chatHistory.map(msg => `
              <div class="chat-bubble ${msg.sender}">
                ${msg.text}
              </div>
            `).join('')}
            
            <!-- Typing Indicator -->
            <div class="chat-bubble bot" id="chat-typing-bubble" style="display: none; padding: 0.6rem 1rem;">
              <span style="display: inline-flex; gap: 0.2rem; align-items: center;">
                <i class="fa-solid fa-circle" style="font-size: 0.4rem; animation: pulse 1s infinite alternate;"></i>
                <i class="fa-solid fa-circle" style="font-size: 0.4rem; animation: pulse 1s infinite alternate 0.2s;"></i>
                <i class="fa-solid fa-circle" style="font-size: 0.4rem; animation: pulse 1s infinite alternate 0.4s;"></i>
              </span>
            </div>
          </div>

          <!-- Quick Suggestion Action Chips -->
          <div style="padding: 0.8rem 1.5rem; display: flex; gap: 0.6rem; flex-wrap: wrap; background-color: var(--bg-app); border-top: 1px solid var(--border-color);">
            <button class="btn btn-secondary btn-sm chat-chip-btn">How can I sleep better?</button>
            <button class="btn btn-secondary btn-sm chat-chip-btn">Suggest a healthy breakfast.</button>
            <button class="btn btn-secondary btn-sm chat-chip-btn">Create my workout plan.</button>
            <button class="btn btn-secondary btn-sm chat-chip-btn">How can I reduce stress?</button>
            <button class="btn btn-secondary btn-sm chat-chip-btn">Analyze my habits.</button>
          </div>

          <!-- Input Controls -->
          <form class="chat-input-area" id="chat-input-form">
            <input type="text" id="chat-input-field" class="form-control" placeholder="Type your health or lifestyle query here..." required autocomplete="off">
            <button type="submit" class="btn btn-primary" style="padding: 0 1.5rem;">
              <i class="fa-solid fa-paper-plane"></i> Send
            </button>
          </form>
        </div>

      </div>
    `;
  },

  init() {
    const stream = document.getElementById('chat-stream-body');
    const inputForm = document.getElementById('chat-input-form');
    const inputField = document.getElementById('chat-input-field');
    const typing = document.getElementById('chat-typing-bubble');
    const clearBtn = document.getElementById('btn-clear-chat');

    // Auto scroll chat to bottom
    stream.scrollTop = stream.scrollHeight;

    // Send Message Handler
    const sendMessage = async (text) => {
      // 1. Add user bubble
      this.chatHistory.push({ sender: 'user', text });
      
      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.innerText = text;
      
      stream.insertBefore(userBubble, typing);
      stream.scrollTop = stream.scrollHeight;

      // 2. Show typing indicator
      typing.style.display = 'block';
      stream.scrollTop = stream.scrollHeight;

      // 3. Resolve AI Response using async API
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const latestLog = store.getLogForDate(todayStr) || store.getEmptyLogTemplate();
        const userObj = store.state.users[store.state.currentUser];

        const botReply = await AIEngine.chatResponseAsync(text, latestLog, userObj.details);
        
        typing.style.display = 'none';
        this.chatHistory.push({ sender: 'bot', text: botReply });

        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot';
        botBubble.innerHTML = botReply;

        stream.insertBefore(botBubble, typing);
        stream.scrollTop = stream.scrollHeight;
      } catch (err) {
        typing.style.display = 'none';
        console.error(err);
      }
    };

    if (inputForm) {
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = inputField.value.trim();
        if (!text) return;
        inputField.value = '';
        sendMessage(text);
      });
    }

    // Connect Quick suggestions Chips
    document.querySelectorAll('.chat-chip-btn').forEach((chip) => {
      chip.addEventListener('click', () => {
        sendMessage(chip.innerText);
      });
    });

    // Connect Clear Chat Button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.chatHistory = [
          { sender: 'bot', text: 'Hello! I am your PulseLife AI Wellness Coach. 🤖<br><br>Before we start, please tell me your <strong>age, height, weight, and daily routine</strong>. This helps me customize health suggestions for you!' }
        ];
        Toast.success('Conversation history cleared.');
        // Re-render chat view
        document.getElementById('app').innerHTML = document.getElementById('app').innerHTML; // quick redraw
        // trigger router reload to re-run init binds
        setTimeout(() => window.location.reload(), 100);
      });
    }
  }
};

export default ChatView;
