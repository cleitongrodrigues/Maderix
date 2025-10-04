package com.maderix.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "MATERIAIS")
public class Materiais {
    @Id
    @Column(name = "ID_Material")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ID_Material;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Empresa ID_Empresa;

    @ManyToOne
    @JoinColumn(name = "ID_Unidade", nullable = false)
    private UnidadesMedida ID_Unidade;

    @Column(name = "NM_Material", length = 150, nullable = false)
    private String NM_Material;

    @Column(name = "Descricao", length = 255)
    private String Descricao;

    @Column(name = "Preco_Custo", nullable = false, precision = 10, scale = 2)
    @org.hibernate.annotations.ColumnDefault("0.00")
    private BigDecimal Preco_Custo; 

    @Column(name = "Estoque_Atual", nullable = false)
    @org.hibernate.annotations.ColumnDefault("0")
    private Integer Estoque_Atual;

    @Column(name = "DT_Cad_Material", nullable = false)
    @CreationTimestamp
    private LocalDateTime DT_Cad_Material;

    public Integer getID_Material() {
        return ID_Material;
    }

    public void setID_Material(Integer ID_Material) {
        this.ID_Material = ID_Material;
    }

    public Empresa getID_Empresa() {
        return ID_Empresa;
    }

    public void setID_Empresa(Empresa ID_Empresa) {
        this.ID_Empresa = ID_Empresa;
    }

    public UnidadesMedida getID_Unidade() {
        return ID_Unidade;
    }

    public void setID_Unidade(UnidadesMedida ID_Unidade) {
        this.ID_Unidade = ID_Unidade;
    }

    public String getNM_Material() {
        return NM_Material;
    }

    public void setNM_Material(String NM_Material) {
        this.NM_Material = NM_Material;
    }

    public String getDescricao() {
        return Descricao;
    }

    public void setDescricao(String descricao) {
        Descricao = descricao;
    }

    public BigDecimal getPreco_Custo() {
        return Preco_Custo;
    }

    public void setPreco_Custo(BigDecimal preco_Custo) {
        Preco_Custo = preco_Custo;
    }

    public Integer getEstoque_Atual() {
        return Estoque_Atual;
    }

    public void setEstoque_Atual(Integer estoque_Atual) {
        Estoque_Atual = estoque_Atual;
    }

    public LocalDateTime getDT_Cad_Material() {
        return DT_Cad_Material;
    }

    public void setDT_Cad_Material(LocalDateTime DT_Cad_Material) {
        this.DT_Cad_Material = DT_Cad_Material;
    }
}
