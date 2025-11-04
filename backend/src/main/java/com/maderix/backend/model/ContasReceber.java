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
    private Integer ID_Conta;

    @ManyToOne
    @JoinColumn(name = "ID_Venda", nullable = false)
    private Vendas venda;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Empresa empresa;

    @Column(name = "Numero", length = 50, nullable = true)
    private String Numero;

    @Column(name = "Cliente", length = 150, nullable = true)
    private String Cliente;

    @Column(name = "Descricao", length = 255, nullable = true)
    private String Descricao;

    @Column(name = "Valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal Valor;

    @Column(name = "Data_Vencimento", nullable = false)
    private LocalDateTime Data_Vencimento;

    @Column(name = "Pago")
    private boolean Pago = false;

    @Column(name = "Data_Pagamento", nullable = true)
    private LocalDateTime Data_Pagamento;

    @Column(name = "DT_Cad_Conta", nullable = false)
    @CreationTimestamp
    private LocalDateTime DT_Cad_Conta;

    @Column(name = "Cancelado", nullable = false)
    private Boolean Cancelado = false;

    public ContasReceber(){}

    public Integer getID_Conta() {
        return ID_Conta;
    }

    public void setID_Conta(Integer ID_Conta) {
        this.ID_Conta = ID_Conta;
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
    public String getDescricao() {
        return Descricao;
    }

    public void setDescricao(String descricao) {
        Descricao = descricao;
    }

    public BigDecimal getValor() {
        return Valor;
    }

    public void setValor(BigDecimal valor) {
        Valor = valor;
    }

    public LocalDateTime getData_Vencimento() {
        return Data_Vencimento;
    }

    public void setData_Vencimento(LocalDateTime data_Vencimento) {
        Data_Vencimento = data_Vencimento;
    }

    public boolean isPago() {
        return Pago;
    }

    public void setPago(boolean pago) {
        Pago = pago;
    }

    public LocalDateTime getData_Pagamento() {
        return Data_Pagamento;
    }

    public void setData_Pagamento(LocalDateTime data_Pagamento) {
        Data_Pagamento = data_Pagamento;
    }

    public LocalDateTime getDT_Cad_Conta() {
        return DT_Cad_Conta;
    }

    public void setDT_Cad_Conta(LocalDateTime DT_Cad_Conta) {
        this.DT_Cad_Conta = DT_Cad_Conta;
    }

    public String getNumero() {
        return this.Numero;
    }

    public void setNumero(String Numero) {
        this.Numero = Numero;
    }

    public String getCliente() {
        return this.Cliente;
    }

    public void setCliente(String Cliente) {
        this.Cliente = Cliente;
    }

    public boolean getPago() {
        return this.Pago;
    }


    public Boolean isCancelado() {
        return this.Cancelado;
    }

    public Boolean getCancelado() {
        return this.Cancelado;
    }

    public void setCancelado(Boolean Cancelado) {
        this.Cancelado = Cancelado;
    }
    
}
