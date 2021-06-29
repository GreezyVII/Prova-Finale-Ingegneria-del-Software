package org.polimi.andreaperotti.message.request;

import javax.validation.constraints.NotBlank;
import java.util.Date;

public class PrenRequest {
    @NotBlank
    private Date data;

    @NotBlank
    private String ora;

    @NotBlank
    private Long hairstyler;

    public Long getHairstyler() {
        return hairstyler;
    }

    public void setHairstyler(Long hairstyler) {
        this.hairstyler = hairstyler;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getOra() {
        return ora;
    }

    public void setOra(String ora) {
        this.ora = ora;
    }
}
