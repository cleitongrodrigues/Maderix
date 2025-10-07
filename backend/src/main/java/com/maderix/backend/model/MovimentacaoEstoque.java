package com.maderix.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.maderix.backend.enums.TipoMovimento;
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
    private Materiais ID_Material;

    @ManyToOne
    @JoinColumn(name = "ID_Venda")
    private Vendas ID_Venda;

    @ManyToOne
    @JoinColumn(name = "ID_Usuario")
    private Usuarios ID_Usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "Tipo_Movimento", nullable = false, length = 50)
    private TipoMovimento Tipo_Movimento;

    @Column(name = "Quantidade", nullable = false)
    private Integer Quantidade;

    @Column(name = "Valor_Unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal Valor_Unitario;

    @Column(name = "Observacao", nullable = true, length = 255)
    private String Observacao;

    @Column(name = "DT_Movimentacao", nullable = false)
    @CreationTimestamp
    private LocalDateTime DT_Movimentacao;

    public MovimentacaoEstoque(){}

    public Integer getID_Movimentacao() {
        return ID_Movimentacao;
    }

    public void setID_Movimentacao(Integer ID_Movimentacao) {
        this.ID_Movimentacao = ID_Movimentacao;
    }

    public Materiais getID_Material() {
        return ID_Material;
    }

    public void setID_Material(Materiais ID_Material) {
        this.ID_Material = ID_Material;
    }

    public Vendas getID_Venda() {
        return ID_Venda;
    }

    public void setID_Venda(Vendas ID_Venda) {
        this.ID_Venda = ID_Venda;
    }

    public Usuarios getID_Usuario() {
        return ID_Usuario;
    }

    public void setID_Usuario(Usuarios ID_Usuario) {
        this.ID_Usuario = ID_Usuario;
    }

    public TipoMovimento getTipo_Movimento() {
        return Tipo_Movimento;
    }

    public void setTipo_Movimento(TipoMovimento tipo_Movimento) {
        Tipo_Movimento = tipo_Movimento;
    }

    public Integer getQuantidade() {
        return Quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        Quantidade = quantidade;
    }

    public BigDecimal getValor_Unitario() {
        return Valor_Unitario;
    }

    public void setValor_Unitario(BigDecimal valor_Unitario) {
        Valor_Unitario = valor_Unitario;
    }

    public String getObservacao() {
        return Observacao;
    }

    public void setObservacao(String observacao) {
        Observacao = observacao;
    }

    public LocalDateTime getDT_Movimentacao() {
        return DT_Movimentacao;
    }

    public void setDT_Movimentacao(LocalDateTime DT_Movimentacao) {
        this.DT_Movimentacao = DT_Movimentacao;
    }
}
