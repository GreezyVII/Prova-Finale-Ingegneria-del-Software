package org.polimi.andreaperotti.security.jwt;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import org.polimi.andreaperotti.security.services.UserPrinciple;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

// Component che crea il token JWT.
@Component
public class JwtProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtProvider.class);

    @Value("${org.polimi.andreaperotti.app.jwtSecret}")
    private String jwtSecret;

    @Value("${org.polimi.andreaperotti.app.jwtExpiration}")
    private int jwtExpiration;

    // Metodo per generare il token una volta autenticato.
    public String generateJwtToken(Authentication authentication) {
        UserPrinciple userPrincipal = (UserPrinciple) authentication.getPrincipal();
        return Jwts.builder()
		                .setSubject((userPrincipal.getUsername()))
		                .setIssuedAt(new Date())
		                .setExpiration(new Date((new Date()).getTime() + jwtExpiration*1000))
		                .signWith(SignatureAlgorithm.HS512, jwtSecret)
		                .compact();
    }

    // Metodo per validare token JWT.
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Firma del Token JWT non valida -> Messaggio: {} ", e);
        } catch (MalformedJwtException e) {
            logger.error("Token JWT non valido -> Messaggio: {}", e);
        } catch (ExpiredJwtException e) {
            logger.error("Token JWT scaduto -> Messaggio: {}", e);
        } catch (UnsupportedJwtException e) {
            logger.error("Token JWT non supportato -> Messaggio: {}", e);
        } catch (IllegalArgumentException e) {
            logger.error("Messaggio: {}", e);
        }
        
        return false;
    }

    // Metodo per ottenere username dal token JWT.
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
			                .setSigningKey(jwtSecret)
			                .parseClaimsJws(token)
			                .getBody().getSubject();
    }
}
