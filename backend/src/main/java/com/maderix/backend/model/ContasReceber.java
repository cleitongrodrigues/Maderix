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
@Table(name = "CONTAS_RECEBER")
public class ContasReceber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Conta")
    private Integer ID_Conta;

    @Column(name = "ID_Venda")
    private Integer ID_Venda;

    @Column(name = "ID_Empresa")
    private Integer ID_Empresa;

    @Column(name = "Descricao", length = 255, nullable = false)
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
}
