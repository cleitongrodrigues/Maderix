package com.maderix.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.maderix.backend.model.PagamentosVenda;

public class PagamentoVendaResponseDTO {

    private Integer idPagamento;
    private Integer idVenda;
    private Integer idConta;
    private String nomeUsuario;
    private BigDecimal valor;
    private String tipoPagamento;
    private LocalDateTime dataPagamento;
    private String observacao;

    public PagamentoVendaResponseDTO(PagamentosVenda pagamento) {
        this.idPagamento = pagamento.getID_Pagamento();
        this.idVenda = pagamento.getVendas().getID_Venda();
        this.nomeUsuario = pagamento.getUsuario().getNM_Usuario(); // Navega para o nome
        this.idConta = pagamento.getConta() != null ? pagamento.getConta().getID_Conta() : null;
        this.valor = pagamento.getValor();
        this.tipoPagamento = pagamento.getTipo_Pagamento();
        this.dataPagamento = pagamento.getData_Pagamento();
        this.observacao = pagamento.getObservacao();
    }

    public PagamentoVendaResponseDTO() {
    }

    public Integer getIdPagamento() {
        return this.idPagamento;
    }

    public void setIdPagamento(Integer idPagamento) {
        this.idPagamento = idPagamento;
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

    public String getNomeUsuario() {
        return this.nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
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

    public LocalDateTime getDataPagamento() {
        return this.dataPagamento;
    }

    public void setDataPagamento(LocalDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public String getObservacao() {
        return this.observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
