package org.polimi.andreaperotti.controller;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.polimi.andreaperotti.message.request.LoginForm;
import org.polimi.andreaperotti.message.request.SignUpForm;
import org.polimi.andreaperotti.message.response.JwtResponse;
import org.polimi.andreaperotti.model.Role;
import org.polimi.andreaperotti.model.RoleName;
import org.polimi.andreaperotti.model.User;
import org.polimi.andreaperotti.repository.RoleRepository;
import org.polimi.andreaperotti.repository.UserRepository;
import org.polimi.andreaperotti.security.jwt.JwtProvider;

// REST CONTROLLER per gestire tutta la parte dell'autenticazione dell'utente (tramite token JWT)
@CrossOrigin(origins = "*", maxAge = 3600) // Accetto richieste da qualsiasi origine.
@RestController
@RequestMapping("/api/auth") // Notazione anteposta ad ogni chiamata a ciascuna API.
public class AuthRestAPIs {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtProvider jwtProvider;

    // API che mi permette di autenticare l'utente tramite email e password.
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginForm loginRequest) {
        // Verifico se posso autenticare l'utente con le credenziali fornite.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Ottengo token JWT in base all'utente loggato.
        String jwt = jwtProvider.generateJwtToken(authentication);
        JwtResponse jwtResponse = new JwtResponse(jwt);

        // Cerco utente tramite username.
        User u = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(()-> new RuntimeException("Utente inesistente!"));

        // Ottengo tutti i ruoli relativi all'utente loggato.
        List<String> ruoli = new ArrayList<>();
        for (Role r : u.getRoles()){
            ruoli.add(r.getName().toString());
        }

        // Salvo i ruoli nella response che comunicherò al FE.
        // Mi serviranno per gestire accessi e permessi alle varie pagine del FE.
        jwtResponse.setRuoli(ruoli);
        return ResponseEntity.ok(jwtResponse);
    }

    // API che ricevuti i dati necessari (definiti in signUpRequest) registra un utente nel DB.
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody SignUpForm signUpRequest) {
        // Verifico che lo username inserito non sia già presente nel DB.
        if(userRepository.existsByUsername(signUpRequest.getUsername())) {
            return new ResponseEntity<String>("Errore -> Username già usato!",
                    HttpStatus.BAD_REQUEST);
        }

        // Verifico che l'email inserita non sia già presente nel DB.
        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new ResponseEntity<String>("Errore -> Email già usata!",
                    HttpStatus.BAD_REQUEST);
        }

        // Creazione account utente.
        User user = new User(signUpRequest.getName(), signUpRequest.getUsername(),
                signUpRequest.getEmail(), encoder.encode(signUpRequest.getPassword()), signUpRequest.getPhone());

        // Ottengo i ruoli dalla richiesta effettuata (inizialmente vuoti).
        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        // Di base aggiungo i permessi base -> ROLE_USER
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Errore! -> Impossibile trovare ruolo utente."));
        roles.add(userRole);

        // Se l'utente registrato è un parrucchiere, aggiungo i permessi necessari -> ROLE_PM
        if (signUpRequest.getChecked()){
            Role pRole = roleRepository.findByName(RoleName.ROLE_PM)
                    .orElseThrow(() -> new RuntimeException("Errore! -> Impossibile trovare ruolo parrucchiere."));
            roles.add(pRole);
        }

        // Imposto all'utente inserito i ruoli caricati.
        user.setRoles(roles);

        // Salvo utente nel DB.
        userRepository.save(user);

        // Comunico esito positivo.
        return ResponseEntity.ok().body("Utente registrato correttamente!");
    }
}
