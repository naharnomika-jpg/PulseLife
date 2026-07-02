// Toast notification popups manager

export const Toast = {
  getContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  },

  show(message, type = 'info', duration = 4000) {
    const container = this.getContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose appropriate icon
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'warning') icon = 'fa-triangle-exclamation';
    if (type === 'danger') icon = 'fa-circle-xmark';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <div style="flex: 1; word-break: break-word;">${message}</div>
      <i class="fa-solid fa-xmark" style="cursor: pointer; opacity: 0.6; font-size: 0.8rem; margin-left: 0.5rem;" id="toast-close"></i>
    `;

    container.appendChild(toast);

    // Auto-remove after duration
    const removeTimeout = setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s reverse forwards';
      toast.addEventListener('animationend', () => toast.remove());
    }, duration);

    // Click close button handler
    toast.querySelector('#toast-close').addEventListener('click', () => {
      clearTimeout(removeTimeout);
      toast.remove();
    });
  },

  success(message) { this.show(message, 'success'); },
  warning(message) { this.show(message, 'warning'); },
  danger(message) { this.show(message, 'danger'); },
  info(message) { this.show(message, 'info'); }
};

export default Toast;
