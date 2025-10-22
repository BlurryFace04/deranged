// Keyboard Controls for Deranged Marriage Game

let currentFocusIndex = 0;
const focusableElements = [];

// Update focusable elements
function updateFocusableElements() {
    focusableElements.length = 0;
    const elements = document.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), .game-mode-card');
    focusableElements.push(...Array.from(elements).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0; // Only visible elements
    }));
}

// Focus next element
function focusNext() {
    updateFocusableElements();
    if (focusableElements.length === 0) return;
    
    currentFocusIndex = (currentFocusIndex + 1) % focusableElements.length;
    focusableElements[currentFocusIndex].focus();
}

// Focus previous element
function focusPrevious() {
    updateFocusableElements();
    if (focusableElements.length === 0) return;
    
    currentFocusIndex = (currentFocusIndex - 1 + focusableElements.length) % focusableElements.length;
    focusableElements[currentFocusIndex].focus();
}

// Keyboard event handler
document.addEventListener('keydown', (e) => {
    // Prevent shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        // Allow arrow keys in inputs
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            return;
        }
        // Allow Tab, Escape, Enter
        if (!['Tab', 'Escape', 'Enter'].includes(e.key)) {
            return;
        }
    }

    switch(e.key.toLowerCase()) {
        // Navigation - Arrow Keys
        case 'arrowdown':
        case 's':
            e.preventDefault();
            focusNext();
            break;
            
        case 'arrowup':
        case 'w':
            e.preventDefault();
            focusPrevious();
            break;
            
        case 'arrowright':
        case 'd':
            e.preventDefault();
            focusNext();
            break;
            
        case 'arrowleft':
        case 'a':
            e.preventDefault();
            focusPrevious();
            break;

        // Action Keys
        case 'r':
            e.preventDefault();
            const randomBtn = document.getElementById('randomize-btn');
            if (randomBtn && !randomBtn.disabled && !randomBtn.classList.contains('hidden')) {
                randomBtn.click();
            }
            break;

        case 'enter':
            e.preventDefault();
            const matchBtn = document.getElementById('match-btn');
            if (matchBtn && !matchBtn.disabled && !matchBtn.classList.contains('hidden')) {
                matchBtn.click();
            }
            break;

        case 'escape':
            e.preventDefault();
            // Go back to menu
            if (!document.getElementById('main-menu').classList.contains('hidden')) {
                return;
            }
            backToMenu();
            break;

        // Quick Actions
        case 'l':
            e.preventDefault();
            if (!document.getElementById('main-menu').classList.contains('hidden')) {
                showLeaderboard();
            }
            break;

        case 'h':
            e.preventDefault();
            if (!document.getElementById('main-menu').classList.contains('hidden')) {
                showAchievements();
            }
            break;

        // Game Mode Selection
        case '1':
            e.preventDefault();
            if (!document.getElementById('main-menu').classList.contains('hidden')) {
                startMode('classic');
            }
            break;

        case '2':
            e.preventDefault();
            if (!document.getElementById('main-menu').classList.contains('hidden')) {
                startMode('quickplay');
            }
            break;

        case '3':
            e.preventDefault();
            if (!document.getElementById('main-menu').classList.contains('hidden')) {
                startMode('challenge');
            }
            break;
    }
});

// Update focusable elements when DOM changes
const observer = new MutationObserver(() => {
    updateFocusableElements();
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'disabled']
});

// Initial update
document.addEventListener('DOMContentLoaded', () => {
    updateFocusableElements();
});

console.log('⌨️ Keyboard controls enabled! Press keys to navigate.');

