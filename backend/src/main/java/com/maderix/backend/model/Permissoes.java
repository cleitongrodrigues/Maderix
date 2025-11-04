package com.maderix.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "PERMISSOES")
public class Permissoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Permissoes")
    private Integer ID_Permissoes;

    @Column(name = "CODIGO", length = 100 ,nullable = false, unique = true)
    private String CODIGO;

    @Column(name = "NOME", length = 150, nullable = false)
    private String NOME;

    @Column(name = "DESCRICAO", length = 255, nullable = true)
    private String DESCRICAO;


    public Permissoes() {
    }

    public Integer getID_Permissoes() {
        return this.ID_Permissoes;
    }

    public void setID_Permissoes(Integer ID_Permissoes) {
        this.ID_Permissoes = ID_Permissoes;
    }

    public String getCODIGO() {
        return this.CODIGO;
    }

    public void setCODIGO(String CODIGO) {
        this.CODIGO = CODIGO;
    }

    public String getNOME() {
        return this.NOME;
    }

    public void setNOME(String NOME) {
        this.NOME = NOME;
    }

    public String getDESCRICAO() {
        return this.DESCRICAO;
    }

    public void setDESCRICAO(String DESCRICAO) {
        this.DESCRICAO = DESCRICAO;
    }


}
