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
    private String codigo;

    @Column(name = "NOME", length = 150, nullable = false)
    private String nome;

    @Column(name = "DESCRICAO", length = 255, nullable = true)
    private String descricao;


    public Permissoes() {
    }

    public Integer getID_Permissoes() {
        return this.ID_Permissoes;
    }

    public void setID_Permissoes(Integer ID_Permissoes) {
        this.ID_Permissoes = ID_Permissoes;
    }

    public String getCodigo() {
        return this.codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return this.nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }


}
