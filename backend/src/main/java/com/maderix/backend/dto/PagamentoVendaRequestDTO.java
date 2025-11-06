package com.maderix.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PagamentoVendaRequestDTO {

    @NotNull(message = "O ID da venda é obrigatório.")
    private Integer idVenda;

    private Integer idConta;

    @NotNull(message = "O ID do Usuário obrigatório.")
    private Integer idUsuario;

    @NotNull(message = "O Valor do pagamento é obrigatório.")
    private BigDecimal valor;

    @NotNull(message = "O tipo de pagamento é obrigatório.")
    @Size(max = 20, message = "O tipo de pagamento excede 20 caracteres.")
    private String tipoPagamento;

    @Size(max = 255)
    private String observacao;

    public PagamentoVendaRequestDTO() {
    }

    public Integer getIdVenda() {
        return this.idVenda;
    }

    public void setIdVenda(Integer idVenda) {
        this.idVenda = idVenda;
    }

    public Integer getIdConta() {
        return this.idConta;
    }

    public void setIdConta(Integer idConta) {
        this.idConta = idConta;
    }

    public Integer getIdUsuario() {
        return this.idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public BigDecimal getValor() {
        return this.valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getTipoPagamento() {
        return this.tipoPagamento;
    }

    public void setTipoPagamento(String tipoPagamento) {
        this.tipoPagamento = tipoPagamento;
    }

    public String getObservacao() {
        return this.observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
