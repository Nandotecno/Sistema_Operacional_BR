// --- DOM Elements ---
const form = document.getElementById('new-client-form');
const stateSelect = document.getElementById('state');
const addServiceBtn = document.getElementById('add-service-btn');
const serviceSelect = document.getElementById('other-services-select');
const addedServicesContainer = document.getElementById('added-services-container');
const cancelBtn = document.getElementById('cancel-btn');
const errorMessageDiv = document.getElementById('error-message');

// Required field IDs (add more as needed for robust validation)
const requiredFields = [
    'company-name', 'cpf', 'cnpj', 'email', 'mobile-phone'
];

// Popups (assuming structure from register.html)
const successPopup = document.getElementById('success-popup');
const errorPopup = document.getElementById('error-popup');
const successMessage = document.getElementById('success-message');
const errorMessagePopup = document.getElementById('error-popup-message');
const closeSuccessPopupButton = document.getElementById('close-success-popup-button');
const closeErrorPopupButton = document.getElementById('close-error-popup-button');

// --- State (UF) Options ---
const ufs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

function populateStates() {
    ufs.forEach(uf => {
        const option = document.createElement('option');
        option.value = uf;
        option.textContent = uf;
        stateSelect.appendChild(option);
    });
}

// --- Dynamic Service Items ---
function addServiceItem() {
    const selectedValue = serviceSelect.value;
    const selectedText = serviceSelect.options[serviceSelect.selectedIndex].text;

    // Prevent adding duplicates (optional)
    const existingItems = addedServicesContainer.querySelectorAll('.added-item');
    for (let item of existingItems) {
        if (item.dataset.value === selectedValue) {
            showError("Este item já foi adicionado.");
            return; // Don't add if it already exists
        }
    }


    const newItem = document.createElement('div');
    newItem.classList.add('added-item');
    newItem.dataset.value = selectedValue; // Store value for potential submission

    const textSpan = document.createElement('span');
    textSpan.textContent = selectedText;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add('remove-item-btn');
    removeBtn.textContent = 'x';
    removeBtn.addEventListener('click', () => {
        newItem.remove();
    });

    newItem.appendChild(textSpan);
    newItem.appendChild(removeBtn);
    addedServicesContainer.appendChild(newItem);
}

// --- Validation and Submission ---
function validateForm() {
    clearErrors();
    let isValid = true;

    // Check required fields
    requiredFields.forEach(id => {
        const input = document.getElementById(id);
        if (!input.value.trim()) {
            showError(`Campo "${input.previousElementSibling.textContent.replace('*','').trim()}" é obrigatório.`);
            input.style.borderColor = '#ff6b6b'; // Highlight error field
            isValid = false;
        } else {
            input.style.borderColor = ''; // Reset border
        }
    });

    // Add more specific validations here if needed (e.g., CPF/CNPJ format, email format)
    const emailInput = document.getElementById('email');
    if (emailInput.value && !emailInput.value.includes('@')) {
        showError('Formato de e-mail inválido.');
        emailInput.style.borderColor = '#ff6b6b';
        isValid = false;
    }

    const cnhInput = document.getElementById('cnh');
     if (cnhInput.value && cnhInput.value.length > 12) { // Already handled by maxlength, but good practice
        showError('CNH não pode ter mais de 12 caracteres.');
        cnhInput.style.borderColor = '#ff6b6b';
        isValid = false;
    }
    // Simple numeric checks (can be enhanced with regex)
    const numericFields = ['state-reg', 'municipal-reg', 'nire'];
     numericFields.forEach(id => {
        const input = document.getElementById(id);
        if (input.value && !/^\d+$/.test(input.value)) {
            showError(`Campo "${input.previousElementSibling.textContent}" deve conter apenas números.`);
            input.style.borderColor = '#ff6b6b';
            isValid = false;
        }
     });


    return isValid;
}

function handleSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
        // --- Simulate Saving Data ---
        const formData = new FormData(form);
        const clientData = {};
        formData.forEach((value, key) => {
            clientData[key] = value;
        });

        // Get added services
        const addedServices = [];
        addedServicesContainer.querySelectorAll('.added-item').forEach(item => {
            addedServices.push(item.dataset.value);
        });
        clientData['other-services'] = addedServices; // Add to data object

        console.log('Simulating save for new client:', clientData);

        // In a real app, send data to server here
        // Then show success message or handle server errors

        showSuccessPopup("Cliente cadastrado com sucesso!");
        // Optionally reset form: form.reset(); clearAddedServices();
        // Or redirect: window.location.href = 'clients.html';
    } else {
        // Show generic error popup if inline messages aren't sufficient
         showErrorPopup("Por favor, corrija os erros no formulário.");
    }
}

function handleCancel() {
    // Reset form fields
    form.reset();
    // Clear dynamically added services
    clearAddedServices();
    // Clear any error messages
    clearErrors();
    // Optional: Redirect back to the clients list or previous page
    // window.location.href = 'clients.html'; // Or history.back();
}

function clearAddedServices() {
     addedServicesContainer.innerHTML = '';
}

function clearErrors() {
    errorMessageDiv.textContent = '';
    // Reset border colors
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => input.style.borderColor = '');
}

function showError(message) {
    // Display error message inline near the form
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
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


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', populateStates);
addServiceBtn.addEventListener('click', addServiceItem);
form.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', handleCancel);

// Popup close buttons
if (closeSuccessPopupButton) {
    closeSuccessPopupButton.addEventListener('click', () => hidePopup(successPopup));
}
if (closeErrorPopupButton) {
    closeErrorPopupButton.addEventListener('click', () => hidePopup(errorPopup));
}