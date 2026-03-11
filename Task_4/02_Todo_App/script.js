document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const countSpan = document.getElementById('count');
    const clearBtn = document.getElementById('clear-btn');
    const dateDisplay = document.getElementById('date-display');

    // Set Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);

    // Load tasks from LocalStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();

    // Event Listeners
    addBtn.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    clearBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    });

    function addTask() {
        const text = todoInput.value.trim();
        if (text === '') return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        todoInput.value = '';
    }

    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        todoList.innerHTML = '';
        let activeCount = 0;

        tasks.forEach(task => {
            if (!task.completed) activeCount++;

            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <div class="todo-content" onclick="window.toggleTask(${task.id})">
                    <div class="check-circle">
                        ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                    <span class="task-text">${escapeHtml(task.text)}</span>
                </div>
                <button class="delete-btn" onclick="window.deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            todoList.appendChild(li);
        });

        countSpan.textContent = activeCount;
    }

    // Expose functions to window for onclick handlers in HTML string
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) { return map[m]; });
    }
});
