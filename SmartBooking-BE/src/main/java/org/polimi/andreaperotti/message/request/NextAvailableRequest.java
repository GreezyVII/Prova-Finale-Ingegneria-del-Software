package org.polimi.andreaperotti.message.request;

import javax.validation.constraints.NotBlank;

public class NextAvailableRequest {
    @NotBlank
    private Long hairstyler;

    public Long getHairstyler() {
        return hairstyler;
    }

    public void setHairstyler(Long hairstyler) {
        this.hairstyler = hairstyler;
    }
}
