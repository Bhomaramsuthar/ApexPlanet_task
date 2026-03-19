/**
 * Components Module
 * Handles HTML generation for UI elements securely
 */

class UIComponents {
    static createTaskElement(task) {
        // Check if task is overdue (dueDate is before today's date)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Parse the due date (comes in as YYYY-MM-DD from the input[type="date"])
        // We add T00:00:00 to avoid timezone offset issues taking us to the previous day
        const taskDate = new Date(task.dueDate + 'T00:00:00');
        const isOverdue = taskDate < today && !task.completed;

        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
        }).format(taskDate);

        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        div.dataset.id = task.id;

        // Use innerHTML but properly escape user inputs
        div.innerHTML = `
            <div class="task-checkbox-wrapper">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task as complete">
            </div>
            <div class="task-content">
                <h3 class="task-title">${this.escapeHTML(task.title)}</h3>
                ${task.description ? `<p class="task-desc">${this.escapeHTML(task.description)}</p>` : ''}
                <div class="task-meta">
                    <span class="meta-tag priority-${task.priority}">
                        <i class="ph ph-flag"></i>
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <span class="meta-tag task-date ${isOverdue ? 'overdue' : ''}">
                        <i class="ph ph-calendar-blank"></i>
                        ${formattedDate}
                    </span>
                    <span class="meta-tag">
                        <span class="color-dot ${task.project}"></span>
                        ${task.project.charAt(0).toUpperCase() + task.project.slice(1)}
                    </span>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn btn-edit" aria-label="Edit task">
                    <i class="ph ph-pencil-simple"></i>
                </button>
                <button class="action-btn btn-delete" aria-label="Delete task">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
        `;

        return div;
    }

    static createToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? 'ph-check-circle' : 'ph-warning-circle';

        toast.innerHTML = `
            <i class="ph ${icon}"></i>
            <span>${this.escapeHTML(message)}</span>
        `;

        return toast;
    }

    // Security helper to prevent XSS attacks when rendering user inputs
    static escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}
