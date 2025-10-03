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
}
