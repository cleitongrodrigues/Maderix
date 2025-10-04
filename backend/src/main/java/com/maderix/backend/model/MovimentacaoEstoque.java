package com.maderix.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "MOVIMENTACAO_ESTOQUE")
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Movimentacao")
    private Integer ID_Movimentacao;

    @ManyToOne
    @JoinColumn(name = "ID_Material", nullable = false)
    private Integer ID_Material;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Integer ID_Empresa;

    @Column(name = "Tipo_Movimento", nullable = false, length = 50) // Adequar com a regra do banco depois (Criari um enum com os tipos de movimentação e passar aqui)
    private String Tipo_Movimetno;

    @Column(name = "Quantidade", nullable = false)
    private Integer Quantidade;

    @Column(name = "Valor_Unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal Valor_Unitario;

    @Column(name = "Observacao", nullable = true, length = 255)
    private String Observacao;

    @Column(name = "DT_Movimentacao", nullable = false)
    @CreationTimestamp
    private LocalDateTime DT_Movimentacao;
}
