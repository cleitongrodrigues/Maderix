package com.maderix.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "CLIENTES")
public class Clientes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Cliente")
    private Integer idCliente;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Empresa idEmpresa;

    @Column(name = "NM_Cliente", length = 150, nullable = false)
    private String nmCliente;

    @Column(name = "Tel_Cliente", length = 20)
    private String telCliente;

    @Column(name = "Email", length = 100)
    private String email;

    @Column(name = "DT_Cad_Cliente", updatable = false, nullable = false)// updatable Desabilita possibilidade de atualização
    @CreationTimestamp // Registra a data do Sistema
    private LocalDateTime dataCadCliente;

    public Clientes(){}


    public Integer getIdCliente() {
        return this.idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public Empresa getIdEmpresa() {
        return this.idEmpresa;
    }

    public void setIdEmpresa(Empresa idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getNmCliente() {
        return this.nmCliente;
    }

    public void setNmCliente(String nmCliente) {
        this.nmCliente = nmCliente;
    }

    public String getTelCliente() {
        return this.telCliente;
    }

    public void setTelCliente(String telCliente) {
        this.telCliente = telCliente;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getDataCadCliente() {
        return this.dataCadCliente;
    }

    public void setDataCadCliente(LocalDateTime dataCadCliente) {
        this.dataCadCliente = dataCadCliente;
    }
    
}
