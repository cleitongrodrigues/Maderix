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
    private Integer idMovimentacao;

    @ManyToOne
    @JoinColumn(name = "ID_Material", nullable = false)
    private Materiais idMaterial;

    @ManyToOne
    @JoinColumn(name = "ID_Venda")
    private Vendas idVenda;

    @ManyToOne
    @JoinColumn(name = "ID_Usuario")
    private Usuarios idUsuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "Tipo_Movimento", nullable = false, length = 50)
    private TipoMovimento tipoMovimento;

    @Column(name = "Quantidade", nullable = false)
    private Integer quantidade;

    @Column(name = "Valor_Unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorUnitario;

    @Column(name = "Observacao", nullable = true, length = 255)
    private String observacao;

    @Column(name = "DT_Movimentacao", nullable = false)
    @CreationTimestamp
    private LocalDateTime dataMovimentacao;

    public MovimentacaoEstoque(){}


    public Integer getIdMovimentacao() {
        return this.idMovimentacao;
    }

    public void setIdMovimentacao(Integer idMovimentacao) {
        this.idMovimentacao = idMovimentacao;
    }

    public Materiais getIdMaterial() {
        return this.idMaterial;
    }

    public void setIdMaterial(Materiais idMaterial) {
        this.idMaterial = idMaterial;
    }

    public Vendas getIdVenda() {
        return this.idVenda;
    }

    public void setIdVenda(Vendas idVenda) {
        this.idVenda = idVenda;
    }

    public Usuarios getIdUsuario() {
        return this.idUsuario;
    }

    public void setIdUsuario(Usuarios idUsuario) {
        this.idUsuario = idUsuario;
    }

    public TipoMovimento getTipoMovimento() {
        return this.tipoMovimento;
    }

    public void setTipoMovimento(TipoMovimento tipoMovimento) {
        this.tipoMovimento = tipoMovimento;
    }

    public Integer getQuantidade() {
        return this.quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getValorUnitario() {
        return this.valorUnitario;
    }

    public void setValorUnitario(BigDecimal valorUnitario) {
        this.valorUnitario = valorUnitario;
    }

    public String getObservacao() {
        return this.observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public LocalDateTime getDataMovimentacao() {
        return this.dataMovimentacao;
    }

    public void setDataMovimentacao(LocalDateTime dataMovimentacao) {
        this.dataMovimentacao = dataMovimentacao;
    }
    
}
