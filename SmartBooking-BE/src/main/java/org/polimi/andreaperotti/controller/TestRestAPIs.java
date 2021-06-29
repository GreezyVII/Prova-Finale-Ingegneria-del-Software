package org.polimi.andreaperotti.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// REST CONTROLLER che gestisce gli accessi alle relative pagine del FE.
@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class TestRestAPIs {

	// API che mostra componenti in React se i ruoli dell'utente sono "USER" oppure "ADMIN"
	@GetMapping("/api/test/user")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public String userAccess() {
		return ">>> User Contents!";
	}

	// API che mostra componenti in React se i ruoli dell'utente sono "PM" oppure "ADMIN"
	@GetMapping("/api/test/pm")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public String projectManagementAccess() {
		return ">>> Board Management Project";
	}
}
