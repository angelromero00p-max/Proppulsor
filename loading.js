// Function to create and append loader HTML if not present
function initLoader() {
    if (!document.getElementById('loading-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(overlay);
    }
}

// Function to show loader and navigate
function navigateWithLoader(url) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => {
            window.location.href = url;
        }, 2000); // 2 seconds delay
    } else {
        // Fallback if loader initialization failed
        window.location.href = url;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initLoader);