package org.polimi.andreaperotti.controller;

import org.polimi.andreaperotti.message.request.AllPrenRequest;
import org.polimi.andreaperotti.message.request.NextAvailableRequest;
import org.polimi.andreaperotti.message.request.PrenRequest;
import org.polimi.andreaperotti.message.request.SavePrenRequest;
import org.polimi.andreaperotti.message.response.PrenotazioneResponse;
import org.polimi.andreaperotti.model.Prenotazione;
import org.polimi.andreaperotti.model.User;
import org.polimi.andreaperotti.repository.PrenRepository;
import org.polimi.andreaperotti.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

// REST CONTROLLER che gestisce tutta la parte delle prenotazioni.
@RestController
@CrossOrigin(origins = "*", maxAge = 3600) // Accetto richieste da qualsiasi origine.
public class PrenRestAPIs {
    @Autowired
    PrenRepository prenRepository;

    @Autowired
    UserRepository userRepository;

    // API che passato un parrucchiere, una data ed un orario, verifico se è disponibile per l'appuntamento.
    @PostMapping ("api/pren/search")
    public ResponseEntity<Boolean> isDisponibile (@RequestBody PrenRequest prenRequest) throws ParseException {

        // Compongo data ed ora per formare un Datetime da cercare successivamente nel DB.
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String data = dateFormat.format(prenRequest.getData()) + " " + prenRequest.getOra();
        SimpleDateFormat parser = new SimpleDateFormat("yyyy-MM-dd hh:mm");
        parser.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date dateDaCercare = parser.parse(data);

        // Retrieve dell'utente dal DB, conosciuto l'ID.
        User parrucchiere = userRepository.findById(prenRequest.getHairstyler())
                .orElseThrow(() ->
                        new UsernameNotFoundException("Utente non trovato -> username o email : " + prenRequest.getHairstyler())
                );

        // Retrieve prenotazione conoscendo data e parrucchiere.
        Prenotazione p = prenRepository.findPrenotazioneByDataPrenotazioneAndParrucchiere(dateDaCercare, parrucchiere);

        // Se non trovo nessuna prenotazione comunico esito negativo; viceversa altrimenti.
        if (p != null){
            return ResponseEntity.ok().body(Boolean.FALSE);
        }else{
            return ResponseEntity.ok().body(Boolean.TRUE);
        }
    }

    // API che passato ID parrucchiere, resistuisce la prima prenotazione disponibile nella settimana subito successiva ad oggi.
    @PostMapping ("api/pren/next")
    public ResponseEntity<String> nextDisponibile (@RequestBody NextAvailableRequest nextAvailableRequest) throws ParseException {
        // Ottengo data odierna.
        Date dataInizio = new Date();
        Integer hh = dataInizio.getHours();
        String dataEOra = "";

        // Retrieve parrucchiere (User) conoscendo l'ID.
        User parrucchiere = userRepository.findById(nextAvailableRequest.getHairstyler())
                .orElseThrow(() ->
                        new UsernameNotFoundException("Utente non trovato -> username o email : " + nextAvailableRequest.getHairstyler())
                );

        // Ciclo per scorrere i giorni della successiva settimana.
        for (int i = 0; i < 7; i++){
            // Ciclo per scorrere le ore del giorno.
            for (int j = 0; j < 12; j++){
                // Compongo data di cui cercare la disponibilità
                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                String data = dateFormat.format(dataInizio);
                dataEOra = data + " " + String.valueOf(hh) + ":30";
                SimpleDateFormat parser = new SimpleDateFormat("yyyy-MM-dd hh:mm");
                parser.setTimeZone(TimeZone.getTimeZone("UTC"));
                Date dataDaCercare = parser.parse(dataEOra);

                // L'orario di prenotazione ottenuto deve essere diverso da ora di pranzo (12)
                // e minore dell'orario di chiusura (20)
                if ((hh != 12) && (hh < 20)){
                    // Se non c'è alcuna prenotazione alla data indicata per il parrucchiere cercato, allora comunico
                    // la relativa disponibilità.
                    if(prenRepository.findPrenotazioneByDataPrenotazioneAndParrucchiere(dataDaCercare, parrucchiere) == null){
                        return ResponseEntity.ok().body(dataEOra);
                    }
                }
                // Incremento orario.
                hh++;
            }
            // Resetto orario.
            hh = 8;

            // Compongo data di cui verificare la disponibilità.
            dataInizio.setDate(dataInizio.getDate() + 1);
        }

        // Se arrivo fino qui, non avrò trovato alcuna disponibilità per la date indicate.
        return ResponseEntity.ok().body("Nessuna prenotazione disponibile fino alla prossima settimana.");
    }

    // API che passato un parrucchiere, una data di inizio ed una di fine, mi restituisce tutte le prenotazioni della giornata.
    @PostMapping ("api/pren/get")
    public ResponseEntity<List<PrenotazioneResponse>> getPrenByDay (@RequestBody AllPrenRequest allPrenRequest) throws ParseException {
        // Imposto giornate ricevute alle ore 00:00:00.
        Date d1 = allPrenRequest.getDataAfter();
        Date d2 = allPrenRequest.getDataBefore();
        d1.setHours(0);
        d1.setMinutes(0);
        d1.setSeconds(0);
        d2.setHours(0);
        d2.setMinutes(0);
        d2.setSeconds(0);
        d2.setDate(d1.getDate() + 1);

        // Creo lista vuota per salvare delle prenotazioni da inviare come response.
        List<PrenotazioneResponse> prenotazioniFull = new ArrayList<>();

        // Contatore per impostare orari (parte da 10 per differenza orari con DB - UTC).
        int cont = 10;
        for (int i = 0; i < 12; i++){ // Ciclo per creare tutti i 12 appuntamenti giornalieri (1/ora)
            Date app = new Date();
            app.setYear(d1.getYear());
            app.setMonth(d1.getMonth());
            app.setDate(d1.getDate());
            app.setHours(cont);
            app.setMinutes(0);
            app.setSeconds(0);

            // Creo un prenotazione con la data di appoggio e lo username della relativa prenotazione a vuoto.
            PrenotazioneResponse pR = new PrenotazioneResponse(app, "");

            // Aggiungo prenotazione alla lista delle prenotazioni vuote.
            prenotazioniFull.add(pR);

            // Incremento orario della prenotazione.
            cont++;
        }

        // Retrieve parrucchiere conoscendo ID.
        User u = userRepository.findById(allPrenRequest.getHairstyler())
                .orElseThrow(() ->
                        new UsernameNotFoundException("Utente non trovato -> username o email : " + allPrenRequest.getHairstyler())
                );

        // Creo e ottengo la lista di tutte le prenotazione registrate sul DB tra le 2 date relative al parrucchiere cercato.
        List<Prenotazione> prenotazioniFound = prenRepository.findAllByDataAndParrucchiere(d1, d2, u);

        // Creo lista vuota di PrenotazioneResponse per comunicare successivamente al FE.
        List<PrenotazioneResponse> prenotazioneResponses = new ArrayList<>();

        // Ciclo per popolare lista di responses per le prenotazioni, in base a quelle trovate.
        for (Prenotazione p : prenotazioniFound){
            PrenotazioneResponse pR = new PrenotazioneResponse(p.getDataPrenotazione(), p.getUtente().getUsername(), p.getPrezzo());
            prenotazioneResponses.add(pR);
        }

        // Ciclo per effettuare il merge tra la lista di prenotazioni vuota (prenotazioniFull)
        // e quella di prenotazioni trovate nel DB (prenotazioniFound)
        for (Prenotazione p :prenotazioniFound){
            for (PrenotazioneResponse pr : prenotazioniFull){
                // Se trovo corrispondenza tra le 2 prenotazioni (stesso orario), sostituisco quella
                // con username vuoto con quella con username corretto.
                if (p.getDataPrenotazione().getHours() == pr.getData().getHours()){
                    pr.getData().setDate(p.getDataPrenotazione().getDate());
                    pr.setUsername(p.getUtente().getUsername());
                    pr.setPrezzo(p.getPrezzo());
                }
            }
        }

        // Ritorno la lista di Datetime e username con le relative prenotazioni.
        return ResponseEntity.ok().body(prenotazioniFull);
    }

    // API che passata data, ora, username, prezzo ed hairstyler, salva la prenotazione sul DB.
    @PostMapping("api/pren/save")
    public ResponseEntity<Boolean> save(@RequestBody SavePrenRequest savePrenRequest) throws ParseException {
        // Formatto correttamente la data passata.
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String data = dateFormat.format(savePrenRequest.getData());
        String dataEOra = data + " " + String.valueOf(savePrenRequest.getOra()) + ":30";

        // Compongo il DateTime, aggiungendo ora e minuti.
        SimpleDateFormat parser = new SimpleDateFormat("yyyy-MM-dd hh:mm");
        parser.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date dataDaInserire = parser.parse(dataEOra);

        // Istanzio oggetto prenotazioni.
        Prenotazione p = new Prenotazione();

        // Imposto la data di prenotazione relativa all'oggetto creato (che salveremo sul DB).
        p.setDataPrenotazione(dataDaInserire);

        // Retrieve utente conoscendo username.
        User u = userRepository.findByUsername(savePrenRequest.getUsername())
                .orElseThrow(() ->
                new UsernameNotFoundException("Utente non trovato -> username o email : " + savePrenRequest.getUsername())
        );

        // Retrieve parrucchiere (utente) conoscendo ID.
        User parr = userRepository.findById(savePrenRequest.getHairstyler()).orElseThrow(() ->
                new UsernameNotFoundException("Utente non trovato -> username o email : " + savePrenRequest.getHairstyler())
        );

        // Imposto utente relativo alla prenotazione.
        p.setUtente(u);

        // Imposto il prezzo della prenotazione.
        p.setPrezzo(savePrenRequest.getPrezzo());

        // Imposto il parrucchiere relativo alla prenotazione.
        p.setParrucchiere(parr);

        // Salvo prenotazione nel DB.
        prenRepository.save(p);

        // Comunico esito positivo.
        return ResponseEntity.ok().body(Boolean.TRUE);
    }

    // API che passata data, ora, username, prezzo ed hairstyler, elimina la prenotazione sul DB.
    @PostMapping ("api/pren/delete")
    public ResponseEntity<Boolean> delete(@RequestBody SavePrenRequest savePrenRequest) throws ParseException {
        // Formatto correttamente la data passata.
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String data = dateFormat.format(savePrenRequest.getData());
        String dataEOra = data + " " + String.valueOf(savePrenRequest.getOra()) + ":30";

        // Compongo il DateTime, aggiungendo ora e minuti.
        SimpleDateFormat parser = new SimpleDateFormat("yyyy-MM-dd hh:mm");
        parser.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date dataDaEliminare = parser.parse(dataEOra);

        // Retrieve parrucchiere conoscendo ID.
        User parrucchiere = userRepository.findById(savePrenRequest.getHairstyler())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User Not Found with -> username or email : " + savePrenRequest.getHairstyler())
                );

        // Retrieve prenotazione conoscendo la data ed il relativo parrucchiere.
        Prenotazione p = prenRepository.findPrenotazioneByDataPrenotazioneAndParrucchiere(dataDaEliminare, parrucchiere);

        // Se lo username ed il parrucchiere che richiede l'eliminazione e quello a cui corrisponde
        // la prenotazione stessa corrispondono, allora procedo con l'eliminazione.
        if (p.getUtente().getUsername().compareTo(savePrenRequest.getUsername()) == 0 &&
                p.getParrucchiere().getUsername().compareTo(parrucchiere.getUsername())==0){
            prenRepository.delete(p);
        }

        // Comunico esito positivo.
        return ResponseEntity.ok().body(Boolean.TRUE);
    }
}
