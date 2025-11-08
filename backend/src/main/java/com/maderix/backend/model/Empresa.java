package com.maderix.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
@Entity
@Table(name = "EMPRESA")
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Empresa")
    private Integer idEmpresa;

    @Column(name = "NM_Fantasia", nullable = false, length = 150)
    private String nmFantasia;

    @Column(name = "RZ_Social", length = 150)
    private String rzSocial;

    @Column(name = "CNPJ", unique = true, length = 18)
    private String cnpj;

    @CreationTimestamp // Registra a data do Sistema
    @Column(name = "DT_Cad_Empresa", nullable = false)
    private LocalDateTime dataCadEmpresa;

    public Empresa(Integer idEmpresa, String nomeFantasia, String razaoSocial, String cnpj, LocalDateTime dataCadastro) {
        this.idEmpresa = idEmpresa;
        this.nmFantasia = nomeFantasia;
        this.rzSocial = razaoSocial;
        this.cnpj = cnpj;
        this.dataCadEmpresa = dataCadastro;
    }

    public Empresa(){}


    public Integer getIdEmpresa() {
        return this.idEmpresa;
    }

    public void setIdEmpresa(Integer idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getNmFantasia() {
        return this.nmFantasia;
    }

    public void setNmFantasia(String nmFantasia) {
        this.nmFantasia = nmFantasia;
    }

    public String getRzSocial() {
        return this.rzSocial;
    }

    public void setRzSocial(String rzSocial) {
        this.rzSocial = rzSocial;
    }

    public String getCnpj() {
        return this.cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public LocalDateTime getDataCadEmpresa() {
        return this.dataCadEmpresa;
    }

    public void setDataCadEmpresa(LocalDateTime dataCadEmpresa) {
        this.dataCadEmpresa = dataCadEmpresa;
    }
    
}
