package org.polimi.andreaperotti.message.response;

import java.util.Date;

public class PrenotazioneResponse {
    private Date data;
    private String username;
    private Integer prezzo;

    public Integer getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(Integer prezzo) {
        this.prezzo = prezzo;
    }

    public PrenotazioneResponse(Date data, String username, Integer prezzo) {
        this.data = data;
        this.username = username;
        this.prezzo = prezzo;
    }

    public PrenotazioneResponse(Date data, String username) {
        this.data = data;
        this.username = username;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
