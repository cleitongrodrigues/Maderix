package com.maderix.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "VENDAS")
public class Vendas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Venda")
    private Integer idVenda;

    @ManyToOne
    @JoinColumn(name = "ID_Cliente", nullable = false)
    private Clientes cliente;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "ID_Usuario")
    private Usuarios usuario;

    @Column(name = "Valor_Total", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(name = "Status_Venda", length = (50),nullable = false)
    @org.hibernate.annotations.ColumnDefault("'ABERTA'")
    private String statusVenda;

    @Column(name = "DT_Venda", updatable = false)
    @CreationTimestamp
    private LocalDateTime dataVenda;

    @OneToMany(mappedBy = "ID_Venda", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true) 
    private List<ItensVenda> itensVendas;   

    public Vendas(){}

    public Integer getIdVenda() {
        return this.idVenda;
    }

    public void setIdVenda(Integer idVenda) {
        this.idVenda = idVenda;
    }

    public Clientes getCliente() {
        return this.cliente;
    }

    public void setCliente(Clientes cliente) {
        this.cliente = cliente;
    }

    public Empresa getEmpresa() {
        return this.empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public Usuarios getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuarios usuario) {
        this.usuario = usuario;
    }

    public BigDecimal getValorTotal() {
        return this.valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getStatusVenda() {
        return this.statusVenda;
    }

    public void setStatusVenda(String statusVenda) {
        this.statusVenda = statusVenda;
    }

    public LocalDateTime getDataVenda() {
        return this.dataVenda;
    }

    public void setDataVenda(LocalDateTime dataVenda) {
        this.dataVenda = dataVenda;
    }
    public void setItensVendas(List<ItensVenda> itensVendas) {
        this.itensVendas = itensVendas;
    }
    
@   OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<ItensVenda> getItensVendas() {
        return itensVendas;
    }
}
