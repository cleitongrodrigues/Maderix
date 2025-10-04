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
    private Integer ID_Cliente;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Empresa ID_Empresa;

    @Column(name = "NM_Cliente", length = 150, nullable = false)
    private String NM_Cliente;

    @Column(name = "Tel_Cliente", length = 20)
    private String Tel_Cliente;

    @Column(name = "Email", length = 100)
    private String Email;

    @Column(name = "DT_Cad_Cliente", updatable = false, nullable = false)// updatable Desabilita possibilidade de atualização
    @CreationTimestamp // Registra a data do Sistema
    private LocalDateTime DT_Cad_Cliente;

    public Clientes(){}

    public Integer getID_Cliente() {
        return ID_Cliente;
    }

    public void setID_Cliente(Integer ID_Cliente) {
        this.ID_Cliente = ID_Cliente;
    }

    public Empresa getID_Empresa() {
        return ID_Empresa;
    }

    public void setID_Empresa(Empresa ID_Empresa) {
        this.ID_Empresa = ID_Empresa;
    }

    public String getNM_Cliente() {
        return NM_Cliente;
    }

    public void setNM_Cliente(String NM_Cliente) {
        this.NM_Cliente = NM_Cliente;
    }

    public String getTel_Cliente() {
        return Tel_Cliente;
    }

    public void setTel_Cliente(String tel_Cliente) {
        Tel_Cliente = tel_Cliente;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public LocalDateTime getDT_Cad_Cliente() {
        return DT_Cad_Cliente;
    }

    public void setDT_Cad_Cliente(LocalDateTime DT_Cad_Cliente) {
        this.DT_Cad_Cliente = DT_Cad_Cliente;
    }
}
