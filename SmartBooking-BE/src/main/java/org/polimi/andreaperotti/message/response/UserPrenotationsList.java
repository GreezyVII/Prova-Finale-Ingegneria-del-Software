package org.polimi.andreaperotti.message.response;

import java.util.Date;

public class UserPrenotationsList {
    private Date date;
    private Integer prezzo;
    private String parrucchiere;

    public UserPrenotationsList(Date date, Integer prezzo, String parrucchiere) {
        this.date = date;
        this.prezzo = prezzo;
        this.parrucchiere = parrucchiere;
    }

    public String getParrucchiere() {
        return parrucchiere;
    }

    public void setParrucchiere(String parrucchiere) {
        this.parrucchiere = parrucchiere;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Integer getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(Integer prezzo) {
        this.prezzo = prezzo;
    }
}
