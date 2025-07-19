// Dati locali per simulare il database
let vehicles = [];
let interventions = [];

// Funzioni di utilità
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    if (!dateString) return 'Non specificata';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

// Gestione delle pagine
function showPage(pageId) {
    // Nasconde tutte le pagine
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Mostra la pagina richiesta
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Aggiorna i dati quando si carica una pagina
        if (pageId === 'vehicle-form') {
            loadVehiclesList();
            updateVehicleSelects();
        } else if (pageId === 'intervention-form') {
            updateVehicleSelects();
            loadInterventionsList();
        } else if (pageId === 'search-interventions') {
            clearSearchResults();
        } else if (pageId === 'view-scadenze') {
            updateVehicleSelects();
            clearScadenzeResults();
        }
    }
}

// Gestione form veicoli
document.getElementById('vehicleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const vehicle = {
        id: generateId(),
        targa: formData.get('targa').toUpperCase(),
        marca: formData.get('marca'),
        modello: formData.get('modello'),
        anno: parseInt(formData.get('anno')),
        scadenza_revisione: formData.get('scadenza_revisione'),
        scadenza_bollo: formData.get('scadenza_bollo'),
        scadenza_assicurazione: formData.get('scadenza_assicurazione'),
        created_at: new Date().toISOString()
    };
    
    // Verifica se la targa esiste già
    if (vehicles.find(v => v.targa === vehicle.targa)) {
        showMessage('Errore: Targa già esistente', 'error');
        return;
    }
    
    vehicles.push(vehicle);
    saveToLocalStorage();
    
    showMessage('Veicolo salvato con successo!', 'success');
    e.target.reset();
    loadVehiclesList();
    updateVehicleSelects();
});

// Gestione form interventi
document.getElementById('interventionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const intervention = {
        id: generateId(),
        targa_veicolo: formData.get('targa_veicolo'),
        data_intervento: formData.get('data_intervento'),
        tipo_intervento: formData.get('tipo_intervento'),
        costo: parseFloat(formData.get('costo')),
        kilometraggio: parseInt(formData.get('kilometraggio')),
        note: formData.get('note'),
        created_at: new Date().toISOString()
    };
    
    interventions.push(intervention);
    saveToLocalStorage();
    
    showMessage('Intervento salvato con successo!', 'success');
    e.target.reset();
    loadInterventionsList();
});

// Caricamento lista veicoli
function loadVehiclesList() {
    const container = document.getElementById('vehiclesList');
    
    if (vehicles.length === 0) {
        container.innerHTML = '<p>Nessun veicolo registrato</p>';
        return;
    }
    
    const html = vehicles.map(vehicle => `
        <div class="vehicle-item">
            <h4>${vehicle.targa} - ${vehicle.marca} ${vehicle.modello}</h4>
            <p><strong>Anno:</strong> ${vehicle.anno}</p>
            <p><strong>Revisione:</strong> ${formatDate(vehicle.scadenza_revisione)}</p>
            <p><strong>Bollo:</strong> ${formatDate(vehicle.scadenza_bollo)}</p>
            <p><strong>Assicurazione:</strong> ${formatDate(vehicle.scadenza_assicurazione)}</p>
            <div class="item-actions">
                <button class="edit-button" onclick="editVehicle('${vehicle.id}')">Modifica</button>
                <button class="delete-button" onclick="deleteVehicle('${vehicle.id}')">Elimina</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Caricamento lista interventi
function loadInterventionsList() {
    const container = document.getElementById('interventionsList');
    
    if (interventions.length === 0) {
        container.innerHTML = '<p>Nessun intervento registrato</p>';
        return;
    }
    
    const html = interventions.map(intervention => {
        const vehicle = vehicles.find(v => v.targa === intervention.targa_veicolo);
        const vehicleInfo = vehicle ? `${vehicle.marca} ${vehicle.modello}` : 'Veicolo non trovato';
        
        return `
            <div class="intervention-item">
                <h4>${intervention.targa_veicolo} - ${vehicleInfo}</h4>
                <div class="details">
                    <span><strong>Data:</strong> ${formatDate(intervention.data_intervento)}</span>
                    <span><strong>Tipo:</strong> ${intervention.tipo_intervento}</span>
                    <span><strong>Costo:</strong> ${formatCurrency(intervention.costo)}</span>
                    <span><strong>Km:</strong> ${intervention.kilometraggio.toLocaleString('it-IT')}</span>
                </div>
                ${intervention.note ? `<p><strong>Note:</strong> ${intervention.note}</p>` : ''}
                <div class="item-actions">
                    <button class="edit-button" onclick="editIntervention('${intervention.id}')">Modifica</button>
                    <button class="delete-button" onclick="deleteIntervention('${intervention.id}')">Elimina</button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Aggiornamento select veicoli
function updateVehicleSelects() {
    const selects = [
        document.getElementById('targa_veicolo'),
        document.getElementById('scadenze_veicolo')
    ];
    
    selects.forEach(select => {
        if (!select) return;
        
        // Mantieni la prima opzione
        const firstOption = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (firstOption) {
            select.appendChild(firstOption);
        }
        
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.targa;
            option.textContent = `${vehicle.targa} - ${vehicle.marca} ${vehicle.modello}`;
            select.appendChild(option);
        });
    });
}

// Ricerca interventi
function searchInterventions() {
    const targa = document.getElementById('search_targa').value.toUpperCase();
    const container = document.getElementById('searchResults');
    
    if (!targa) {
        container.innerHTML = '<p class="error">Inserisci una targa per la ricerca</p>';
        return;
    }
    
    const vehicleInterventions = interventions.filter(i => i.targa_veicolo === targa);
    const vehicle = vehicles.find(v => v.targa === targa);
    
    if (!vehicle) {
        container.innerHTML = '<p class="error">Veicolo non trovato</p>';
        return;
    }
    
    if (vehicleInterventions.length === 0) {
        container.innerHTML = `
            <div class="result-item">
                <h4>${vehicle.targa} - ${vehicle.marca} ${vehicle.modello}</h4>
                <p>Nessun intervento registrato per questo veicolo</p>
            </div>
        `;
        return;
    }
    
    // Ordina per data (più recenti prima)
    vehicleInterventions.sort((a, b) => new Date(b.data_intervento) - new Date(a.data_intervento));
    
    const totalCost = vehicleInterventions.reduce((sum, i) => sum + i.costo, 0);
    
    const html = `
        <div class="result-item">
            <h4>${vehicle.targa} - ${vehicle.marca} ${vehicle.modello} (${vehicle.anno})</h4>
            <p><strong>Totale interventi:</strong> ${vehicleInterventions.length}</p>
            <p><strong>Costo totale:</strong> ${formatCurrency(totalCost)}</p>
        </div>
        ${vehicleInterventions.map(intervention => `
            <div class="result-item">
                <h4>${intervention.tipo_intervento}</h4>
                <div class="details">
                    <span><strong>Data:</strong> ${formatDate(intervention.data_intervento)}</span>
                    <span><strong>Costo:</strong> ${formatCurrency(intervention.costo)}</span>
                    <span><strong>Km:</strong> ${intervention.kilometraggio.toLocaleString('it-IT')}</span>
                </div>
                ${intervention.note ? `<p><strong>Note:</strong> ${intervention.note}</p>` : ''}
                <div class="item-actions">
                    <button class="edit-button" onclick="editIntervention('${intervention.id}')">Modifica</button>
                    <button class="delete-button" onclick="deleteIntervention('${intervention.id}')">Elimina</button>
                </div>
            </div>
        `).join('')}
    `;
    
    container.innerHTML = html;
}

// Visualizzazione scadenze
function viewScadenze() {
    const targa = document.getElementById('scadenze_veicolo').value;
    const container = document.getElementById('scadenzeResults');
    
    if (!targa) {
        container.innerHTML = '<p class="error">Seleziona un veicolo</p>';
        return;
    }
    
    const vehicle = vehicles.find(v => v.targa === targa);
    if (!vehicle) {
        container.innerHTML = '<p class="error">Veicolo non trovato</p>';
        return;
    }
    
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    
    const scadenze = [
        {
            tipo: 'Revisione',
            data: vehicle.scadenza_revisione,
            scaduta: vehicle.scadenza_revisione && new Date(vehicle.scadenza_revisione) < today,
            prossima: vehicle.scadenza_revisione && new Date(vehicle.scadenza_revisione) <= oneMonthFromNow && new Date(vehicle.scadenza_revisione) >= today
        },
        {
            tipo: 'Bollo',
            data: vehicle.scadenza_bollo,
            scaduta: vehicle.scadenza_bollo && new Date(vehicle.scadenza_bollo) < today,
            prossima: vehicle.scadenza_bollo && new Date(vehicle.scadenza_bollo) <= oneMonthFromNow && new Date(vehicle.scadenza_bollo) >= today
        },
        {
            tipo: 'Assicurazione',
            data: vehicle.scadenza_assicurazione,
            scaduta: vehicle.scadenza_assicurazione && new Date(vehicle.scadenza_assicurazione) < today,
            prossima: vehicle.scadenza_assicurazione && new Date(vehicle.scadenza_assicurazione) <= oneMonthFromNow && new Date(vehicle.scadenza_assicurazione) >= today
        }
    ];
    
    const html = `
        <div class="result-item">
            <h4>${vehicle.targa} - ${vehicle.marca} ${vehicle.modello} (${vehicle.anno})</h4>
        </div>
        ${scadenze.map(scadenza => {
            let cssClass = 'scadenza-item';
            let status = 'Valida';
            
            if (scadenza.scaduta) {
                cssClass += ' scaduta';
                status = 'SCADUTA';
            } else if (scadenza.prossima) {
                cssClass += ' prossima';
                status = 'In scadenza';
            }
            
            return `
                <div class="${cssClass}">
                    <h4>${scadenza.tipo}</h4>
                    <p><strong>Data scadenza:</strong> ${formatDate(scadenza.data)}</p>
                    <p><strong>Stato:</strong> <span class="${scadenza.scaduta ? 'text-danger' : scadenza.prossima ? 'text-warning' : 'text-success'}">${status}</span></p>
                </div>
            `;
        }).join('')}
    `;
    
    container.innerHTML = html;
}

// Funzioni di modifica e cancellazione
function editVehicle(id) {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;
    
    // Popola il form con i dati del veicolo
    document.getElementById('targa').value = vehicle.targa;
    document.getElementById('marca').value = vehicle.marca;
    document.getElementById('modello').value = vehicle.modello;
    document.getElementById('anno').value = vehicle.anno;
    document.getElementById('scadenza_revisione').value = vehicle.scadenza_revisione || '';
    document.getElementById('scadenza_bollo').value = vehicle.scadenza_bollo || '';
    document.getElementById('scadenza_assicurazione').value = vehicle.scadenza_assicurazione || '';
    
    // Rimuovi il veicolo dalla lista (sarà ri-aggiunto quando il form viene salvato)
    deleteVehicle(id, false);
    
    showMessage('Veicolo caricato per la modifica', 'success');
}

function deleteVehicle(id, showConfirm = true) {
    if (showConfirm && !confirm('Sei sicuro di voler eliminare questo veicolo?')) {
        return;
    }
    
    vehicles = vehicles.filter(v => v.id !== id);
    saveToLocalStorage();
    loadVehiclesList();
    updateVehicleSelects();
    
    if (showConfirm) {
        showMessage('Veicolo eliminato', 'success');
    }
}

function editIntervention(id) {
    const intervention = interventions.find(i => i.id === id);
    if (!intervention) return;
    
    // Popola il form con i dati dell'intervento
    document.getElementById('targa_veicolo').value = intervention.targa_veicolo;
    document.getElementById('data_intervento').value = intervention.data_intervento;
    document.getElementById('tipo_intervento').value = intervention.tipo_intervento;
    document.getElementById('costo').value = intervention.costo;
    document.getElementById('kilometraggio').value = intervention.kilometraggio;
    document.getElementById('note').value = intervention.note || '';
    
    // Rimuovi l'intervento dalla lista
    deleteIntervention(id, false);
    
    showMessage('Intervento caricato per la modifica', 'success');
}

function deleteIntervention(id, showConfirm = true) {
    if (showConfirm && !confirm('Sei sicuro di voler eliminare questo intervento?')) {
        return;
    }
    
    interventions = interventions.filter(i => i.id !== id);
    saveToLocalStorage();
    loadInterventionsList();
    
    if (showConfirm) {
        showMessage('Intervento eliminato', 'success');
    }
}

// Funzioni di utilità per i messaggi
function showMessage(message, type = 'success') {
    // Rimuovi messaggi esistenti
    const existingMessages = document.querySelectorAll('.success, .error');
    existingMessages.forEach(msg => msg.remove());
    
    // Crea nuovo messaggio
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    // Inserisci il messaggio nella pagina attiva
    const activePage = document.querySelector('.page.active .form-card');
    if (activePage) {
        activePage.insertBefore(messageDiv, activePage.firstChild);
        
        // Rimuovi il messaggio dopo 3 secondi
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

function clearSearchResults() {
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('search_targa').value = '';
}

function clearScadenzeResults() {
    document.getElementById('scadenzeResults').innerHTML = '';
    document.getElementById('scadenze_veicolo').value = '';
}

// Gestione localStorage
function saveToLocalStorage() {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    localStorage.setItem('interventions', JSON.stringify(interventions));
}

function loadFromLocalStorage() {
    const savedVehicles = localStorage.getItem('vehicles');
    const savedInterventions = localStorage.getItem('interventions');
    
    if (savedVehicles) {
        vehicles = JSON.parse(savedVehicles);
    }
    
    if (savedInterventions) {
        interventions = JSON.parse(savedInterventions);
    }
}

// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    updateVehicleSelects();
    
    // Mostra la homepage di default
    showPage('homepage');
    
    // Imposta la data di oggi come default per i form
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (input.id === 'data_intervento') {
            input.value = today;
        }
    });
});

// Gestione del tasto Esc per tornare alla homepage
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        showPage('homepage');
    }
});

// Funzioni per l'esportazione (placeholder per future implementazioni)
function exportToPDF(type, data) {
    // Questa funzione può essere implementata con librerie come jsPDF
    alert('Funzionalità di esportazione PDF in sviluppo');
}

// Funzione per il backup dei dati
function exportData() {
    const data = {
        vehicles: vehicles,
        interventions: interventions,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'gestione_veicoli_backup.json';
    link.click();
}

// Funzione per l'importazione dei dati
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.vehicles && data.interventions) {
                vehicles = data.vehicles;
                interventions = data.interventions;
                saveToLocalStorage();
                
                // Aggiorna tutte le visualizzazioni
                loadVehiclesList();
                loadInterventionsList();
                updateVehicleSelects();
                
                showMessage('Dati importati con successo!', 'success');
            } else {
                showMessage('File non valido', 'error');
            }
        } catch (error) {
            showMessage('Errore durante l\'importazione: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

