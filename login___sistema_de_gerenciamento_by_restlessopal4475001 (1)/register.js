// --- DOM Elements ---
const registerForm = document.getElementById('register-form');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const cpfInput = document.getElementById('cpf');
const dobInput = document.getElementById('dob');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const cancelButton = document.getElementById('cancel-button');
const generalErrorMessage = document.getElementById('general-error-message');
const emailError = document.getElementById('email-error');
const dobError = document.getElementById('dob-error');
const cpfError = document.getElementById('cpf-error');

const successPopup = document.getElementById('success-popup');
const errorPopup = document.getElementById('error-popup');
const successMessage = document.getElementById('success-message');
const errorMessagePopup = document.getElementById('error-popup-message');
const closeSuccessPopupButton = document.getElementById('close-success-popup-button');
const closeErrorPopupButton = document.getElementById('close-error-popup-button');


// --- Event Listeners ---
registerForm.addEventListener('submit', handleSubmit);
cancelButton.addEventListener('click', handleCancel);
closeSuccessPopupButton.addEventListener('click', () => hidePopup(successPopup));
closeErrorPopupButton.addEventListener('click', () => hidePopup(errorPopup));

// Real-time validation hints (optional but good UX)
emailInput.addEventListener('input', validateEmailRealtime);
dobInput.addEventListener('input', validateAgeRealtime);
cpfInput.addEventListener('input', formatCPFRealtime);


// --- Functions ---

function handleSubmit(event) {
    event.preventDefault();
    clearErrors();

    // --- Basic Required Field Check ---
    const requiredFields = [fullnameInput, emailInput, cpfInput, dobInput, phoneInput, passwordInput];
    let allFieldsFilled = true;
    requiredFields.forEach(input => {
        if (!input.value.trim()) {
            allFieldsFilled = false;
            // Optionally mark the specific field
            input.style.borderColor = '#c0392b'; // Red border
        } else {
            input.style.borderColor = ''; // Reset border
        }
    });

    if (!allFieldsFilled) {
        showErrorPopup("Cadastro incompleto. Por favor, preencha todos os campos obrigatórios (*).");
        return;
    }

    // --- Specific Validations ---
    const isEmailValid = validateEmail(emailInput.value);
    const isAgeValid = validateAge(dobInput.value);
    const isCpfValid = validateCPF(cpfInput.value); // Basic format check

    if (!isEmailValid) {
        emailError.textContent = 'Formato de e-mail inválido.';
        emailInput.focus();
        showErrorPopup("Formato de e-mail inválido.");
        return;
    }
     if (!isCpfValid) {
        cpfError.textContent = 'Formato de CPF inválido.';
        cpfInput.focus();
        showErrorPopup("Formato de CPF inválido.");
        return;
    }
    if (!isAgeValid) {
        dobError.textContent = 'É necessário ter pelo menos 18 anos.';
        dobInput.focus();
        showErrorPopup("Idade menor que 18 anos não permitida.");
        return;
    }

    if (passwordInput.value.length < 6) {
        passwordInput.focus();
        showErrorPopup("A senha deve ter no mínimo 6 caracteres.");
        return;
    }


    // --- Simulation of Saving Data ---
    // In a real application, you would send the data to the server here.
    // For now, we just show the success message.
    console.log('Simulating registration with data:', {
        fullname: fullnameInput.value,
        email: emailInput.value,
        cpf: cpfInput.value,
        dob: dobInput.value,
        phone: phoneInput.value,
        // Password should NOT be logged in production!
    });

    showSuccessPopup("Cadastro realizado com sucesso!");
    // Optionally clear the form after successful "submission"
    // registerForm.reset();
}

function handleCancel() {
    registerForm.reset(); // Clears all form fields
    clearErrors();
}

function clearErrors() {
    generalErrorMessage.textContent = '';
    emailError.textContent = '';
    dobError.textContent = '';
    cpfError.textContent = '';
     // Reset border colors potentially set by handleSubmit
    [fullnameInput, emailInput, cpfInput, dobInput, phoneInput, passwordInput].forEach(input => {
        input.style.borderColor = '';
    });
}

function validateEmail(email) {
    // Basic check for "@" symbol
    return email.includes('@');
}

function validateEmailRealtime() {
    if (!validateEmail(emailInput.value) && emailInput.value.length > 0) {
        emailError.textContent = 'E-mail deve conter "@".';
    } else {
        emailError.textContent = '';
    }
}

function validateAge(dobString) {
    if (!dobString) return false; // No date entered

    const today = new Date();
    const birthDate = new Date(dobString);

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 18;
}


function validateAgeRealtime() {
     if (dobInput.value && !validateAge(dobInput.value)) {
        dobError.textContent = 'É necessário ter pelo menos 18 anos.';
    } else {
        dobError.textContent = '';
    }
}

function validateCPF(cpf) {
    // Remove non-digit characters
    cpf = cpf.replace(/[^\d]/g, '');

    // Basic length check
    if (cpf.length !== 11) {
        return false;
    }

    // Check for sequences of identical digits (invalid CPF)
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    // --- Basic CPF validation algorithm (Modulo 11) ---
    // This is a simplified check and might not catch all invalid CPFs,
    // but it's better than just a format check.
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true; // Passed basic checks
}


function formatCPFRealtime() {
    let cpf = cpfInput.value.replace(/\D/g, ''); // Remove non-digits
    cpf = cpf.substring(0, 11); // Limit length

    // Apply formatting as user types
    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    cpfInput.value = cpf;

     // Check validity after formatting
    if (cpfInput.value.length > 0 && !validateCPF(cpfInput.value)) {
        cpfError.textContent = 'CPF inválido.';
    } else {
         cpfError.textContent = '';
    }
}


function showSuccessPopup(message) {
    successMessage.textContent = message;
    successPopup.style.display = 'flex';
}

function showErrorPopup(message) {
    errorMessagePopup.textContent = message;
    errorPopup.style.display = 'flex';
}

function hidePopup(popupElement) {
    popupElement.style.display = 'none';
}