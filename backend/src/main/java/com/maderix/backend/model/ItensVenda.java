package com.maderix.backend.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ITENS_VENDA")
public class ItensVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Item_Venda")
    private Integer ID_Item_Venda;

    @Column(name = "ID_Venda")
    private Integer ID_Venda;

    @Column(name = "ID_Material")
    private Integer ID_Material;

    @Column(name = "Quantidade", nullable = false)
    private Integer Quantidade;

    @Column(name = "Preco_Unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal Preco_Unitario;

    @Column(name = "Valor_Total_Item", nullable = false, precision = 10, scale = 2)
    private BigDecimal Valor_Total_Item;
}
