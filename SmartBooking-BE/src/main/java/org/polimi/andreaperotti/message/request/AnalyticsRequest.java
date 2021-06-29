package org.polimi.andreaperotti.message.request;

import java.util.Date;

public class AnalyticsRequest {
    private String hairstyler;
    private Date dataInizio;
    private Date dataFine;

    public AnalyticsRequest(String hairstyler, Date dataInizio, Date dataFine) {
        this.hairstyler = hairstyler;
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;
    }

    public String getHairstyler() {
        return hairstyler;
    }

    public void setHairstyler(String hairstyler) {
        this.hairstyler = hairstyler;
    }

    public Date getDataInizio() {
        return dataInizio;
    }

    public void setDataInizio(Date dataInizio) {
        this.dataInizio = dataInizio;
    }

    public Date getDataFine() {
        return dataFine;
    }

    public void setDataFine(Date dataFine) {
        this.dataFine = dataFine;
    }
}
