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
@Table(name = "MATERIAIS")
public class Materiais {

    @Id
    @Column(name = "ID_Material")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ID_Material;

    @Column(name = "ID_Empresa")
    private Integer ID_Empresa;

    @Column(name = "ID_Unidade")
    private Integer ID_Unidade;

    @Column(name = "NM_Material", length = 150, nullable = false)
    private String NM_Material;

    @Column(name = "Descricao", length = 255    )
    private String Descricao;

    @Column(name = "Preco_Custo", nullable = false, precision = 10, scale = 2)
    @org.hibernate.annotations.ColumnDefault("0.00")
    private BigDecimal Preco_Custo; 

    @Column(name = "Estoque_Atual", nullable = false)
    @org.hibernate.annotations.ColumnDefault("0")
    private Integer Estoque_Atual;

    @Column(name = "DT_Cad_Material", nullable = false)
    @CreationTimestamp
    private LocalDateTime DT_Cad_Material;
}
