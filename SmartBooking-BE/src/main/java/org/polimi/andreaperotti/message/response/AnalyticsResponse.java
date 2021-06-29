package org.polimi.andreaperotti.message.response;

import java.util.Date;

public class AnalyticsResponse {
    private Date dataPrenotazione;
    private Integer sommaPrezzo;

    public AnalyticsResponse(Date dataPrenotazione, Integer sommaPrezzo) {
        this.dataPrenotazione = dataPrenotazione;
        this.sommaPrezzo = sommaPrezzo;
    }

    public Date getDataPrenotazione() {
        return dataPrenotazione;
    }

    public void setDataPrenotazione(Date dataPrenotazione) {
        this.dataPrenotazione = dataPrenotazione;
    }

    public Integer getSommaPrezzo() {
        return sommaPrezzo;
    }

    public void setSommaPrezzo(Integer sommaPrezzo) {
        this.sommaPrezzo = sommaPrezzo;
    }
}
