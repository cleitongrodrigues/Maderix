package com.maderix.backend.dto;

public class ResetSenhaRequestDTO {

    private String token;
    private String novaSenhaPura;

    public ResetSenhaRequestDTO(){}

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNovaSenhaPura() {
        return this.novaSenhaPura;
    }

    public void setNovaSenhaPura(String novaSenhaPura) {
        this.novaSenhaPura = novaSenhaPura;
    }

    
}
