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
    private Integer idMaterial;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "ID_Unidade", nullable = false)
    private UnidadesMedida unidadeMedida;

    @Column(name = "NM_Material", length = 150, nullable = false)
    private String nmMaterial;

    @Column(name = "Codigo", length = 60, nullable = false, unique = true)
    private String codigo;

    @Column(name = "PRECO_VENDA", precision = 10, scale = 2, nullable = false)
    private BigDecimal precoVenda = BigDecimal.ZERO;

    @Column(name = "Descricao", length = 255)
    private String descricao;

    @Column(name = "Preco_Custo", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoCusto = BigDecimal.ZERO; 

    @Column(name = "Estoque_Atual", nullable = false)
    private Integer estoqueAtual = 0;

    @Column(name = "Fornecedor", length = 150, nullable = true)
    private String fornecedor;

    @Column(name = "Categoria", length = 100, nullable = true)
    private String categoria;

    @Column(name = "DT_Cad_Material", nullable = false)
    @CreationTimestamp
    private LocalDateTime dataCadMaterial;

    @Column(name = "Ativo", nullable = false)
    private Boolean ativo = true;


    public Integer getIdMaterial() {
        return this.idMaterial;
    }

    public void setIdMaterial(Integer idMaterial) {
        this.idMaterial = idMaterial;
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

    public String getNmMaterial() {
        return this.nmMaterial;
    }

    public void setNmMaterial(String nmMaterial) {
        this.nmMaterial = nmMaterial;
    }

    public String getCodigo() {
        return this.codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public BigDecimal getPrecoVenda() {
        return this.precoVenda;
    }

    public void setPrecoVenda(BigDecimal precoVenda) {
        this.precoVenda = precoVenda;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getPrecoCusto() {
        return this.precoCusto;
    }

    public void setPrecoCusto(BigDecimal precoCusto) {
        this.precoCusto = precoCusto;
    }

    public Integer getEstoqueAtual() {
        return this.estoqueAtual;
    }

    public void setEstoqueAtual(Integer estoqueAtual) {
        this.estoqueAtual = estoqueAtual;
    }

    public String getFornecedor() {
        return this.fornecedor;
    }

    public void setFornecedor(String fornecedor) {
        this.fornecedor = fornecedor;
    }

    public String getCategoria() {
        return this.categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public LocalDateTime getDataCadMaterial() {
        return this.dataCadMaterial;
    }

    public void setDataCadMaterial(LocalDateTime dataCadMaterial) {
        this.dataCadMaterial = dataCadMaterial;
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
