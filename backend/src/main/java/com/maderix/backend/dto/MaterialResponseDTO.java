package com.maderix.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.maderix.backend.model.Materiais;

public class MaterialResponseDTO {

    private Integer idMaterial;
    private Integer idEmpresa;
    private String nomeEmpresa;
    private Integer idUnidade;
    private String siglaUnidade;
    private String nmMaterial;
    private String codigo;
    private BigDecimal precoVenda;
    private String descricao;
    private BigDecimal precoCusto;
    private Integer estoqueAtual;
    private String fornecedor;
    private String categoria;
    private Boolean ativo;
    private LocalDateTime dataCadMaterial;

    // Construtor que converte Model para DTO
    public MaterialResponseDTO(Materiais material) {
        this.idMaterial = material.getIdMaterial();
        this.idEmpresa = material.getEmpresa() != null ? material.getEmpresa().getIdEmpresa() : null;
        this.nomeEmpresa = material.getEmpresa() != null ? material.getEmpresa().getNmFantasia() : null;
        this.idUnidade = material.getUnidadeMedida() != null ? material.getUnidadeMedida().getIdUnidade() : null;
        this.siglaUnidade = material.getUnidadeMedida() != null ? material.getUnidadeMedida().getSigla() : null;
        this.nmMaterial = material.getNmMaterial();
        this.codigo = material.getCodigo();
        this.precoVenda = material.getPrecoVenda();
        this.descricao = material.getDescricao();
        this.precoCusto = material.getPrecoCusto();
        this.estoqueAtual = material.getEstoqueAtual();
        this.fornecedor = material.getFornecedor();
        this.categoria = material.getCategoria();
        this.ativo = material.getAtivo();
        this.dataCadMaterial = material.getDataCadMaterial();
    }

    // Getters e Setters
    public Integer getIdMaterial() {
        return idMaterial;
    }

    public void setIdMaterial(Integer idMaterial) {
        this.idMaterial = idMaterial;
    }

    public Integer getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(Integer idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getNomeEmpresa() {
        return nomeEmpresa;
    }

    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }

    public Integer getIdUnidade() {
        return idUnidade;
    }

    public void setIdUnidade(Integer idUnidade) {
        this.idUnidade = idUnidade;
    }

    public String getSiglaUnidade() {
        return siglaUnidade;
    }

    public void setSiglaUnidade(String siglaUnidade) {
        this.siglaUnidade = siglaUnidade;
    }

    public String getNmMaterial() {
        return nmMaterial;
    }

    public void setNmMaterial(String nmMaterial) {
        this.nmMaterial = nmMaterial;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public BigDecimal getPrecoVenda() {
        return precoVenda;
    }

    public void setPrecoVenda(BigDecimal precoVenda) {
        this.precoVenda = precoVenda;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getPrecoCusto() {
        return precoCusto;
    }

    public void setPrecoCusto(BigDecimal precoCusto) {
        this.precoCusto = precoCusto;
    }

    public Integer getEstoqueAtual() {
        return estoqueAtual;
    }

    public void setEstoqueAtual(Integer estoqueAtual) {
        this.estoqueAtual = estoqueAtual;
    }

    public String getFornecedor() {
        return fornecedor;
    }

    public void setFornecedor(String fornecedor) {
        this.fornecedor = fornecedor;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getDataCadMaterial() {
        return dataCadMaterial;
    }

    public void setDataCadMaterial(LocalDateTime dataCadMaterial) {
        this.dataCadMaterial = dataCadMaterial;
    }
}
