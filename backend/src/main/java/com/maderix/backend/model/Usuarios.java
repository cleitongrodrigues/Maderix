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
    private Empresa ID_Empresa;

    @ManyToOne
    @JoinColumn(name = "ID_Perfil", nullable = false)
    private Integer ID_Perfil;

    @Column(name = "NM_Usuario", length = 150, nullable = false)
    private String NM_Usuario;

    @Column(name = "Email", length = 100, nullable = false, unique = true)
    private String Email;

    @Column(name = "Tel_Usuario", length = 20)
    private String Tel_Usuario;

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

    public Empresa getID_Empresa() {
        return ID_Empresa;
    }

    public void setID_Empresa(Empresa ID_Empresa) {
        this.ID_Empresa = ID_Empresa;
    }

    public Integer getID_Perfil() {
        return ID_Perfil;
    }

    public void setID_Perfil(Integer ID_Perfil) {
        this.ID_Perfil = ID_Perfil;
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
}
