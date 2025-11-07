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
    private Integer ID_Pagamento;

    @ManyToOne
    @JoinColumn(name = "ID_Venda", nullable = false)
    private Vendas vendas;

    @ManyToOne
    @JoinColumn(name = "ID_Conta", nullable = true)
    private ContasReceber conta;

    @Column(name = "Data_Pagamento", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime Data_Pagamento;

    @Column(name = "Tipo_Pagamento", length = 20 ,nullable = false)
    private String Tipo_Pagamento;

    @Column(name = "Valor", precision = 10, scale = 2, nullable = false)
    private BigDecimal Valor;

    @ManyToOne
    @JoinColumn(name = "ID_Usuario", nullable = false)
    private Usuarios usuario;

    @Column(name = "Observacao", length = 255, nullable = true)
    private String Observacao;


    public PagamentosVenda() {
    }

    public Integer getID_Pagamento() {
        return this.ID_Pagamento;
    }

    public void setID_Pagamento(Integer ID_Pagamento) {
        this.ID_Pagamento = ID_Pagamento;
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

    public LocalDateTime getData_Pagamento() {
        return this.Data_Pagamento;
    }

    public void setData_Pagamento(LocalDateTime Data_Pagamento) {
        this.Data_Pagamento = Data_Pagamento;
    }

    public String getTipo_Pagamento() {
        return this.Tipo_Pagamento;
    }

    public void setTipo_Pagamento(String Tipo_Pagamento) {
        this.Tipo_Pagamento = Tipo_Pagamento;
    }

    public BigDecimal getValor() {
        return this.Valor;
    }

    public void setValor(BigDecimal Valor) {
        this.Valor = Valor;
    }

    public Usuarios getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuarios usuario) {
        this.usuario = usuario;
    }

    public String getObservacao() {
        return this.Observacao;
    }

    public void setObservacao(String Observacao) {
        this.Observacao = Observacao;
    }
}
