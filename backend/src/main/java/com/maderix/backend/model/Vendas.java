package com.maderix.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "VENDAS")
public class Vendas {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Venda")
    private Integer ID_Venda;

    @Column(name = "ID_Cliente")
    private Integer ID_Cliente;

    @Column(name = "ID_Usuario")
    private Integer ID_Usuario;

    @Column(name = "Valor_Total", nullable = false, precision = 10, scale = 2)
    private BigDecimal Valor_Total;

    @Column(name = "Status_Venda", nullable = false)
    @org.hibernate.annotations.ColumnDefault("'ABERTA'")
    private String Status_Venda;

    @Column(name = "DT_Venda", updatable = false)
    @CreationTimestamp
    private LocalDateTime DT_Venda;
}
