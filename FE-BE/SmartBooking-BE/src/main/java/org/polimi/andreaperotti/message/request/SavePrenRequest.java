package org.polimi.andreaperotti.message.request;

import java.util.Date;

public class SavePrenRequest {
    private Date data;

    private String username;

    private Integer ora;

    private Integer prezzo;

    private Long hairstyler;

    public SavePrenRequest(Date data, String username, Integer ora, Integer prezzo, Long hairstyler) {
        this.data = data;
        this.username = username;
        this.ora = ora;
        this.prezzo = prezzo;
        this.hairstyler = hairstyler;
    }

    public SavePrenRequest(){}

    public Integer getPrezzo() {
        return prezzo;
    }

    public Long getHairstyler() {
        return hairstyler;
    }

    public void setHairstyler(Long hairstyler) {
        this.hairstyler = hairstyler;
    }

    public void setPrezzo(Integer prezzo) {
        this.prezzo = prezzo;
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

    public Integer getOra() {
        return ora;
    }

    public void setOra(Integer ora) {
        this.ora = ora;
    }

    @Override
    public String toString() {
        return "SavePrenRequest{" +
                "data=" + data +
                ", username='" + username + '\'' +
                ", ora=" + ora +
                '}';
    }
}
