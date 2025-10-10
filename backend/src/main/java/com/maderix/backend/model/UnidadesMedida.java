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
    private Integer ID_Unidade;
    
    @Column(name = "Sigla", length = 10, nullable = false, unique = true)
    private String Sigla;

    @Column(name = "Descricao", length = 50, nullable = false)
    private String Descricao;


    public Integer getID_Unidade() {
        return this.ID_Unidade;
    }

    public void setID_Unidade(Integer ID_Unidade) {
        this.ID_Unidade = ID_Unidade;
    }

    public String getSigla() {
        return this.Sigla;
    }

    public void setSigla(String Sigla) {
        this.Sigla = Sigla;
    }

    public String getDescricao() {
        return this.Descricao;
    }

    public void setDescricao(String Descricao) {
        this.Descricao = Descricao;
    }

}
