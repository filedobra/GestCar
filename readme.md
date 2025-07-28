# Gestione Veicoli - Sistema di gestione interventi e scadenze

![Screenshot dell'applicazione](screenshot.png)

Un'applicazione web completa per la gestione di veicoli, interventi di manutenzione e scadenze (bollo, assicurazione, revisione).

## Funzionalità principali

- 🚗 **Gestione veicoli**: Registra e modifica i dati dei veicoli (targa, marca, modello, anno)
- 🔧 **Gestione interventi**: Registra tutti gli interventi di manutenzione con costo e kilometraggio
- 📅 **Gestione scadenze**: Traccia le scadenze di bollo, assicurazione e revisione
- 🔍 **Ricerca interventi**: Visualizza la cronologia completa degli interventi per veicolo
- 💾 **Salvataggio locale**: Tutti i dati vengono salvati nel browser dell'utente
- 📁 **Importa/Esporta**: Possibilità di fare backup e ripristino dei dati

## Tecnologie utilizzate

- HTML5, CSS3, JavaScript vanilla
- LocalStorage per il salvataggio dei dati
- Design responsive che funziona su mobile e desktop
- UI moderna con gradienti e animazioni

## Come utilizzare l'applicazione

1. **Aggiungi un veicolo**:
   - Compila tutti i campi obbligatori nella scheda "Inserimento Veicolo"
   - Inserisci le date di scadenza per bollo, assicurazione e revisione

2. **Registra un intervento**:
   - Seleziona il veicolo dalla lista
   - Inserisci tipo intervento, data, costo e kilometraggio
   - Aggiungi eventuali note

3. **Consulta gli interventi**:
   - Usa la funzione di ricerca per vedere tutti gli interventi di un veicolo
   - Visualizza il costo totale degli interventi

4. **Controlla le scadenze**:
   - Seleziona un veicolo per vedere lo stato delle scadenze
   - Le scadenze vengono evidenziate in rosso se scadute, in giallo se in scadenza entro un mese

## Installazione

Non è necessaria alcuna installazione! L'applicazione funziona direttamente nel browser:

1. Scarica il file `index.html`
2. Aprilo con il tuo browser preferito (Chrome, Firefox, Edge, etc.)
3. Inizia a utilizzare l'applicazione

## Screenshot

![Screenshot 1 - Homepage](screenshots/home.png)
*Homepage con le funzioni principali*

![Screenshot 2 - Inserimento veicolo](screenshots/vehicle-form.png)
*Form per l'inserimento di un nuovo veicolo*

![Screenshot 3 - Ricerca interventi](screenshots/search.png)
*Risultati della ricerca per targa*

## Roadmap e miglioramenti futuri

- [ ] Aggiunta autenticazione utente
- [ ] Sincronizzazione con cloud
- [ ] Notifiche per scadenze prossime
- [ ] Generazione report PDF
- [ ] Statistiche e grafici sugli interventi

## Come contribuire

Contributi sono benvenuti! Ecco come puoi aiutare:

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Fai commit delle tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Distribuito con licenza MIT. Vedi `LICENSE` per maggiori informazioni.

## Contatti

Per domande o suggerimenti, contattami via email: tua@email.com