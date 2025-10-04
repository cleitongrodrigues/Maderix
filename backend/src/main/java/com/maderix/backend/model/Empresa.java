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
    private Integer ID_Empresa;

    @Column(name = "NM_Fantasia", nullable = false, length = 150)
    private String NM_Fantasia;

    @Column(name = "RZ_Social", length = 150)
    private String RZ_Social;

    @Column(name = "CNPJ", unique = true, length = 18)
    private String CNPJ;

    @CreationTimestamp // Registra a data do Sistema
    @Column(name = "DT_Cad_Empresa", nullable = false)
    private LocalDateTime DT_Cad_Empresa;

    public Empresa(Integer idEmpresa, String nomeFantasia, String razaoSocial, String cnpj, LocalDateTime dataCadastro) {
        this.ID_Empresa = idEmpresa;
        this.NM_Fantasia = nomeFantasia;
        this.RZ_Social = razaoSocial;
        this.CNPJ = cnpj;
        this.DT_Cad_Empresa = dataCadastro;
    }

    public Empresa(){}

    public Integer getID_Empresa() {
        return ID_Empresa;
    }

    public void setID_Empresa(Integer iD_Empresa) {
        ID_Empresa = iD_Empresa;
    }

    public String getNM_Fantasia() {
        return NM_Fantasia;
    }

    public void setNM_Fantasia(String nM_Fantasia) {
        NM_Fantasia = nM_Fantasia;
    }

    public String getRZ_Social() {
        return RZ_Social;
    }

    public void setRZ_Social(String rZ_Social) {
        RZ_Social = rZ_Social;
    }

    public String getCNPJ() {
        return CNPJ;
    }

    public void setCNPJ(String cNPJ) {
        CNPJ = cNPJ;
    }

    public LocalDateTime getDT_Cad_Empresa() {
        return DT_Cad_Empresa;
    }

    public void setDT_Cad_Empresa(LocalDateTime dT_Cad_Empresa) {
        DT_Cad_Empresa = dT_Cad_Empresa;
    }


}
