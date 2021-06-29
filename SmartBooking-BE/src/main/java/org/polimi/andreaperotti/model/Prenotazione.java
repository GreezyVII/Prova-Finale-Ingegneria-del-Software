package org.polimi.andreaperotti.model;

import javax.persistence.*;
import java.util.Date;

// ENTITY per identificare una prenotazione nel DB.
@Entity
@Table(name = "prenotazioni")
public class Prenotazione {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer prezzo;
    private Date dataPrenotazione;

    @ManyToOne
    @JoinColumn(name = "idUtente", nullable = false)
    private User utente;

    @OneToOne
    private User parrucchiere;

    public Prenotazione(){}

    public Prenotazione(Long id, Integer prezzo, Date dataPrenotazione, User utente) {
        this.id = id;
        this.prezzo = prezzo;
        this.dataPrenotazione = dataPrenotazione;
        this.utente = utente;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDataPrenotazione() {
        return dataPrenotazione;
    }

    public void setDataPrenotazione(Date dataPrenotazione) {
        this.dataPrenotazione = dataPrenotazione;
    }

    public Integer getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(Integer prezzo) {
        this.prezzo = prezzo;
    }

    public User getUtente() {
        return utente;
    }

    public void setUtente(User utente) {
        this.utente = utente;
    }

    public User getParrucchiere() {
        return parrucchiere;
    }

    public void setParrucchiere(User parrucchiere) {
        this.parrucchiere = parrucchiere;
    }

}
