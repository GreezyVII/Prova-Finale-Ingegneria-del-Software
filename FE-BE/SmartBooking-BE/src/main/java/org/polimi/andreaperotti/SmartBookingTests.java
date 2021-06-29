package org.polimi.andreaperotti;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.polimi.andreaperotti.model.Prenotazione;
import org.polimi.andreaperotti.model.Role;
import org.polimi.andreaperotti.model.RoleName;
import org.polimi.andreaperotti.model.User;
import org.polimi.andreaperotti.repository.PrenRepository;
import org.polimi.andreaperotti.repository.RoleRepository;
import org.polimi.andreaperotti.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.junit4.SpringRunner;
import org.junit.Assert;

import java.util.Date;
import java.util.HashSet;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertFalse;

// Classe in cui vi sono tutti i test effettuati per testare
// API e funzionalità CRUD per tutte le repository creato nell'apposito package.
@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class SmartBookingTests {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository utenteRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PrenRepository prenRepository;

    // Test per verificare salvataggio utente.
    @Test
    public void testSalvaUtente(){
        User utente = new User();
        utente.setName("Andrea Perotti");
        utente.setEmail("aperotti2000@icloud.com");
        utente.setUsername("andrea_perotti");
        HashSet<Role> ruoli = new HashSet<>();
        Role r = new Role();
        r.setName(RoleName.ROLE_USER);
        ruoli.add(r);
        utente.setPhone("3917078626");
        utente.setPassword("12345678");
        entityManager.persist(utente);

        assertThat(utente).hasFieldOrPropertyWithValue("name", "Andrea Perotti");
        assertThat(utente).hasFieldOrPropertyWithValue("username", "andrea_perotti"); // Fallirà se username già presente nel DB
        assertThat(utente).hasFieldOrPropertyWithValue("email", "aperotti2000@icloud.com"); // Fallirà se email già presente nel DB
    }

    // Test per verificare di poter ottenere un utente fornito un ID o uno username.
    @Test
    public void testGetUtente(){
        User utente = new User();
        utente.setName("Andrea Perotti");
        utente.setEmail("aperotti2000@icloud.com");
        utente.setUsername("andrea_perotti");
        HashSet<Role> ruoli = new HashSet<>();
        Role r = new Role();
        r.setName(RoleName.ROLE_USER);
        ruoli.add(r);
        utente.setPhone("3917078626");
        utente.setPassword("12345678");
        entityManager.persist(utente);

        User utente1 = new User();
        utente1.setName("Mario Rossi");
        utente1.setEmail("mariorossi@icloud.com");
        utente1.setUsername("mario_rossi");
        HashSet<Role> ruoli1 = new HashSet<>();
        Role r1 = new Role();
        r1.setName(RoleName.ROLE_USER);
        ruoli1.add(r1);
        utente1.setPhone("3917078626");
        utente1.setPassword("12345678");
        entityManager.persist(utente1);

        User persona = utenteRepository.findById(utente1.getId()).get();
        User persona2 = utenteRepository.findByUsername(utente.getUsername()).get();
        assertThat(persona.getName()).isEqualTo(utente1.getName());
        assertThat(persona2.getUsername()).isEqualTo(utente.getUsername());
        assertThat(persona.getEmail()).isEqualTo("mariorossi@icloud.com");
    }

    // Test per verificare di poter aggiornare i dati di un utente già inserito.
    @Test
    public void testUpdateUtente(){
        User utente = new User();
        utente.setName("Andrea Perotti");
        utente.setEmail("aperotti2000@icloud.com");
        utente.setUsername("andrea_perotti");
        HashSet<Role> ruoli = new HashSet<>();
        Role r = new Role();
        r.setName(RoleName.ROLE_USER);
        ruoli.add(r);
        utente.setPhone("3917078626");
        utente.setPassword("12345678");
        entityManager.persist(utente);

        User nuovoUtente = new User();
        nuovoUtente.setName("Mario Rossi");
        nuovoUtente.setEmail("mariorossi@icloud.com");
        nuovoUtente.setUsername("mario_rossi");
        HashSet<Role> ruoli1 = new HashSet<>();
        Role r1 = new Role();
        r1.setName(RoleName.ROLE_USER);
        ruoli1.add(r1);
        nuovoUtente.setPhone("3917078626");
        nuovoUtente.setPassword("12345678");
        entityManager.persist(nuovoUtente);

        User oldUtente = utenteRepository.findById(utente.getId()).get();
        oldUtente.setName(nuovoUtente.getName());
        oldUtente.setUsername(nuovoUtente.getUsername());
        oldUtente.setPassword(nuovoUtente.getPassword());

        entityManager.persist(oldUtente);

        User updatedUtente = utenteRepository.findById(utente.getId()).get();
        assertThat(updatedUtente.getName()).isEqualTo(nuovoUtente.getName());
        assertThat(updatedUtente.getUsername()).isEqualTo("mario_rossi");
    }

    // Test per verificare di poter eliminare tutti gli utenti dal DB.
    @Test
    public void testEliminaUtenti(){
        User utente = new User();
        utente.setName("Andrea Perotti");
        utente.setEmail("aperotti2000@icloud.com");
        utente.setUsername("andrea_perotti");
        HashSet<Role> ruoli = new HashSet<>();
        Role r = new Role();
        r.setName(RoleName.ROLE_USER);
        ruoli.add(r);
        utente.setPhone("3917078626");
        utente.setPassword("12345678");
        entityManager.persist(utente);

        User nuovoUtente = new User();
        nuovoUtente.setName("Mario Rossi");
        nuovoUtente.setEmail("mariorossi@icloud.com");
        nuovoUtente.setUsername("mario_rossi");
        HashSet<Role> ruoli1 = new HashSet<>();
        Role r1 = new Role();
        r1.setName(RoleName.ROLE_USER);
        ruoli1.add(r1);
        nuovoUtente.setPhone("3917078626");
        nuovoUtente.setPassword("12345678");
        entityManager.persist(nuovoUtente);

        List<User> utenti =  utenteRepository.findAll();
        assertThat(utenti).contains(utente, nuovoUtente);

        utenteRepository.delete(utente);
        assertThat(utenti).contains(utente);
        assertThat(utenti).contains(nuovoUtente);
    }

    // Test per verificare se è possibile ottenere un utente tramite il suo username.
    @Test
    public void testGetUtenteByUsername() {
        User utente = new User();
        utente.setName("Andrea Perotti");
        utente.setEmail("aperotti2000@icloud.com");
        utente.setUsername("andrea_perotti");
        HashSet<Role> ruoli = new HashSet<>();
        Role r = new Role();
        r.setName(RoleName.ROLE_USER);
        ruoli.add(r);
        utente.setPhone("3917078626");
        utente.setPassword("12345678");
        entityManager.persist(utente);

        User app = utenteRepository.findByUsername("andrea_perotti").orElseThrow(
                () ->
                        new UsernameNotFoundException("Utente non trovato -> username o email : " + "andrea_perotti")
        );

        assertThat(app.getEmail()).isEqualTo("aperotti2000@icloud.com");
    }

    // Test per verificare che sia possibile controllare se un utente esiste tramite username e/o email
    @Test
    public void testExistsByUsername(){
        User utente = new User();
        utente.setName("Andrea Perotti");
        utente.setEmail("aperotti2000@icloud.com");
        utente.setUsername("andrea_perotti");
        HashSet<Role> ruoli = new HashSet<>();
        Role r = new Role();
        r.setName(RoleName.ROLE_USER);
        ruoli.add(r);
        utente.setPhone("3917078626");
        utente.setPassword("12345678");
        entityManager.persist(utente);

        Boolean usFlag = utenteRepository.existsByUsername("andrea_perotti");
        Boolean emailFlag = utenteRepository.existsByEmail("aperotti2000@icloud.com");

        Assert.assertTrue(usFlag);
        Assert.assertTrue(emailFlag);
    }

    // Test per verificare la possibilità di ottenere tutti gli utenti con un determinato ruolo.
    // Test per verificare la possibilità di ottenere un ruolo conoscendone il nome
    @Test
    public void testGetAllByRole(){
        User utente = new User();
        utente.setName("Andrea Perotti");
        utente.setEmail("aperotti2000@icloud.com");
        utente.setUsername("andrea_perotti");
        HashSet<Role> ruoli = new HashSet<>();
        Role r = new Role();
        r.setName(RoleName.ROLE_PM);
        ruoli.add(r);
        utente.setPhone("3917078626");
        utente.setPassword("12345678");
        entityManager.persist(utente);

        User nuovoUtente = new User();
        nuovoUtente.setName("Mario Rossi");
        nuovoUtente.setEmail("mariorossi@icloud.com");
        nuovoUtente.setUsername("mario_rossi");
        HashSet<Role> ruoli1 = new HashSet<>();
        Role r1 = new Role();
        r1.setName(RoleName.ROLE_PM);
        ruoli1.add(r1);
        nuovoUtente.setPhone("3917078626");
        nuovoUtente.setPassword("12345678");
        entityManager.persist(nuovoUtente);

        Role r2 = roleRepository.findByName(RoleName.ROLE_PM).orElseThrow(
                () ->
                        new UsernameNotFoundException("Ruolo non trovato -> nome : " + RoleName.ROLE_PM)
        );
        List<User> parrucchieri = utenteRepository.findAllByRolesContains(r2);

        assertFalse(parrucchieri.isEmpty());
    }

    // Test per verificare se è possiibile ottenere una prenotazione conosciuto parrucchiere e data della stessa
    @Test
    public void testGetPrenotazioneByParrucchiereAndData(){
        User parrucchiere = new User();
        parrucchiere.setName("Andrea Perotti");
        parrucchiere.setEmail("aperotti2000@icloud.com");
        parrucchiere.setUsername("andrea_perotti");
        HashSet<Role> ruoli = new HashSet<>();
        Role r = new Role();
        r.setName(RoleName.ROLE_PM);
        ruoli.add(r);
        parrucchiere.setPhone("3917078626");
        parrucchiere.setPassword("12345678");
        entityManager.persist(parrucchiere);

        User cliente = new User();
        cliente.setName("Mario Rossi");
        cliente.setEmail("mariorossi@icloud.com");
        cliente.setUsername("mario_rossi");
        HashSet<Role> ruoli1 = new HashSet<>();
        Role r1 = new Role();
        r1.setName(RoleName.ROLE_USER);
        ruoli1.add(r1);
        cliente.setPhone("3917078626");
        cliente.setPassword("12345678");
        entityManager.persist(cliente);

        Prenotazione p = new Prenotazione();
        p.setParrucchiere(parrucchiere);
        p.setPrezzo(15);
        p.setUtente(cliente);
        Date d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        p.setDataPrenotazione(d);
        entityManager.persist(p);

        Prenotazione found = prenRepository.findPrenotazioneByDataPrenotazioneAndParrucchiere(d, parrucchiere);

        assertThat(found.getParrucchiere().getEmail()).isEqualTo("aperotti2000@icloud.com");
        assertThat(found.getUtente().getEmail()).isEqualTo("mariorossi@icloud.com");
    }

    // Test per verificare se è possibile ottenere una lista di prenotazioni conoscendo parrucchiere e data.
    @Test
    public void testGetAllByDataAndParrucchiere(){
        User parrucchiere = new User();
        parrucchiere.setName("Andrea Perotti");
        parrucchiere.setEmail("aperotti2000@icloud.com");
        parrucchiere.setUsername("andrea_perotti");
        HashSet<Role> ruoli = new HashSet<>();
        Role r = new Role();
        r.setName(RoleName.ROLE_PM);
        ruoli.add(r);
        parrucchiere.setPhone("3917078626");
        parrucchiere.setPassword("12345678");
        entityManager.persist(parrucchiere);

        User cliente = new User();
        cliente.setName("Mario Rossi");
        cliente.setEmail("mariorossi@icloud.com");
        cliente.setUsername("mario_rossi");
        HashSet<Role> ruoli1 = new HashSet<>();
        Role r1 = new Role();
        r1.setName(RoleName.ROLE_USER);
        ruoli1.add(r1);
        cliente.setPhone("3917078626");
        cliente.setPassword("12345678");
        entityManager.persist(cliente);

        Prenotazione p = new Prenotazione();
        p.setParrucchiere(parrucchiere);
        p.setPrezzo(15);
        p.setUtente(cliente);
        Date d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        p.setDataPrenotazione(d);
        entityManager.persist(p);

        Prenotazione p1 = new Prenotazione();
        p1.setParrucchiere(parrucchiere);
        p1.setPrezzo(15);
        p1.setUtente(cliente);
        Date d1= new Date();
        d1.setDate(d.getDate()+1);
        d1.setHours(0);
        d1.setMinutes(0);
        d1.setSeconds(0);
        p1.setDataPrenotazione(d1);
        entityManager.persist(p1);

        List<Prenotazione> prenotazioneList = prenRepository.findAllByDataAndParrucchiere(d, d1, parrucchiere);

        assertFalse (prenotazioneList.isEmpty());
    }

    // Test per verificare se è possibile ottenere i guadagni di un parrucchiere fornita una data di inizio ed una di fine.
    @Test
    public void testGetEarnings(){
        User parrucchiere = new User();
        parrucchiere.setName("Andrea Perotti");
        parrucchiere.setEmail("aperotti2000@icloud.com");
        parrucchiere.setUsername("andrea_perotti");
        HashSet<Role> ruoli = new HashSet<>();
        Role r = new Role();
        r.setName(RoleName.ROLE_PM);
        ruoli.add(r);
        parrucchiere.setPhone("3917078626");
        parrucchiere.setPassword("12345678");
        entityManager.persist(parrucchiere);

        User cliente = new User();
        cliente.setName("Mario Rossi");
        cliente.setEmail("mariorossi@icloud.com");
        cliente.setUsername("mario_rossi");
        HashSet<Role> ruoli1 = new HashSet<>();
        Role r1 = new Role();
        r1.setName(RoleName.ROLE_USER);
        ruoli1.add(r1);
        cliente.setPhone("3917078626");
        cliente.setPassword("12345678");
        entityManager.persist(cliente);

        Prenotazione p = new Prenotazione();
        p.setParrucchiere(parrucchiere);
        p.setPrezzo(15);
        p.setUtente(cliente);
        Date d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        p.setDataPrenotazione(d);
        entityManager.persist(p);

        Prenotazione p1 = new Prenotazione();
        p1.setParrucchiere(parrucchiere);
        p1.setPrezzo(17);
        p1.setUtente(cliente);
        Date d1= new Date();
        d1.setDate(d.getDate()+1);
        d1.setHours(0);
        d1.setMinutes(0);
        d1.setSeconds(0);
        p1.setDataPrenotazione(d1);
        entityManager.persist(p1);

        Date dataInizio = new Date();
        dataInizio.setDate(dataInizio.getDate()-3);
        dataInizio.setHours(0);
        dataInizio.setMinutes(0);
        dataInizio.setSeconds(0);

        Date dataFine = new Date();
        dataFine.setDate(dataInizio.getDate()+3);
        dataFine.setHours(0);
        dataFine.setMinutes(0);
        dataFine.setSeconds(0);

        List<Integer> guadagni = prenRepository.getEarnings(parrucchiere.getId(), dataInizio, dataFine);

        assertThat(guadagni.get(0)).isEqualTo(15);
    }
}
