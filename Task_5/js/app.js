/**
 * Main Application Logic
 * Orchestrates State, UI Components, and Event Listeners
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State
    StorageManager.seedMockDataIfEmpty();
    let currentFilter = 'all'; // 'all', 'pending', 'completed', 'project:name'
    let currentSort = 'newest';
    let searchQuery = '';

    // 2. DOM Elements Cache
    const elements = {
        themeToggle: document.getElementById('themeToggle'),
        body: document.body,

        // Sidebar & Mobile Menu
        sidebar: document.getElementById('sidebar'),
        openSidebarBtn: document.getElementById('openSidebar'),
        closeSidebarBtn: document.getElementById('closeSidebar'),
        navItems: document.querySelectorAll('.nav-item'),
        projectList: document.getElementById('projectList'),

        // Header info
        greetingTitle: document.getElementById('greetingTitle'),
        headerPendingCount: document.getElementById('headerPendingCount'),
        currentDate: document.getElementById('currentDate'),
        searchInput: document.getElementById('searchInput'),

        // Stats
        statTotal: document.getElementById('statTotal'),
        statCompleted: document.getElementById('statCompleted'),
        statOverdue: document.getElementById('statOverdue'),
        pendingCountBadge: document.getElementById('pendingCount'),

        // Task List
        taskList: document.getElementById('taskList'),
        sortTasks: document.getElementById('sortTasks'),

        // Modal & Form
        btnNewTask: document.getElementById('btnNewTask'),
        taskModal: document.getElementById('taskModal'),
        closeModal: document.getElementById('closeModal'),
        btnCancelModal: document.getElementById('btnCancelModal'),
        taskForm: document.getElementById('taskForm'),
        modalTitle: document.getElementById('modalTitle'),

        // Form Inputs
        taskId: document.getElementById('taskId'),
        taskTitle: document.getElementById('taskTitle'),
        taskDesc: document.getElementById('taskDesc'),
        taskDate: document.getElementById('taskDate'),
        taskPriority: document.getElementById('taskPriority'),
        taskProject: document.getElementById('taskProject'),

        // Toast
        toastContainer: document.getElementById('toastContainer')
    };

    // 3. Initialization
    initTheme();
    updateDateAndGreeting();
    renderApp();

    // 4. Event Listeners

    // Theme
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Mobile Sidebar
    elements.openSidebarBtn.addEventListener('click', () => elements.sidebar.classList.add('open'));
    elements.closeSidebarBtn.addEventListener('click', () => elements.sidebar.classList.remove('open'));

    // Navigation filtering
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active from all
            elements.navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            if (item.classList.contains('project')) {
                currentFilter = `project:${item.dataset.project}`;
            } else {
                currentFilter = item.dataset.filter;
            }

            if (window.innerWidth <= 768) {
                elements.sidebar.classList.remove('open');
            }

            renderApp();
        });
    });

    // Search & Sort
    elements.searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderApp();
    });

    elements.sortTasks.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderApp();
    });

    // Modal Actions
    const openModal = (editTask = null) => {
        elements.taskModal.classList.remove('hidden');
        resetFormErrors();

        if (editTask) {
            elements.modalTitle.textContent = 'Edit Task';
            elements.taskId.value = editTask.id;
            elements.taskTitle.value = editTask.title;
            elements.taskDesc.value = editTask.description || '';
            elements.taskDate.value = editTask.dueDate;
            elements.taskPriority.value = editTask.priority;
            elements.taskProject.value = editTask.project;
        } else {
            elements.modalTitle.textContent = 'Create New Task';
            elements.taskForm.reset();
            elements.taskId.value = '';
            // Default date to today
            elements.taskDate.value = new Date().toISOString().split('T')[0];
        }

        setTimeout(() => elements.taskTitle.focus(), 100);
    };

    const closeModal = () => {
        elements.taskModal.classList.add('hidden');
    };

    elements.btnNewTask.addEventListener('click', () => openModal());
    elements.closeModal.addEventListener('click', closeModal);
    elements.btnCancelModal.addEventListener('click', closeModal);

    // Close modal on outside click
    elements.taskModal.addEventListener('click', (e) => {
        if (e.target === elements.taskModal) closeModal();
    });

    // Form Submission
    elements.taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const taskData = {
            title: elements.taskTitle.value.trim(),
            description: elements.taskDesc.value.trim(),
            dueDate: elements.taskDate.value,
            priority: elements.taskPriority.value,
            project: elements.taskProject.value
        };

        const id = elements.taskId.value;

        if (id) {
            StorageManager.updateTask(id, taskData);
            showToast('Task updated successfully');
        } else {
            StorageManager.addTask(taskData);
            showToast('Task created successfully');
        }

        closeModal();
        renderApp();
    });

    // Task List Interactions (Event Delegation)
    elements.taskList.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const taskId = taskItem.dataset.id;

        // Toggle Status
        if (e.target.closest('.task-checkbox-wrapper')) {
            if (e.target.tagName !== 'INPUT') return;
            const updatedTask = StorageManager.toggleTaskStatus(taskId);
            renderApp();
            showToast(updatedTask.completed ? 'Task completed!' : 'Task reopened');
            return;
        }

        // Delete Task
        if (e.target.closest('.btn-delete')) {
            if (confirm('Are you sure you want to delete this task?')) {
                StorageManager.deleteTask(taskId);
                renderApp();
                showToast('Task deleted');
            }
            return;
        }

        // Edit Task
        if (e.target.closest('.btn-edit')) {
            const tasks = StorageManager.getTasks();
            const task = tasks.find(t => t.id === taskId);
            if (task) openModal(task);
            return;
        }

        // Empty state button
        if (e.target.id === 'btnEmptyStateNew') {
            openModal();
        }
    });

    // 5. Core Functions

    function initTheme() {
        const savedTheme = StorageManager.getTheme();
        elements.body.className = `${savedTheme}-theme`;
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const isDark = elements.body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light' : 'dark';

        elements.body.className = `${newTheme}-theme`;
        StorageManager.saveTheme(newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const icon = elements.themeToggle.querySelector('i');
        const text = elements.themeToggle.querySelector('span');

        if (theme === 'dark') {
            icon.className = 'ph ph-sun';
            text.textContent = 'Light Mode';
        } else {
            icon.className = 'ph ph-moon';
            text.textContent = 'Dark Mode';
        }
    }

    function updateDateAndGreeting() {
        const now = new Date();
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        elements.currentDate.textContent = new Intl.DateTimeFormat('en-US', options).format(now);

        const hour = now.getHours();
        let greeting = 'Good evening!';
        if (hour < 12) greeting = 'Good morning!';
        else if (hour < 17) greeting = 'Good afternoon!';

        elements.greetingTitle.textContent = greeting;
    }

    function validateForm() {
        let isValid = true;
        resetFormErrors();

        if (!elements.taskTitle.value.trim()) {
            elements.taskTitle.closest('.form-group').classList.add('error');
            isValid = false;
        }

        if (!elements.taskDate.value) {
            elements.taskDate.closest('.form-group').classList.add('error');
            isValid = false;
        }

        return isValid;
    }

    function resetFormErrors() {
        document.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
        });
    }

    function showToast(message, type = 'success') {
        const toast = UIComponents.createToast(message, type);
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    function renderApp() {
        const allTasks = StorageManager.getTasks();

        // 1. Calculate Stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let pendingCount = 0;
        let completedCount = 0;
        let overdueCount = 0;

        allTasks.forEach(task => {
            if (task.completed) {
                completedCount++;
            } else {
                pendingCount++;
                const taskDate = new Date(task.dueDate + 'T00:00:00');
                if (taskDate < today) overdueCount++;
            }
        });

        // Update DOM stats
        elements.statTotal.textContent = allTasks.length;
        elements.statCompleted.textContent = completedCount;
        elements.statOverdue.textContent = overdueCount;
        elements.headerPendingCount.innerHTML = `${pendingCount} task${pendingCount !== 1 ? 's' : ''}`;
        elements.pendingCountBadge.textContent = pendingCount;

        if (pendingCount === 0) {
            elements.pendingCountBadge.style.display = 'none';
        } else {
            elements.pendingCountBadge.style.display = 'inline-block';
        }

        // 2. Filter Tasks
        let filteredTasks = allTasks.filter(task => {
            // Text Search
            if (searchQuery && !task.title.toLowerCase().includes(searchQuery) &&
                !(task.description && task.description.toLowerCase().includes(searchQuery))) {
                return false;
            }

            // Sidebar Navigation Filter
            if (currentFilter === 'pending') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            if (currentFilter.startsWith('project:')) {
                const project = currentFilter.split(':')[1];
                return task.project === project;
            }

            return true; // 'all' filter
        });

        // 3. Sort Tasks
        filteredTasks.sort((a, b) => {
            if (currentSort === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (currentSort === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (currentSort === 'priority') {
                const priorityWeight = { high: 3, medium: 2, low: 1 };
                if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
                    return priorityWeight[b.priority] - priorityWeight[a.priority];
                }
                // Fallback to date sorting if same priority
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return 0;
        });

        // 4. Render to DOM
        elements.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            let emptyMsg = searchQuery ? 'Try adjusting your search query.' : 'Get started by creating a new task.';
            let actionBtn = !searchQuery ? `<button class="btn btn-outline" id="btnEmptyStateNew">Create Task</button>` : '';

            emptyState.innerHTML = `
                <i class="ph ph-clipboard-text"></i>
                <h3>No tasks found</h3>
                <p>${emptyMsg}</p>
                ${actionBtn}
            `;
            elements.taskList.appendChild(emptyState);
        } else {
            filteredTasks.forEach(task => {
                const taskElement = UIComponents.createTaskElement(task);
                elements.taskList.appendChild(taskElement);
            });
        }
    }
});
