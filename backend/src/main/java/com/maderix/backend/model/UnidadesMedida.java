package com.maderix.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "UNIDADES_MEDIDA")
public class UnidadesMedida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Unidade")
    private Integer idUnidade;
    
    @Column(name = "Sigla", length = 10, nullable = false, unique = true)
    private String sigla;

    @Column(name = "Descricao", length = 50, nullable = false)
    private String descricao;

    @Column(name = "Ativo", nullable = false)
    private Boolean ativo = true;

    public UnidadesMedida() {
    }

    public Integer getIdUnidade() {
        return this.idUnidade;
    }

    public void setIdUnidade(Integer idUnidade) {
        this.idUnidade = idUnidade;
    }

    public String getSigla() {
        return this.sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Boolean isAtivo() {
        return this.ativo;
    }

    public Boolean getAtivo() {
        return this.ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }


}
