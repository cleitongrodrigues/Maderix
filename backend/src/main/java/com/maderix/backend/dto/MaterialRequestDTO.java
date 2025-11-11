package com.maderix.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MaterialRequestDTO {

    @NotNull(message = "ID da empresa é obrigatório")
    private Integer idEmpresa;

    @NotNull(message = "ID da unidade de medida é obrigatório")
    private Integer idUnidade;

    @NotBlank(message = "Nome do material é obrigatório")
    @Size(max = 150, message = "Nome não pode ter mais de 150 caracteres")
    private String nmMaterial;

    @NotBlank(message = "Código do material é obrigatório")
    @Size(max = 60, message = "Código não pode ter mais de 60 caracteres")
    private String codigo;

    @NotNull(message = "Preço de venda é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço de venda deve ser maior que zero")
    private BigDecimal precoVenda;

    @Size(max = 255, message = "Descrição não pode ter mais de 255 caracteres")
    private String descricao;

    @NotNull(message = "Preço de custo é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço de custo deve ser maior que zero")
    private BigDecimal precoCusto;

    @NotNull(message = "Estoque atual é obrigatório")
    @Min(value = 0, message = "Estoque não pode ser negativo")
    private Integer estoqueAtual;

    @Size(max = 150, message = "Fornecedor não pode ter mais de 150 caracteres")
    private String fornecedor;

    @Size(max = 100, message = "Categoria não pode ter mais de 100 caracteres")
    private String categoria;

    private Boolean ativo = true;

    // Getters e Setters
    public Integer getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(Integer idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public Integer getIdUnidade() {
        return idUnidade;
    }

    public void setIdUnidade(Integer idUnidade) {
        this.idUnidade = idUnidade;
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
}
