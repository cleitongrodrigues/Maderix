package com.maderix.backend.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "TOKENS_RECUPERACAO")
public class TokensRecuperacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Token")
    private Integer ID_Token;

    @OneToOne
    @JoinColumn(name = "ID_Usuario", nullable = false)
    private Usuarios usuario;

    @Column(name = "Token", length = 200, nullable = false, unique = true)
    private String Token;

    @Column(name = "Email_Destinatario", length = 100, nullable = false)
    private String Email_Destinatario;

    @Column(name = "Data_Criacao", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime Data_Criacao;

    @Column(name = "Data_Expiracao", nullable = false)
    private LocalDateTime Data_Expiracao;

    @Column(name = "Utilizado", nullable = false)
    private Boolean Utilizado = false;

    @Column(name = "Data_Utilizacao", nullable = true)
    private LocalDateTime Data_Utilizacao;

    @Column(name = "IP_Solicitacao", length = 50, nullable = true)
    private String IP_Solicitacao;

    @Column(name = "IP_Utilizacao", length = 50, nullable = true)
    private String IP_Utilizacao;


    public TokensRecuperacao() {
    }

    public Integer getID_Token() {
        return this.ID_Token;
    }

    public void setID_Token(Integer ID_Token) {
        this.ID_Token = ID_Token;
    }

    public Usuarios getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuarios usuario) {
        this.usuario = usuario;
    }

    public String getToken() {
        return this.Token;
    }

    public void setToken(String Token) {
        this.Token = Token;
    }

    public String getEmail_Destinatario() {
        return this.Email_Destinatario;
    }

    public void setEmail_Destinatario(String Email_Destinatario) {
        this.Email_Destinatario = Email_Destinatario;
    }

    public LocalDateTime getData_Criacao() {
        return this.Data_Criacao;
    }

    public void setData_Criacao(LocalDateTime Data_Criacao) {
        this.Data_Criacao = Data_Criacao;
    }

    public LocalDateTime getData_Expiracao() {
        return this.Data_Expiracao;
    }

    public void setData_Expiracao(LocalDateTime Data_Expiracao) {
        this.Data_Expiracao = Data_Expiracao;
    }

    public Boolean isUtilizado() {
        return this.Utilizado;
    }

    public Boolean getUtilizado() {
        return this.Utilizado;
    }

    public void setUtilizado(Boolean Utilizado) {
        this.Utilizado = Utilizado;
    }

    public LocalDateTime getData_Utilizacao() {
        return this.Data_Utilizacao;
    }

    public void setData_Utilizacao(LocalDateTime Data_Utilizacao) {
        this.Data_Utilizacao = Data_Utilizacao;
    }

    public String getIP_Solicitacao() {
        return this.IP_Solicitacao;
    }

    public void setIP_Solicitacao(String IP_Solicitacao) {
        this.IP_Solicitacao = IP_Solicitacao;
    }

    public String getIP_Utilizacao() {
        return this.IP_Utilizacao;
    }

    public void setIP_Utilizacao(String IP_Utilizacao) {
        this.IP_Utilizacao = IP_Utilizacao;
    }
}
