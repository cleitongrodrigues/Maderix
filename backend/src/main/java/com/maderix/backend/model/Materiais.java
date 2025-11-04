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
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "ID_Unidade", nullable = false)
    private UnidadesMedida unidadeMedida;

    @Column(name = "NM_Material", length = 150, nullable = false)
    private String NM_Material;

    @Column(name = "Codigo", length = 60, nullable = false, unique = true)
    private String Codigo;

    @Column(name = "PRECO_VENDA", precision = 10, scale = 2, nullable = false)
    private BigDecimal PRECO_VENDA = BigDecimal.ZERO;

    @Column(name = "Descricao", length = 255)
    private String Descricao;

    @Column(name = "Preco_Custo", nullable = false, precision = 10, scale = 2)
    private BigDecimal Preco_Custo = BigDecimal.ZERO; 

    @Column(name = "Estoque_Atual", nullable = false)
    private Integer Estoque_Atual = 0;

    @Column(name = "Fornecedor", length = 150, nullable = true)
    private String Fornecedor;

    @Column(name = "Categoria", length = 100, nullable = true)
    private String Categoria;

    @Column(name = "DT_Cad_Material", nullable = false)
    @CreationTimestamp
    private LocalDateTime DT_Cad_Material;

    @Column(name = "Ativo", nullable = false)
    private Boolean Ativo = true;

    public Integer getID_Material() {
        return ID_Material;
    }

    public void setID_Material(Integer ID_Material) {
        this.ID_Material = ID_Material;
    }

    public Empresa getEmpresa() {
        return this.empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public UnidadesMedida getUnidadeMedida() {
        return this.unidadeMedida;
    }

    public void setUnidadeMedida(UnidadesMedida unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
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

    public String getCodigo() {
        return this.Codigo;
    }

    public void setCodigo(String Codigo) {
        this.Codigo = Codigo;
    }

    public BigDecimal getPRECO_VENDA() {
        return this.PRECO_VENDA;
    }

    public void setPRECO_VENDA(BigDecimal PRECO_VENDA) {
        this.PRECO_VENDA = PRECO_VENDA;
    }

    public String getFornecedor() {
        return this.Fornecedor;
    }

    public void setFornecedor(String Fornecedor) {
        this.Fornecedor = Fornecedor;
    }

    public String getCategoria() {
        return this.Categoria;
    }

    public void setCategoria(String Categoria) {
        this.Categoria = Categoria;
    }

    public Boolean isAtivo() {
        return this.Ativo;
    }

    public Boolean getAtivo() {
        return this.Ativo;
    }

    public void setAtivo(Boolean Ativo) {
        this.Ativo = Ativo;
    }
}
