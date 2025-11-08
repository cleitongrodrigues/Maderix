package com.maderix.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "CONTAS_RECEBER")
public class ContasReceber {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Conta")
    private Integer idConta;

    @ManyToOne
    @JoinColumn(name = "ID_Venda", nullable = false)
    private Vendas venda;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Empresa empresa;

    @Column(name = "Numero", length = 50, nullable = true)
    private String numero;

    @Column(name = "Cliente", length = 150, nullable = true)
    private String cliente;

    @Column(name = "Descricao", length = 255, nullable = true)
    private String descricao;

    @Column(name = "Valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "Data_Vencimento", nullable = false)
    private LocalDateTime dataVencimento;

    @Column(name = "Pago")
    private boolean pago = false;

    @Column(name = "Data_Pagamento", nullable = true)
    private LocalDateTime dataPagamento;

    @Column(name = "DT_Cad_Conta", nullable = false)
    @CreationTimestamp
    private LocalDateTime dataCadConta;

    @Column(name = "Cancelado", nullable = false)
    private Boolean cancelado = false;

    public ContasReceber(){}


    public Integer getIdConta() {
        return this.idConta;
    }

    public void setIdConta(Integer idConta) {
        this.idConta = idConta;
    }

    public Vendas getVenda() {
        return this.venda;
    }

    public void setVenda(Vendas venda) {
        this.venda = venda;
    }

    public Empresa getEmpresa() {
        return this.empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public String getNumero() {
        return this.numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getCliente() {
        return this.cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return this.valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDateTime getDataVencimento() {
        return this.dataVencimento;
    }

    public void setDataVencimento(LocalDateTime dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public boolean isPago() {
        return this.pago;
    }

    public boolean getPago() {
        return this.pago;
    }

    public void setPago(boolean pago) {
        this.pago = pago;
    }

    public LocalDateTime getDataPagamento() {
        return this.dataPagamento;
    }

    public void setDataPagamento(LocalDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public LocalDateTime getDataCadConta() {
        return this.dataCadConta;
    }

    public void setDataCadConta(LocalDateTime dataCadConta) {
        this.dataCadConta = dataCadConta;
    }

    public Boolean isCancelado() {
        return this.cancelado;
    }

    public Boolean getCancelado() {
        return this.cancelado;
    }

    public void setCancelado(Boolean cancelado) {
        this.cancelado = cancelado;
    }
    
}
