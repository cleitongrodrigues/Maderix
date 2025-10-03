package com.maderix.backend.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "USUARIOS")
public class Usuarios{


    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Usuario")
    private Integer ID_Usuario;

    @Column(name = "ID_Empresa")
    private Integer ID_Empresa;
    
    @Column(name = "ID_Perfil")
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
}
