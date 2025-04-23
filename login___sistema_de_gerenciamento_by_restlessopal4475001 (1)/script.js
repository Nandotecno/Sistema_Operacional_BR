import { checkLockout, recordFailedAttempt, resetAttempts } from 'lockout-utils';

// --- DOM Elements ---
const loginForm = document.getElementById('login-form');
const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const cancelButton = document.getElementById('cancel-button');
const blockPopup = document.getElementById('block-popup');
const closePopupButton = document.getElementById('close-popup-button');

// --- Configuration ---
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_HOURS = 2;
const LOCKOUT_DURATION_MS = LOCKOUT_DURATION_HOURS * 60 * 60 * 1000;

// --- Simulated User Data (Replace with actual backend validation) ---
const MOCKED_USERS = {
    'user@example.com': 'password123',
    'admin@example.com': 'adminpass',
    '12345678900': 'cpfpass', // Example CPF
    'test@test.com': 'password', // Example from registration
    '11122233344': 'password',   // Example CPF from registration
    '30430670885': 'Benicio@123' // Added test user
};

// --- Event Listeners ---

loginForm.addEventListener('submit', handleLoginAttempt);
cancelButton.addEventListener('click', handleCancel);
closePopupButton.addEventListener('click', hideBlockPopup);

// --- Initialization ---

// Check if user is currently locked out on page load
if (checkLockout(LOCKOUT_DURATION_MS)) {
    showBlockPopup();
    // Optionally disable form elements
    loginInput.disabled = true;
    passwordInput.disabled = true;
    loginForm.querySelector('button[type="submit"]').disabled = true;
}

// --- Functions ---

function handleLoginAttempt(event) {
    event.preventDefault(); // Prevent default form submission
    errorMessage.textContent = ''; // Clear previous errors

    const loginValue = loginInput.value.trim();
    const passwordValue = passwordInput.value;

    // Basic validation
    if (!loginValue || !passwordValue) {
        errorMessage.textContent = 'Por favor, preencha ambos os campos.';
        return;
    }

    // Check if locked out before proceeding
    if (checkLockout(LOCKOUT_DURATION_MS)) {
        showBlockPopup();
        return; // Don't process login if locked out
    }

    // --- Simulated Backend Check ---
    if (MOCKED_USERS[loginValue] && MOCKED_USERS[loginValue] === passwordValue) {
        // Successful Login
        resetAttempts(); // Reset attempts on success
        // Store successful login identifier (optional, for display on next page)
        localStorage.setItem('loggedInUserIdentifier', loginValue);
        window.location.href = 'clients.html'; // Redirect to the new clients page
    } else {
        // Incorrect Credentials
        errorMessage.textContent = 'Login ou senha incorretos.';
        const remainingAttempts = recordFailedAttempt(MAX_ATTEMPTS);

        if (remainingAttempts === 0) {
            // Lock the user out
            localStorage.setItem('lockoutTimestamp', Date.now().toString());
            showBlockPopup();
             // Optionally disable form elements after lockout
            loginInput.disabled = true;
            passwordInput.disabled = true;
            loginForm.querySelector('button[type="submit"]').disabled = true;
        } else {
             errorMessage.textContent += ` Tentativas restantes: ${remainingAttempts}.`;
        }
    }
}

function handleCancel() {
    loginInput.value = '';
    passwordInput.value = '';
    errorMessage.textContent = '';
    loginInput.focus();
}

function showBlockPopup() {
    blockPopup.style.display = 'flex';
}

function hideBlockPopup() {
    blockPopup.style.display = 'none';
}

// Simple placeholder for reCAPTCHA - real implementation requires more setup
const recaptchaPlaceholder = document.querySelector('.recaptcha-placeholder');
// In a real scenario, you would initialize the reCAPTCHA widget here
// and verify its response on the server-side during login.
// For now, it's just a visual element.