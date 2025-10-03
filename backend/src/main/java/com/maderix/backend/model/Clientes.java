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
@Table(name = "CLIENTES")
public class Clientes {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Cliente")
    private Integer ID_Cliente;

    @Column(name = "ID_Empresa")
    private Integer ID_Empresa;

    @Column(name = "NM_Cliente", length = 150, nullable = false)
    private String NM_Cliente;

    @Column(name = "Tel_Cliente", length = 20)
    private String Tel_Cliente;

    @Column(name = "Email", length = 100)
    private String Email;

    @Column(name = "DT_Cad_Cliente", updatable = false)// updatable Desabilita possibilidade de atualização 
    @CreationTimestamp // Registra a data do Sistema
    private LocalDateTime DT_Cad_Cliente;

}
