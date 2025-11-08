package com.maderix.backend.dto;

public class LoginResponseDTO {

    private String token;
    private UsuarioResponseDTO usuario;

    public LoginResponseDTO(String token, UsuarioResponseDTO usuario) {
        this.token = token;
        this.usuario = usuario;
    }

    public LoginResponseDTO() {
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UsuarioResponseDTO getUsuario() {
        return this.usuario;
    }

    public void setUsuario(UsuarioResponseDTO usuario) {
        this.usuario = usuario;
    }


}
