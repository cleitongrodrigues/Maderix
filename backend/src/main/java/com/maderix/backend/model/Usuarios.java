package com.maderix.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "USUARIOS")
public class Usuarios{

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Usuario")
    private Integer ID_Usuario;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "ID_Perfil", nullable = false)
    private PerfisUsuario  perfil;

    @Column(name = "NM_Usuario", length = 150, nullable = false)
    private String NM_Usuario;

    @Column(name = "Email", length = 100, nullable = false, unique = true)
    private String Email;

    @Column(name = "NM_Login", length = 50 ,nullable = false, unique = true)
    private String NM_Login;

    @Column(name = "SENHA_HASH", length = 200, nullable = false)
    private String SENHA_HASH;

    @Column(name = "Tel_Usuario", length = 20)
    private String Tel_Usuario;

    @Column(name = "Ativo", nullable = false)
    private Boolean Ativo = true;

    @Column(name = "ULTIMO_LOGIN", nullable = true)
    private LocalDateTime ULTIMO_LOGIN;

    @Column(name = "Senha", length = 255, nullable = false)
    private String Senha;

    @Column(name = "DT_Cad_Usuario", updatable = false)
    @CreationTimestamp //Registra a data do sistema
    private LocalDateTime DT_Cad_Usuario;

    public Usuarios(){}

    public Integer getID_Usuario() {
        return ID_Usuario;
    }

    public void setID_Usuario(Integer ID_Usuario) {
        this.ID_Usuario = ID_Usuario;
    }

    public Empresa getEmpresa() {
        return this.empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public PerfisUsuario getPerfil() {
        return this.perfil;
    }

    public void setPerfil(PerfisUsuario perfil) {
        this.perfil = perfil;
    }

    public String getNM_Usuario() {
        return NM_Usuario;
    }

    public void setNM_Usuario(String NM_Usuario) {
        this.NM_Usuario = NM_Usuario;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getTel_Usuario() {
        return Tel_Usuario;
    }

    public void setTel_Usuario(String tel_Usuario) {
        Tel_Usuario = tel_Usuario;
    }

    public String getSenha() {
        return Senha;
    }

    public void setSenha(String senha) {
        Senha = senha;
    }

    public LocalDateTime getDT_Cad_Usuario() {
        return DT_Cad_Usuario;
    }

    public void setDT_Cad_Usuario(LocalDateTime DT_Cad_Usuario) {
        this.DT_Cad_Usuario = DT_Cad_Usuario;
    }

    public String getNM_Login() {
        return this.NM_Login;
    }

    public void setNM_Login(String NM_Login) {
        this.NM_Login = NM_Login;
    }

    public String getSENHA_HASH() {
        return this.SENHA_HASH;
    }

    public void setSENHA_HASH(String SENHA_HASH) {
        this.SENHA_HASH = SENHA_HASH;
    }

    public Boolean isAtivo() {
        return this.Ativo;
    }

    public Boolean getAtivo() {
        return this.Ativo;
    }

    public void setAtivo(Boolean Ativo) {
        this.Ativo = Ativo;
    }

    public LocalDateTime getULTIMO_LOGIN() {
        return this.ULTIMO_LOGIN;
    }

    public void setULTIMO_LOGIN(LocalDateTime ULTIMO_LOGIN) {
        this.ULTIMO_LOGIN = ULTIMO_LOGIN;
    }
}
