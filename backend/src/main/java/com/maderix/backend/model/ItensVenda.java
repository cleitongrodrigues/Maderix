package com.maderix.backend.model;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name = "ITENS_VENDA")
public class ItensVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Item_Venda")
    private Integer idItemVenda;

    @ManyToOne
    @JoinColumn(name = "ID_Venda", nullable = false)
    private Vendas ID_Venda;

    @ManyToOne
    @JoinColumn(name = "ID_Material", nullable = false)
    private Materiais idMaterial;

    @Column(name = "Quantidade", nullable = false)
    private Integer quantidade;

    @Column(name = "Preco_Unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoUnitario;

    @Column(name = "Valor_Total_Item", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotalItem;


    public ItensVenda() {
    }

    public Integer getIdItemVenda() {
        return this.idItemVenda;
    }

    public void setIdItemVenda(Integer idItemVenda) {
        this.idItemVenda = idItemVenda;
    }


    public Vendas getID_Venda() {
        return this.ID_Venda;
    }

    public void setID_Venda(Vendas ID_Venda) {
        this.ID_Venda = ID_Venda;
    }


    public Materiais getIdMaterial() {
        return this.idMaterial;
    }

    public void setIdMaterial(Materiais idMaterial) {
        this.idMaterial = idMaterial;
    }

    public Integer getQuantidade() {
        return this.quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getPrecoUnitario() {
        return this.precoUnitario;
    }

    public void setPrecoUnitario(BigDecimal precoUnitario) {
        this.precoUnitario = precoUnitario;
    }

    public BigDecimal getValorTotalItem() {
        return this.valorTotalItem;
    }

    public void setValorTotalItem(BigDecimal valorTotalItem) {
        this.valorTotalItem = valorTotalItem;
    }


}
