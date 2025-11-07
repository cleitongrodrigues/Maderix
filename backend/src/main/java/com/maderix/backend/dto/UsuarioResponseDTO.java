package com.maderix.backend.dto;

import java.time.LocalDateTime;

import com.maderix.backend.model.Usuarios;

public class UsuarioResponseDTO {

    private Integer idUsuario;
    private String nmUsuario;
    private String email;
    private String nmLogin;
    private String nomePerfil;
    private String nomeEmpresa;
    private Boolean ativo;
    private LocalDateTime dtCadUsuario;
    private LocalDateTime ultimoLogin;

    public UsuarioResponseDTO(Usuarios usuario){
        this.idUsuario    = usuario.getID_Usuario();
        this.nmUsuario    = usuario.getnmUsuario();
        this.email        = usuario.getEmail();
        this.nmLogin      = usuario.getnmLogin();
        this.ativo        = usuario.isAtivo();
        this.dtCadUsuario = usuario.getDT_Cad_Usuario();
        this.ultimoLogin  = usuario.getULTIMO_LOGIN();

        if(usuario.getPerfil() != null){
            this.nomePerfil  = usuario.getPerfil().getNM_Perfil();
        }
        if(usuario.getEmpresa() != null){
            this.nomeEmpresa = usuario.getEmpresa().getNM_Fantasia();
        }
    }

    public Integer getIdUsuario() {
        return this.idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNmUsuario() {
        return this.nmUsuario;
    }

    public void setNmUsuario(String nmUsuario) {
        this.nmUsuario = nmUsuario;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNmLogin() {
        return this.nmLogin;
    }

    public void setNmLogin(String nmLogin) {
        this.nmLogin = nmLogin;
    }

    public String getNomePerfil() {
        return this.nomePerfil;
    }

    public void setNomePerfil(String nomePerfil) {
        this.nomePerfil = nomePerfil;
    }

    public String getNomeEmpresa() {
        return this.nomeEmpresa;
    }

    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }

    public Boolean isAtivo() {
        return this.ativo;
    }

    public Boolean getAtivo() {
        return this.ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getDtCadUsuario() {
        return this.dtCadUsuario;
    }

    public void setDtCadUsuario(LocalDateTime dtCadUsuario) {
        this.dtCadUsuario = dtCadUsuario;
    }

    public LocalDateTime getUltimoLogin() {
        return this.ultimoLogin;
    }

    public void setUltimoLogin(LocalDateTime ultimoLogin) {
        this.ultimoLogin = ultimoLogin;
    }
}
