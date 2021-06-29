package org.polimi.andreaperotti.repository;

import java.util.List;
import java.util.Optional;

import org.polimi.andreaperotti.model.Role;
import org.polimi.andreaperotti.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// JPA REPOSITORY dedicata alle query relative agli utenti.
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Query per trovare un utente conoscendo username.
    Optional<User> findByUsername(String username);

    // Query per verificare se esiste utente con dato username.
    Boolean existsByUsername(String username);

    // Query per verificare se esiste utente con data email.
    Boolean existsByEmail(String email);

    // Query che restituisce la lista di utenti che hanno un determinato ruolo.
    List<User> findAllByRolesContains(Role r);
}
