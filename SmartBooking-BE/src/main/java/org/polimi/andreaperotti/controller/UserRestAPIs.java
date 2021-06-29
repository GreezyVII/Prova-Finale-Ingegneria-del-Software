package org.polimi.andreaperotti.controller;

import org.polimi.andreaperotti.message.request.AnalyticsRequest;
import org.polimi.andreaperotti.message.request.AuthRequest;
import org.polimi.andreaperotti.message.request.UpdateRequest;
import org.polimi.andreaperotti.message.response.AnalyticsResponse;
import org.polimi.andreaperotti.message.response.StylistResponse;
import org.polimi.andreaperotti.message.response.UserInfoResponse;
import org.polimi.andreaperotti.message.response.UserPrenotationsList;
import org.polimi.andreaperotti.model.Prenotazione;
import org.polimi.andreaperotti.model.Role;
import org.polimi.andreaperotti.model.RoleName;
import org.polimi.andreaperotti.model.User;
import org.polimi.andreaperotti.repository.PrenRepository;
import org.polimi.andreaperotti.repository.RoleRepository;
import org.polimi.andreaperotti.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.management.relation.RoleNotFoundException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// REST CONTROLLER che comprende tutte le API relative all'utente.
@RestController
@CrossOrigin(origins = "*", maxAge = 3600) // Accetto richieste da qualsiasi origine.
public class UserRestAPIs {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PrenRepository prenRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    // API che passato lo username dell'utente, ne restituisce i rispettivi ruoli.
    @PostMapping("/api/user/get_auth")
    public ResponseEntity<List<RoleName>> getAuthorities (@RequestBody AuthRequest userRequest){
        // Retrieve utente conoscendo username.
        User u = userRepository.findByUsername(userRequest.getUsername())
                .orElseThrow(() ->
                        new UsernameNotFoundException("Utente non trovato -> username o email : " + userRequest.getUsername())
                );

        // Ottengo il Set di ruoli dell'utente (se trovato).
        Set<Role> rolesSet = u.getRoles();

        // Creo lista vuota di RoleName.
        List<RoleName> rolesList = new ArrayList<>();

        // Ciclo per salvare nella lista tutti i nomi dei ruoli contenuti in rolesSet.
        for (Role r : rolesSet){
            rolesList.add(r.getName());
        }

        // Comunico ruoli al FE.
        return ResponseEntity.ok().body(rolesList);
    }

    // API che passato lo username dell'utente, ne restituisce tutte le relative prenotazioni.
    @PostMapping("api/user/get")
    public ResponseEntity<List<UserPrenotationsList>> getAllPrenByUsername (@RequestBody AuthRequest userRequest){
        // Memorizzo username utente passatomi dal FE.
        String username = userRequest.getUsername();

        // Retrieve utente conoscendo username.
        User u = userRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("Utente non trovato -> username o email : " + userRequest.getUsername())
        );

        // Creo lista di oggetti(data, prezzo, parrucchiere) per response al FE.
        List<UserPrenotationsList> listaDate = new ArrayList<>();

        // Ottengo tutte le prenotazioni relative all'utente.
        List<Prenotazione> listaPren = u.getPrenotazioni();

        // Ciclo per inserire tutte le prenotazioni in listaDate in base a quelle trovate nel DB.
        for (Prenotazione p : listaPren){
            User parr = userRepository.findById(p.getParrucchiere().getId()).orElseThrow(() ->
                    new UsernameNotFoundException("Utente non trovato -> username o email : " + userRequest.getUsername())
            );

            // Aggiungo oggetto prenotazione.
            listaDate.add(new UserPrenotationsList(p.getDataPrenotazione(), p.getPrezzo(), parr.getName()));
        }

        // Ordino la lista appena creato per date crescenti.
        Collections.sort(listaDate, new Comparator<Object>() {
            public int compare(Object o1, Object o2) {
                return (((UserPrenotationsList)o1).getDate()).compareTo(((UserPrenotationsList)o2).getDate());
            }
        });

        // Comunico al FE risultato.
        return ResponseEntity.ok().body(listaDate);
    }

    // API che passato lo username dell'utente, ne restituisce tutte le informazioni.
    @PostMapping("api/user/get_info")
    public ResponseEntity<UserInfoResponse> getInfoByUsername (@RequestBody AuthRequest userRequest){
        // Memorizzo username utente dalla request del FE.
        String username = userRequest.getUsername();

        // Retrieve utente conoscendo username
        User u = userRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("Utente non trovato -> username o email : " + username)
        );

        // Scompongo nome e cognome (arrivano in forma "Marco Rossi", dunque li splitto).
        String nomeECognome = u.getName();
        String nC [] = nomeECognome.split(" ");

        // Creo response da inviare al FE.
        UserInfoResponse userInfoResponse = new UserInfoResponse();

        // Imposto i relativi campi.
        userInfoResponse.setEmail(u.getEmail());
        userInfoResponse.setNome(nC[0]);
        userInfoResponse.setCognome(nC[1]);
        userInfoResponse.setTelefono(u.getPhone());

        // Comunico al FE l'esito.
        return ResponseEntity.ok().body(userInfoResponse);
    }

    // API che passate le info dell'utente, le aggiorna.
    @PostMapping("api/user/update_info")
    public ResponseEntity<Boolean> updateInfos(@RequestBody UpdateRequest updateRequest){
        // Memorizzo username passato tramite la request dal FE.
        String username = updateRequest.getUsername();

        // Retrieve utente conoscendo username.
        User u = userRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("Utente non trovato -> username o email : " + username)
        );

        // Imposto i campi dell'utente (se trovato) a quelli nuovi.
        u.setName(updateRequest.getFullName());
        u.setEmail(updateRequest.getEmail());
        u.setPhone(updateRequest.getTelefono());

        // Salvo utente nel DB.
        userRepository.save(u);

        // Comunico esito al FE.
        return ResponseEntity.ok().body(Boolean.TRUE);
    }

    // API che restistuisce la lista di parrucchieri.
    @PostMapping("api/user/getStylists")
    public ResponseEntity<List<StylistResponse>> getStylists () throws RoleNotFoundException {
        // Retrieve Ruolo conoscendone il nome (Costante e memorizzato in Rolename - enum)
        Role r = roleRepository.findByName(RoleName.ROLE_PM)
                .orElseThrow(() ->
                        new RoleNotFoundException("Ruolo non trovato -> nome : " + RoleName.ROLE_PM)
                );

        // Retrieve della lista di parrucchieri all'interno del DB.
        List<User> parrucchieri = userRepository.findAllByRolesContains(r);

        // Creo lista di ID e nomi parrucchieri (vuota inizialmente).
        List<StylistResponse> pFE = new ArrayList<>();

        // Lambda expression per aggiungere tutti gli i parrucchieri alla lista apposita pFE.
        parrucchieri.forEach(p -> pFE.add(new StylistResponse(p.getName(), p.getId())));

        // Comunico esito al FE.
        return ResponseEntity.ok().body(pFE);
    }

    // API che mi passata data di inizio, data di fine e parrucchiere, mi restituisce i guadagni del periodo.
    @PostMapping("api/user/analytics")
    public ResponseEntity<List<Integer>> getAnalytics (@RequestBody AnalyticsRequest analyticsRequest){
        // Retrieve parrucchiere conoscendo username.
        User parr = userRepository.findByUsername(analyticsRequest.getHairstyler()).orElseThrow(() ->
                new UsernameNotFoundException("Utente non trovato -> username o email : " + analyticsRequest.getHairstyler())
        );

        // Ottengo lista dei prezzi di ciascun guadagno (sommatoria giornaliera).
        List<Integer> listaPrezzi = prenRepository.getEarnings(parr.getId(), analyticsRequest.getDataInizio(), analyticsRequest.getDataFine());

        // Ottengo lista delle date (ciascun giorno del periodo)
        List<Date> listaDate = prenRepository.getDateEarnings(parr.getId(), analyticsRequest.getDataInizio(), analyticsRequest.getDataFine());

        // Creo e popolo lista di "data | guadagno".
        List<AnalyticsResponse> listResponse = new ArrayList<>();
        for (int i = 0; i < listaPrezzi.size(); i++){
            listResponse.add(new AnalyticsResponse(listaDate.get(i), listaPrezzi.get(i)));
        }
        // Questa lista sarà incompleta dei giorni in cui non ci sarà nessuna prenotazione.

        // Creo LocalDate delle date passatomi nella richiesta FE.
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String d1 = dateFormat.format(analyticsRequest.getDataInizio());
        String d2 = dateFormat.format(analyticsRequest.getDataFine());
        DateTimeFormatter pattern = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate data1 = LocalDate.parse(d1, pattern);
        LocalDate data2 = LocalDate.parse(d2, pattern);

        // Calcolo il numero di giorni di differenza tra la data iniziale e finale.
        long numOfDays = ChronoUnit.DAYS.between(data1, data2);

        // Creo lista completa dei giorni compresi tra data inizio e data fine.
        List<LocalDate> listOfDates = Stream.iterate(data1, date -> date.plusDays(1))
                .limit(numOfDays)
                .collect(Collectors.toList());

        // Creo lista finale (sarà il risultato del merge tra la lista vuota e quella con i guadagni trovati.
        List<Integer> listaFinale = new ArrayList<>();

        // Flag che mi permette di segnalare se ho trovato o meno un guadagno per quella giornata.
        boolean flag = false;

        // Verifico che la lista delle date abbia dimensione maggiore di quella della response
        // altrimenti non dovrei fare nulla.
        if (listOfDates.size() > listResponse.size()){

            // Ciclo per scorrere le Localdate nella lista delle date.
            for (LocalDate l : listOfDates){

                // Ciclo per scorrere lista di response ottenute.
                for (AnalyticsResponse aR : listResponse){

                    // Ottengo la data relativa alla prenotazione e la converto in stringa.
                    String strApp = dateFormat.format(aR.getDataPrenotazione());

                    // Creo LocalDate di appoggio in base alla data letta sopra (String).
                    LocalDate app = LocalDate.parse(strApp, pattern);

                    // Verifico che la data trovata nelle response sia uguale a quella presente
                    // nella date, se si modifico il prezzo in lista finale, imposto il flag a true
                    // e smetto di scorrere per la giornata in corso.
                    if (app.isEqual(l)){
                        listaFinale.add(aR.getSommaPrezzo());
                        flag = true;
                        break;
                    }
                }

                // Se flag == Boolean.FALSE, non ho trovato corrispondenze,
                // allora aggiungo 0 come prezzo.
                if (!flag){
                    listaFinale.add(0);
                }

                // Resetto il flag.
                flag = false;
            }
        }

        // Comunico esito a FE.
        return ResponseEntity.ok().body(listaFinale);
    }

    // API che passato username utente, mi restituisce il suo ID.
    @PostMapping("api/user/getId")
    public ResponseEntity<Long> getIdFromUsername (@RequestBody AuthRequest authRequest){
        // Retrieve utente conoscendo username.
        User u = userRepository.findByUsername(authRequest.getUsername()).orElseThrow(() ->
                new UsernameNotFoundException("Utente non trovato -> username o email : " + authRequest.getUsername())
        );

        // Comunico esito a FE.
        return ResponseEntity.ok().body(u.getId());
    }

}
