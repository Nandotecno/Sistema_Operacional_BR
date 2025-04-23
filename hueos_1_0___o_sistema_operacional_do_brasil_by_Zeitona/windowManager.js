import { Draggable } from 'draggable';

export class WindowManager {
    constructor() {
        this.windows = document.getElementById('windows');
        this.taskbar = document.getElementById('taskbar');
        this.activeWindows = new Map(); // windowId -> windowElement
        this.highestZIndex = 100;
        this.draggable = null;
        this.initializeDraggable();
    }

    initializeDraggable() {
        // Initialize Draggable for the windows container
        this.draggable = new Draggable(document.querySelectorAll('.window'), {
            handle: '.window-header',
            draggable: '.window:not(.maximized)',
            delay: 0,
            distance: 0
        });

        // Handle drag start/end to manage focus
        this.draggable.on('drag:start', (evt) => {
            const window = evt.source;
            if (window.classList.contains('maximized')) {
                evt.cancel();
            } else {
                this.focusWindow(window);
            }
        });
    }

    createWindow(appName, title, content) {
        const windowId = `window-${Date.now()}`;
        const window = document.createElement('div');
        window.className = 'window';
        window.id = windowId;
        window.style.top = `${Math.random() * 100 + 50}px`;
        window.style.left = `${Math.random() * 300 + 50}px`;
        window.style.zIndex = ++this.highestZIndex;

        const header = document.createElement('div');
        header.className = 'window-header';
        header.innerHTML = `
            <div class="window-controls">
                <span class="window-title">${title}</span>
                <div class="window-buttons">
                    <button class="minimize-button">─</button>
                    <button class="maximize-button">□</button>
                    <button class="close-button">×</button>
                </div>
            </div>
        `;

        const windowContent = document.createElement('div');
        windowContent.className = 'window-content';
        windowContent.innerHTML = content;

        window.appendChild(header);
        window.appendChild(windowContent);
        this.windows.appendChild(window);

        // Add taskbar entry
        this.addTaskbarEntry(windowId, title, appName);

        // Initialize window controls
        this.initializeWindowControls(window, windowId);

        // Add to active windows
        this.activeWindows.set(windowId, window);
        
        // Focus the new window
        this.focusWindow(window);

        // Reinitialize draggable with new window
        this.draggable.destroy();
        this.draggable = new Draggable(document.querySelectorAll('.window'), {
            handle: '.window-header',
            draggable: '.window:not(.maximized)',
            delay: 0,
            distance: 0
        });

        return window;
    }

    addTaskbarEntry(windowId, title, appName) {
        const taskbarEntry = document.createElement('div');
        taskbarEntry.className = 'taskbar-entry active';
        taskbarEntry.dataset.windowId = windowId;
        taskbarEntry.innerHTML = `
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M21,16V4H3V16H21M21,2A2,2 0 0,1 23,4V16A2,2 0 0,1 21,18H14V20H16V22H8V20H10V18H3C1.89,18 1,17.1 1,16V4C1,2.89 1.89,2 3,2H21Z'/%3E%3C/svg%3E" alt="${appName}">
            <span>${title}</span>
        `;
        
        taskbarEntry.addEventListener('click', () => this.toggleWindow(windowId));
        this.taskbar.appendChild(taskbarEntry);
    }

    toggleWindow(windowId) {
        const window = this.activeWindows.get(windowId);
        if (!window) return;
        
        if (window.classList.contains('minimized')) {
            window.classList.remove('minimized');
            this.focusWindow(window);
        } else {
            window.classList.add('minimized');
        }
        this.updateTaskbarEntries();
    }

    focusWindow(window) {
        if (!window) return;
        
        const windows = document.querySelectorAll('.window');
        windows.forEach(w => w.classList.remove('focused'));
        window.classList.add('focused');
        window.style.zIndex = ++this.highestZIndex;
        this.updateTaskbarEntries();
    }

    initializeWindowControls(window, windowId) {
        const closeBtn = window.querySelector('.close-button');
        const minimizeBtn = window.querySelector('.minimize-button');
        const maximizeBtn = window.querySelector('.maximize-button');

        closeBtn.addEventListener('click', () => {
            window.remove();
            this.activeWindows.delete(windowId);
            const taskbarEntry = document.querySelector(`.taskbar-entry[data-window-id="${windowId}"]`);
            if (taskbarEntry) taskbarEntry.remove();
            // Reinitialize draggable after removing window
            this.draggable.destroy();
            this.draggable = new Draggable(document.querySelectorAll('.window'), {
                handle: '.window-header',
                draggable: '.window:not(.maximized)',
                delay: 0,
                distance: 0
            });
        });

        minimizeBtn.addEventListener('click', () => {
            this.toggleWindow(windowId);
        });

        maximizeBtn.addEventListener('click', () => {
            window.classList.toggle('maximized');
            if (window.classList.contains('maximized')) {
                window.dataset.restoreTop = window.style.top;
                window.dataset.restoreLeft = window.style.left;
                window.style.top = '0';
                window.style.left = '0';
            } else {
                window.style.top = window.dataset.restoreTop;
                window.style.left = window.dataset.restoreLeft;
            }
        });

        window.addEventListener('mousedown', () => this.focusWindow(window));
    }

    updateTaskbarEntries() {
        document.querySelectorAll('.taskbar-entry').forEach(entry => {
            const windowId = entry.dataset.windowId;
            const window = this.activeWindows.get(windowId);
            if (window) {
                entry.classList.toggle('active', !window.classList.contains('minimized'));
            }
        });
    }
}