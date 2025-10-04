package com.maderix.backend.model;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name = "ITENS_VENDA")
public class ItensVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Item_Venda")
    private Integer ID_Item_Venda;

    @ManyToOne
    @JoinColumn(name = "ID_Venda", nullable = false)
    private Vendas ID_Venda;

    @ManyToOne
    @JoinColumn(name = "ID_Material", nullable = false)
    private Materiais ID_Material;

    @Column(name = "Quantidade", nullable = false)
    private Integer Quantidade;

    @Column(name = "Preco_Unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal Preco_Unitario;

    @Column(name = "Valor_Total_Item", nullable = false, precision = 10, scale = 2)
    private BigDecimal Valor_Total_Item;

    public Integer getID_Item_Venda() {
        return ID_Item_Venda;
    }

    public void setID_Item_Venda(Integer ID_Item_Venda) {
        this.ID_Item_Venda = ID_Item_Venda;
    }

    public Vendas getID_Venda() {
        return ID_Venda;
    }

    public void setID_Venda(Vendas ID_Venda) {
        this.ID_Venda = ID_Venda;
    }

    public Materiais getID_Material() {
        return ID_Material;
    }

    public void setID_Material(Materiais ID_Material) {
        this.ID_Material = ID_Material;
    }

    public Integer getQuantidade() {
        return Quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        Quantidade = quantidade;
    }

    public BigDecimal getPreco_Unitario() {
        return Preco_Unitario;
    }

    public void setPreco_Unitario(BigDecimal preco_Unitario) {
        Preco_Unitario = preco_Unitario;
    }

    public BigDecimal getValor_Total_Item() {
        return Valor_Total_Item;
    }

    public void setValor_Total_Item(BigDecimal valor_Total_Item) {
        Valor_Total_Item = valor_Total_Item;
    }
}
