package com.maderix.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "PAGAMENTOS_VENDA")
public class PagamentosVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Pagamento")
    private Integer idPagamento;

    @ManyToOne
    @JoinColumn(name = "ID_Venda", nullable = false)
    private Vendas vendas;

    @ManyToOne
    @JoinColumn(name = "ID_Conta", nullable = true)
    private ContasReceber conta;

    @Column(name = "Data_Pagamento", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dataPagamento;

    @Column(name = "Tipo_Pagamento", length = 20 ,nullable = false)
    private String tipoPagamento;

    @Column(name = "Valor", precision = 10, scale = 2, nullable = false)
    private BigDecimal valor;

    @ManyToOne
    @JoinColumn(name = "ID_Usuario", nullable = false)
    private Usuarios usuario;

    @Column(name = "Observacao", length = 255, nullable = true)
    private String observacao;


    public PagamentosVenda() {
    }


    public Integer getIdPagamento() {
        return this.idPagamento;
    }

    public void setIdPagamento(Integer idPagamento) {
        this.idPagamento = idPagamento;
    }

    public Vendas getVendas() {
        return this.vendas;
    }

    public void setVendas(Vendas vendas) {
        this.vendas = vendas;
    }

    public ContasReceber getConta() {
        return this.conta;
    }

    public void setConta(ContasReceber conta) {
        this.conta = conta;
    }

    public LocalDateTime getDataPagamento() {
        return this.dataPagamento;
    }

    public void setDataPagamento(LocalDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public String getTipoPagamento() {
        return this.tipoPagamento;
    }

    public void setTipoPagamento(String tipoPagamento) {
        this.tipoPagamento = tipoPagamento;
    }

    public BigDecimal getValor() {
        return this.valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public Usuarios getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuarios usuario) {
        this.usuario = usuario;
    }

    public String getObservacao() {
        return this.observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
    
}
