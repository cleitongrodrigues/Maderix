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
    private Integer idToken;

    @OneToOne
    @JoinColumn(name = "ID_Usuario", nullable = false)
    private Usuarios usuario;

    @Column(name = "Token", length = 200, nullable = false, unique = true)
    private String token;

    @Column(name = "Email_Destinatario", length = 100, nullable = false)
    private String emailDestinatario;

    @Column(name = "Data_Criacao", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dataCriacao;

    @Column(name = "Data_Expiracao", nullable = false)
    private LocalDateTime dataExpiracao;

    @Column(name = "Utilizado", nullable = false)
    private Boolean utilizado = false;

    @Column(name = "Data_Utilizacao", nullable = true)
    private LocalDateTime dataUtilizacao;

    @Column(name = "IP_Solicitacao", length = 50, nullable = true)
    private String ipSolicitacao;

    @Column(name = "IP_Utilizacao", length = 50, nullable = true)
    private String ipUtilizacao;


    public TokensRecuperacao() {
    }

    public Integer getIdToken() {
        return this.idToken;
    }

    public void setIdToken(Integer ID_Token) {
        this.idToken = ID_Token;
    }

    public Usuarios getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuarios usuario) {
        this.usuario = usuario;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmailDestinatario() {
        return this.emailDestinatario;
    }

    public void setEmailDestinatario(String emailDestinatario) {
        this.emailDestinatario = emailDestinatario;
    }

    public LocalDateTime getDataCriacao() {
        return this.dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getDataExpiracao() {
        return this.dataExpiracao;
    }

    public void setDataExpiracao(LocalDateTime dataExpiracao) {
        this.dataExpiracao = dataExpiracao;
    }

    public Boolean isUtilizado() {
        return this.utilizado;
    }

    public Boolean getUtilizado() {
        return this.utilizado;
    }

    public void setUtilizado(Boolean utilizado) {
        this.utilizado = utilizado;
    }

    public LocalDateTime getDataUtilizacao() {
        return this.dataUtilizacao;
    }

    public void setDataUtilizacao(LocalDateTime Data_Utilizacao) {
        this.dataUtilizacao = Data_Utilizacao;
    }

    public String getIpSolicitacao() {
        return this.ipSolicitacao;
    }

    public void setIpSolicitacao(String IP_Solicitacao) {
        this.ipSolicitacao = IP_Solicitacao;
    }

    public String getIpUtilizacao() {
        return this.ipUtilizacao;
    }

    public void setIpUtilizacao(String IP_Utilizacao) {
        this.ipUtilizacao = IP_Utilizacao;
    }
}
