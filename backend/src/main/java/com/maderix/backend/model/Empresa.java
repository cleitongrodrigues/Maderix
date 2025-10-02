package com.maderix.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "EMPRESA")
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Empresa")
    private Integer idEmpresa;

    @Column(name = "NM_Fantasia", nullable = false, length = 150)
    private String nomeFantasia;

    @Column(name = "RZ_Social", length = 150)
    private String razaoSocial;

    @Column(name = "CNPJ", unique = true, length = 18)
    private String cnpj;

    @Column(name = "DT_Cad_Empresa", nullable = false)
    private LocalDateTime dataCadastro;

    public Empresa(Integer idEmpresa, String nomeFantasia, String razaoSocial, String cnpj, LocalDateTime dataCadastro) {
        this.idEmpresa = idEmpresa;
        this.nomeFantasia = nomeFantasia;
        this.razaoSocial = razaoSocial;
        this.cnpj = cnpj;
        this.dataCadastro = dataCadastro;
    }

    public Empresa(){}

    public Integer getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(Integer idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
}
