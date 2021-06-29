package org.polimi.andreaperotti.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.polimi.andreaperotti.model.Role;
import org.polimi.andreaperotti.model.RoleName;

// JPA REPOSITORY dedicata alle query relative ai ruoli.
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Query per ottenere un ruolo conoscendone il nome.
    Optional<Role> findByName(RoleName roleName);
}
