package org.polimi.andreaperotti.security.services;

import org.polimi.andreaperotti.model.User;
import org.polimi.andreaperotti.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Service per gestire autenticazione utente e relative informazioni.
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    // Metodo per ottenre utente conoscendo username.
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
    	// Retrieve utente conoscendo username.
        User user = userRepository.findByUsername(username)
                	.orElseThrow(() -> 
                        new UsernameNotFoundException("Utente non trovato -> username o email : " + username)
        );

        return UserPrinciple.build(user);
    }
}
