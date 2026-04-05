// ============================================
// MODERN GITHUB PORTFOLIO - JAVASCRIPT
// ============================================

/**
 * DOM Elements
 */
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const themeToggle = document.getElementById("themeToggle");
const contactForm = document.getElementById("contactForm");
const toast = document.getElementById("toast");

/**
 * Initialize App
 */
document.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
    initializeNavigation();
    initializeFormValidation();
    loadUserPreferences();
});

// ============================================
// THEME MANAGEMENT
// ============================================

/**
 * Initialize theme based on user preference
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
        document.body.classList.toggle("dark-mode", savedTheme === "dark");
        updateThemeButton(savedTheme === "dark");
    } else if (prefersDark) {
        document.body.classList.add("dark-mode");
        updateThemeButton(true);
    }

    themeToggle.addEventListener("click", toggleTheme);
}

/**
 * Toggle between light and dark mode
 */
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    const theme = isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
    updateThemeButton(isDarkMode);
    showToast(`Switched to ${theme} mode`, "success");
}

/**
 * Update theme button appearance
 */
function updateThemeButton(isDark) {
    themeToggle.textContent = isDark ? "☀️" : "🌙";
}

// ============================================
// NAVIGATION MANAGEMENT
// ============================================

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute("data-section");
            switchSection(sectionId);
            closeMobileSidebar();
        });
    });

    hamburger.addEventListener("click", toggleMobileSidebar);

    // Close sidebar when clicking outside
    document.addEventListener("click", (e) => {
        if (
            !sidebar.contains(e.target) &&
            !hamburger.contains(e.target) &&
            sidebar.classList.contains("open")
        ) {
            closeMobileSidebar();
        }
    });
}

/**
 * Switch active section
 * @param {string} sectionId - ID of section to display
 */
function switchSection(sectionId) {
    // Remove active class from all sections and links
    sections.forEach((section) => section.classList.remove("active"));
    navLinks.forEach((link) => link.classList.remove("active"));

    // Add active class to selected section and link
    const section = document.getElementById(sectionId);
    const link = document.querySelector(`[data-section="${sectionId}"]`);

    if (section) {
        section.classList.add("active");
        link.classList.add("active");

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Save last visited section
        localStorage.setItem("lastSection", sectionId);
    }
}

/**
 * Toggle mobile sidebar
 */
function toggleMobileSidebar() {
    sidebar.classList.toggle("open");
    hamburger.classList.toggle("active");
}

/**
 * Close mobile sidebar
 */
function closeMobileSidebar() {
    sidebar.classList.remove("open");
    hamburger.classList.remove("active");
}

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    if (!contactForm) return;

    contactForm.addEventListener("submit", handleFormSubmit);

    // Real-time validation
    contactForm
        .querySelectorAll("input, textarea")
        .forEach((field) => {
            field.addEventListener("blur", () => validateField(field));
            field.addEventListener("input", () => {
                if (field.classList.contains("error")) {
                    validateField(field);
                }
            });
        });
}

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    const fields = contactForm.querySelectorAll("input, textarea");

    fields.forEach((field) => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showToast("Please fix the errors above", "error");
        return;
    }

    // Collect form data
    const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        message: document.getElementById("message").value.trim(),
    };

    // Submit form (in real app, send to server)
    submitForm(formData);
}

/**
 * Validate individual field
 * @param {HTMLElement} field - Input or textarea element
 * @returns {boolean} - Field validity
 */
function validateField(field) {
    const errorElement = document.getElementById(field.id + "Error");
    let error = "";

    // Check if empty
    if (field.value.trim() === "") {
        error = `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required`;
    }
    // Validate email
    else if (field.type === "email" && !isValidEmail(field.value)) {
        error = "Please enter a valid email address";
    }
    // Validate name (at least 2 characters)
    else if (
        field.id === "name" &&
        field.value.trim().length < 2
    ) {
        error = "Name must be at least 2 characters";
    }
    // Validate message (at least 10 characters)
    else if (
        field.id === "message" &&
        field.value.trim().length < 10
    ) {
        error = "Message must be at least 10 characters";
    }

    // Display error
    if (error) {
        field.classList.add("error");
        if (errorElement) {
            errorElement.textContent = error;
        }
        return false;
    } else {
        field.classList.remove("error");
        if (errorElement) {
            errorElement.textContent = "";
        }
        return true;
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Email validity
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Submit form (mock API call)
 * @param {Object} formData - Form data to submit
 */
function submitForm(formData) {
    // Show loading state
    const submitBtn = contactForm.querySelector(".submit-button");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // In real app: send to server via fetch/axios
        console.log("Form submitted:", formData);

        // Reset form
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Show success message
        showToast(
            "Message sent successfully! I'll get back to you soon.",
            "success"
        );

        // Clear error messages
        contactForm
            .querySelectorAll(".error-message")
            .forEach((el) => (el.textContent = ""));
        contactForm
            .querySelectorAll("input, textarea")
            .forEach((el) => el.classList.remove("error"));
    }, 1500);
}

// ============================================
// NOTIFICATIONS
// ============================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = "info", duration = 3000) {
    // Set toast content and style
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    // Remove custom color classes and add type
    toast.style.backgroundColor =
        type === "success"
            ? "#1a7f37"
            : type === "error"
              ? "#da3633"
              : "#0969da";

    // Auto-hide after duration
    setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}

// ============================================
// USER PREFERENCES
// ============================================

/**
 * Load user preferences (last visited section)
 */
function loadUserPreferences() {
    const lastSection = localStorage.getItem("lastSection") || "home";
    switchSection(lastSection);
}

/**
 * Save user preference
 * @param {string} key - Preference key
 * @param {any} value - Preference value
 */
function savePreference(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Get user preference
 * @param {string} key - Preference key
 * @returns {any} - Preference value or null
 */
function getPreference(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Smooth scroll to element
 * @param {HTMLElement} element - Element to scroll to
 */
function smoothScrollTo(element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Add animation to element on scroll
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.animation = "fadeIn 0.5s ease-in";
        }
    });
}, observerOptions);

// Observe all cards
document.addEventListener("DOMContentLoaded", () => {
    document
        .querySelectorAll(".tool-card, .earn-card, .video-card, .update-item")
        .forEach((card) => observer.observe(card));
});

// ============================================
// EVENT LISTENERS FOR ENHANCEMENTS
// ============================================

/**
 * Handle window resize for responsive behavior
 */
window.addEventListener(
    "resize",
    debounce(() => {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    }, 250)
);

/**
 * Handle keyboard shortcuts
 */
document.addEventListener("keydown", (e) => {
    // Escape key - close mobile sidebar
    if (e.key === "Escape" && sidebar.classList.contains("open")) {
        closeMobileSidebar();
    }

    // Ctrl/Cmd + K - Focus search (for future implementation)
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        // Implement search functionality
    }
});

/**
 * Log app info in console
 */
console.log(
    "%cGitHub Portfolio v1.0",
    "color: #0969da; font-size: 16px; font-weight: bold;"
);
console.log(
    "Built with HTML5, CSS3, and Vanilla JavaScript ES6+"
);