// --- DOM Elements ---
const searchNameInput = document.getElementById('search-name');
const searchCpfCnpjInput = document.getElementById('search-cpf-cnpj');
const searchCompanyInput = document.getElementById('search-company');
const searchButton = document.getElementById('search-button');
const searchResultsContainer = document.getElementById('search-results');
const clientDisplaySection = document.getElementById('client-display-section');
const clientNameDisplay = document.getElementById('client-name-display');
const clientCpfCnpjDisplay = document.getElementById('client-cpf-cnpj-display');
const clientCompanyDisplay = document.getElementById('client-company-display');
const clientEmailDisplay = document.getElementById('client-email-display');
const clientPhoneDisplay = document.getElementById('client-phone-display');
const historyBtn = document.getElementById('history-btn');
const interactionSection = document.getElementById('interaction-section');
const toggleServiceBlockBtn = document.getElementById('toggle-service-block-btn');
const viewHiddenBtn = document.getElementById('view-hidden-btn');
const serviceBlockContent = document.getElementById('service-block-content');
const servicosSolicitadosInput = document.getElementById('servicos-solicitados');
const dataAtendimentoInput = document.getElementById('data-atendimento');
const descricaoAtendimentoInput = document.getElementById('descricao-atendimento');
const observacaoAtendimentoInput = document.getElementById('observacao-atendimento');
const formaPagamentoCombinadoInput = document.getElementById('forma-pagamento-combinado');
const paymentTable = document.getElementById('payment-table');
const addPaymentRowBtn = document.getElementById('add-payment-row-btn');
const valorRecebidoInput = document.getElementById('valor-recebido');
const valorAReceberInput = document.getElementById('valor-a-receber');
const parcelasAReceberSelect = document.getElementById('parcelas-a-receber');
const dataPagamentoInput = document.getElementById('data-pagamento');
const formaPagamentoSelect = document.getElementById('forma-pagamento');
const pagamentoTotalSelect = document.getElementById('pagamento-total');
const pagamentoAtrasoSelect = document.getElementById('pagamento-atraso');
const cancelInteractionBtn = document.getElementById('cancel-interaction-btn');
const saveInteractionBtn = document.getElementById('save-interaction-btn');
const hiddenServicesPopup = document.getElementById('hidden-services-popup');
const closeHiddenPopupBtn = document.getElementById('close-hidden-popup-btn');
const hiddenServicesContent = document.getElementById('hidden-services-content');
const infoPopup = document.getElementById('info-popup');
const closeInfoPopupBtn = document.getElementById('close-info-popup-btn');
const infoPopupTitle = document.getElementById('info-popup-title');
const infoPopupMessage = document.getElementById('info-popup-message');
const newClientBtn = document.getElementById('new-client-btn'); // Added

// --- Event Listeners ---
searchButton.addEventListener('click', searchClients);
historyBtn.addEventListener('click', displayHistory);
toggleServiceBlockBtn.addEventListener('click', toggleServiceBlock);
viewHiddenBtn.addEventListener('click', viewHiddenServices);
addPaymentRowBtn.addEventListener('click', addPaymentRow);
cancelInteractionBtn.addEventListener('click', cancelInteraction);
saveInteractionBtn.addEventListener('click', saveInteraction);
closeHiddenPopupBtn.addEventListener('click', closeHiddenPopup);
closeInfoPopupBtn.addEventListener('click', closeInfoPopup);
if (newClientBtn) {
    newClientBtn.addEventListener('click', () => {
        window.location.href = 'new-client.html'; // Navigate to the new client form
    });
}

// --- Functions ---
function searchClients() {
    const searchName = searchNameInput.value.trim();
    const searchCpfCnpj = searchCpfCnpjInput.value.trim();
    const searchCompany = searchCompanyInput.value.trim();

    // Simulated search results
    const searchResults = [
        { name: 'John Doe', cpfCnpj: '12345678900', company: 'ABC Corporation' },
        { name: 'Jane Doe', cpfCnpj: '98765432100', company: 'DEF Corporation' },
    ];

    searchResultsContainer.innerHTML = '';
    searchResults.forEach((result) => {
        const searchResultItem = document.createElement('div');
        searchResultItem.classList.add('search-result-item');
        searchResultItem.innerHTML = `
            <span>${result.name}</span>
            <span>${result.cpfCnpj}</span>
            <span>${result.company}</span>
        `;
        searchResultsContainer.appendChild(searchResultItem);
    });
}

function displayClient(clientData) {
    clientNameDisplay.textContent = clientData.name;
    clientCpfCnpjDisplay.textContent = clientData.cpfCnpj;
    clientCompanyDisplay.textContent = clientData.company;
    clientEmailDisplay.textContent = clientData.email;
    clientPhoneDisplay.textContent = clientData.phone;
    clientDisplaySection.style.display = 'block';
}

function displayHistory() {
    // Simulated history data
    const historyData = [
        { date: '2022-01-01', description: 'Initial consultation' },
        { date: '2022-01-15', description: 'Follow-up consultation' },
    ];

    const historyHtml = historyData.map((entry) => `
        <p>${entry.date}: ${entry.description}</p>
    `).join('');
    hiddenServicesContent.innerHTML = historyHtml;
    hiddenServicesPopup.style.display = 'flex';
}

function toggleServiceBlock() {
    serviceBlockContent.style.display = serviceBlockContent.style.display === 'none' ? 'block' : 'none';
    toggleServiceBlockBtn.textContent = serviceBlockContent.style.display === 'none' ? 'Mostrar' : 'Ocultar';
}

function viewHiddenServices() {
    // Simulated hidden services data
    const hiddenServicesData = [
        { date: '2022-02-01', description: 'Hidden service 1' },
        { date: '2022-03-01', description: 'Hidden service 2' },
    ];

    const hiddenServicesHtml = hiddenServicesData.map((entry) => `
        <p>${entry.date}: ${entry.description}</p>
    `).join('');
    hiddenServicesContent.innerHTML = hiddenServicesHtml;
    hiddenServicesPopup.style.display = 'flex';
}

function addPaymentRow() {
    const paymentRow = document.createElement('tr');
    paymentRow.innerHTML = `
        <td><input type="date" /></td>
        <td><input type="text" /></td>
        <td><input type="number" step="0.01" /></td>
        <td><select><option>1</option><option>2</option><option>3</option></select></td>
        <td><button class="remove-row-btn">-</button></td>
    `;
    paymentTable.appendChild(paymentRow);
}

function cancelInteraction() {
    interactionSection.style.display = 'none';
}

function saveInteraction() {
    // Simulated interaction data
    const interactionData = {
        servicosSolicitados: servicosSolicitadosInput.value,
        dataAtendimento: dataAtendimentoInput.value,
        descricaoAtendimento: descricaoAtendimentoInput.value,
        observacaoAtendimento: observacaoAtendimentoInput.value,
        formaPagamentoCombinado: formaPagamentoCombinadoInput.value,
        paymentRows: Array.from(paymentTable.rows).map((row) => {
            return {
                date: row.cells[0].querySelector('input').value,
                service: row.cells[1].querySelector('input').value,
                value: row.cells[2].querySelector('input').value,
                parcels: row.cells[3].querySelector('select').value,
            };
        }),
    };

    // Save interaction data to simulated backend
    console.log(interactionData);

    infoPopupTitle.textContent = 'Sucesso!';
    infoPopupMessage.textContent = 'Interação salva com sucesso!';
    infoPopup.style.display = 'flex';
}

function closeHiddenPopup() {
    hiddenServicesPopup.style.display = 'none';
}

function closeInfoPopup() {
    infoPopup.style.display = 'none';
}