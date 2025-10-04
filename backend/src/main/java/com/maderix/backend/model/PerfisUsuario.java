package com.maderix.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "PERFIS_USUARIO")
public class PerfisUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Perfil")
    private Integer ID_Perfil;

    @Column(name = "NM_Perfil", length = 50, nullable = false, unique = true)
    private String NM_Perfil;

    public PerfisUsuario(){}

    public Integer getID_Perfil() {
        return ID_Perfil;
    }

    public void setID_Perfil(Integer ID_Perfil) {
        this.ID_Perfil = ID_Perfil;
    }

    public String getNM_Perfil() {
        return NM_Perfil;
    }

    public void setNM_Perfil(String NM_Perfil) {
        this.NM_Perfil = NM_Perfil;
    }
}
