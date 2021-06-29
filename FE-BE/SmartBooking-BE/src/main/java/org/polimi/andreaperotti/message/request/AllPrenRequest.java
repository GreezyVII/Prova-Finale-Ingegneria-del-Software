package org.polimi.andreaperotti.message.request;

import javax.validation.constraints.NotBlank;
import java.util.Date;

public class AllPrenRequest {

    @NotBlank
    private Date dataAfter;

    @NotBlank
    private Date dataBefore;

    private Long hairstyler;

    public AllPrenRequest(Date dataAfter, Date dataBefore, Long hairstyler) {
        this.dataAfter = dataAfter;
        this.dataBefore = dataBefore;
        this.hairstyler = hairstyler;
    }

    public Long getHairstyler() {
        return hairstyler;
    }

    public void setHairstyler(Long hairstyler) {
        this.hairstyler = hairstyler;
    }

    public Date getDataAfter() {
        return dataAfter;
    }

    public void setDataAfter(Date dataAfter) {
        this.dataAfter = dataAfter;
    }

    public Date getDataBefore() {
        return dataBefore;
    }

    public void setDataBefore(Date dataBefore) {
        this.dataBefore = dataBefore;
    }
}
