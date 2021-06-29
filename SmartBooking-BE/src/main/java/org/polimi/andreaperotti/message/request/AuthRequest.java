package org.polimi.andreaperotti.message.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class AuthRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    public AuthRequest(String username) {
        this.username = username;
    }

    public AuthRequest (){}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
