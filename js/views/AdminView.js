// Administrative dashboard page view
import { store } from '../store.js';
import { Toast } from '../components/Toast.js';

export const AdminView = {
  render() {
    const users = Object.values(store.state.users);
    const feedback = store.state.feedback;
    
    // Count logs across all users
    let totalLogsCount = 0;
    Object.values(store.state.logs).forEach(userLogs => {
      totalLogsCount += Object.keys(userLogs).length;
    });

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div>
          <h1 style="font-size: 1.8rem; font-family: var(--font-heading); color: #10b981;">
            <i class="fa-solid fa-shield-halved"></i> Administrative Dashboard
          </h1>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Monitor system activities, user accounts registrations, feedback logs, and mock AI compute token loads.</p>
        </div>

        <!-- Metric rows -->
        <div class="grid-cols-4">
          <div class="glass-card">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Registered Accounts</span>
            <h3 style="font-size: 1.8rem; margin: 0.4rem 0; font-family: var(--font-heading); color: #3b82f6;">${users.length} Users</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Active sandbox profiles</span>
          </div>

          <div class="glass-card">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Habit Logs Registered</span>
            <h3 style="font-size: 1.8rem; margin: 0.4rem 0; font-family: var(--font-heading); color: #10b981;">${totalLogsCount} Logs</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Stored client-side files</span>
          </div>

          <div class="glass-card">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Feedback Submissions</span>
            <h3 style="font-size: 1.8rem; margin: 0.4rem 0; font-family: var(--font-heading); color: #8b5cf6;">${feedback.length} messages</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">User complaints & suggestions</span>
          </div>

          <div class="glass-card">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">AI Compute Load</span>
            <h3 style="font-size: 1.8rem; margin: 0.4rem 0; font-family: var(--font-heading); color: #f59e0b;">184,520 tokens</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">156 coach queries executed</span>
          </div>
        </div>

        <!-- Users Management Table -->
        <div class="glass-card">
          <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
            <i class="fa-solid fa-users-gear" style="color: #3b82f6;"></i> Account Management Console
          </h3>

          <div style="overflow-x: auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL ADDRESS</th>
                  <th>ROLE</th>
                  <th>AGE</th>
                  <th>METRICS (HEIGHT/WEIGHT)</th>
                  <th>OCCUPATION</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                ${users.map((u) => `
                  <tr id="admin-user-row-${u.email.replace(/[@.]/g, '-')}">
                    <td><strong>${u.name}</strong></td>
                    <td>${u.email}</td>
                    <td>
                      <span style="background: ${u.role === 'admin' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)'}; 
                                   color: ${u.role === 'admin' ? '#10b981' : '#3b82f6'}; 
                                   padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">
                        ${u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>${u.details.age} yrs</td>
                    <td>${u.details.height}cm / ${u.details.weight}kg</td>
                    <td>${u.details.occupation}</td>
                    <td>
                      ${u.email !== 'admin@pulselife.com' ? `
                        <button class="btn btn-danger btn-sm btn-delete-user" data-email="${u.email}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                          <i class="fa-solid fa-trash-can"></i> Delete
                        </button>
                      ` : '<span style="font-size:0.8rem; color:var(--text-muted);">Root Account</span>'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Feedback Messages Reviews -->
        <div class="glass-card">
          <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
            <i class="fa-solid fa-comments" style="color: #8b5cf6;"></i> System Feedback Inbox
          </h3>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${feedback.length === 0 ? `
              <p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; padding: 2rem 0;">No system feedback submitted yet.</p>
            ` : feedback.map((f) => `
              <div class="glass-card" style="padding: 1rem; background: rgba(255,255,255,0.01);">
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                  <span>Sender: <strong>${f.email}</strong></span>
                  <span>Date: ${f.date}</span>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-main); line-height: 1.4;">
                  "${f.message}"
                </p>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  },

  init() {
    // Delete User Event listeners
    document.querySelectorAll('.btn-delete-user').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const email = btn.getAttribute('data-email');
        if (confirm(`Are you absolutely sure you want to delete account profile: ${email}?`)) {
          
          // Delete from state
          delete store.state.users[email];
          delete store.state.logs[email];
          delete store.state.gamification[email];
          store.saveState();
          
          Toast.success(`Successfully deleted user account: ${email}`);
          
          // Redraw admin view
          window.router.handleRoute();
        }
      });
    });
  }
};

export default AdminView;
