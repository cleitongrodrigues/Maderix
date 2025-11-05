package com.maderix.backend.dto;

public class LoginRequestDTO {

    private String nmLogin;
    private String senhaPura;

    public LoginRequestDTO(){}

    public String getNmLogin() {
        return this.nmLogin;
    }
    public void setNmLogin(String nmLogin) {
        this.nmLogin = nmLogin;
    }
    public String getSenhaPura() {
        return this.senhaPura;
    }
    public void setSenhaPura(String senhaPura) {
        this.senhaPura = senhaPura;
    }
}
