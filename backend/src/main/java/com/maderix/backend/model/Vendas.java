package com.maderix.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.maderix.backend.service.EmpresaService;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "VENDAS")
public class Vendas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Venda")
    private Integer ID_Venda;

    @ManyToOne
    @JoinColumn(name = "ID_Cliente", nullable = false)
    private Clientes ID_Cliente;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Empresa ID_Empresa;

    @ManyToOne
    @JoinColumn(name = "ID_Usuario")
    private Usuarios ID_Usuario;

    @Column(name = "Valor_Total", nullable = false, precision = 10, scale = 2)
    private BigDecimal Valor_Total;

    @Column(name = "Status_Venda", length = (50),nullable = false)
    @org.hibernate.annotations.ColumnDefault("ABERTA")
    private String Status_Venda;

    @Column(name = "DT_Venda", updatable = false)
    @CreationTimestamp
    private LocalDateTime DT_Venda;

    @OneToMany(mappedBy = "ID_Venda", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ItensVenda> itensVendas;

    public Vendas(){}

    public Integer getID_Venda() {
        return ID_Venda;
    }

    public void setID_Venda(Integer ID_Venda) {
        this.ID_Venda = ID_Venda;
    }

    public Clientes getID_Cliente() {
        return ID_Cliente;
    }

    public void setID_Cliente(Clientes ID_Cliente) {
        this.ID_Cliente = ID_Cliente;
    }

    public Empresa getID_Empresa() {
        return ID_Empresa;
    }

    public void setID_Empresa(Empresa ID_Empresa) {
        this.ID_Empresa = ID_Empresa;
    }

    public Usuarios getID_Usuario() {
        return ID_Usuario;
    }

    public void setID_Usuario(Usuarios ID_Usuario) {
        this.ID_Usuario = ID_Usuario;
    }

    public BigDecimal getValor_Total() {
        return Valor_Total;
    }

    public void setValor_Total(BigDecimal valor_Total) {
        Valor_Total = valor_Total;
    }

    public String getStatus_Venda() {
        return Status_Venda;
    }

    public void setStatus_Venda(String status_Venda) {
        Status_Venda = status_Venda;
    }

    public LocalDateTime getDT_Venda() {
        return DT_Venda;
    }

    public void setDT_Venda(LocalDateTime DT_Venda) {
        this.DT_Venda = DT_Venda;
    }

    public List<ItensVenda> getItensVendas() {
        return itensVendas;
    }

    public void setItensVendas(List<ItensVenda> itensVendas) {
        this.itensVendas = itensVendas;
    }
}
