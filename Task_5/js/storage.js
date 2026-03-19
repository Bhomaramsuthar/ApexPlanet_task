/**
 * Storage Module
 * Handles local storage CRUD operations for tasks
 */

const STORAGE_KEY = 'taskminder_tasks';
const THEME_KEY = 'taskminder_theme';

class StorageManager {
    static getTasks() {
        try {
            const tasks = localStorage.getItem(STORAGE_KEY);
            return tasks ? JSON.parse(tasks) : [];
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return [];
        }
    }

    static saveTasks(tasks) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
    }

    static addTask(task) {
        const tasks = this.getTasks();
        // Generate unique ID
        task.id = 'task_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        task.createdAt = new Date().toISOString();
        task.completed = false;
        
        tasks.push(task);
        this.saveTasks(tasks);
        return task;
    }

    static updateTask(id, updates) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            this.saveTasks(tasks);
            return tasks[index];
        }
        return null;
    }

    static deleteTask(id) {
        let tasks = this.getTasks();
        tasks = tasks.filter(t => t.id !== id);
        this.saveTasks(tasks);
    }

    static toggleTaskStatus(id) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index].completed = !tasks[index].completed;
            this.saveTasks(tasks);
            return tasks[index];
        }
        return null;
    }

    // Theme saving
    static getTheme() {
        return localStorage.getItem(THEME_KEY) || 'dark'; // Default dark theme
    }

    static saveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }

    // Mock initial data generation
    static seedMockDataIfEmpty() {
        if (this.getTasks().length === 0) {
            const mockTasks = [
                {
                    id: 'seed_1',
                    title: 'Complete Dashboard UI',
                    description: 'Finish the capstone project layout and ensure all responsive requirements are met.',
                    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
                    priority: 'high',
                    project: 'work',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'seed_2',
                    title: 'Optimize Performance',
                    description: 'Run Lighthouse audits and minify CSS/JS bundles for optimal performance score exceeding 95.',
                    dueDate: new Date().toISOString().split('T')[0], // Today
                    priority: 'medium',
                    project: 'work',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'seed_3',
                    title: 'Grocery Shopping',
                    description: 'Buy vegetables, almond milk, and free-range eggs.',
                    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
                    priority: 'low',
                    project: 'personal',
                    completed: false,
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveTasks(mockTasks);
        }
    }
}
