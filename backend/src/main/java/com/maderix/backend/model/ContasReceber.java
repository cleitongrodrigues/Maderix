package com.maderix.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.maderix.backend.repository.EmpresaRepository;
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
    private Vendas ID_Venda;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Empresa ID_Empresa;

    @Column(name = "Descricao", length = 255, nullable = true)
    private String Descricao;

    @Column(name = "Valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal Valor;

    @Column(name = "Data_Vencimento", nullable = false)
    private LocalDateTime Data_Vencimento;

    @Column(name = "Pago")
    @org.hibernate.annotations.ColumnDefault("0")
    private boolean Pago;

    @Column(name = "Data_Pagamento", nullable = true)
    private LocalDateTime Data_Pagamento;

    @Column(name = "DT_Cad_Conta", nullable = false)
    @CreationTimestamp
    private LocalDateTime DT_Cad_Conta;

    public ContasReceber(){}

    public Integer getID_Conta() {
        return ID_Conta;
    }

    public void setID_Conta(Integer ID_Conta) {
        this.ID_Conta = ID_Conta;
    }

    public Vendas getID_Venda() {
        return ID_Venda;
    }

    public void setID_Venda(Vendas ID_Venda) {
        this.ID_Venda = ID_Venda;
    }

    public Empresa getID_Empresa() {
        return ID_Empresa;
    }

    public void setID_Empresa(Empresa ID_Empresa) {
        this.ID_Empresa = ID_Empresa;
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
}
