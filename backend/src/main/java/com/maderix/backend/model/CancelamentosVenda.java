package com.maderix.backend.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "CANCELAMENTO_VENDA")
public class CancelamentosVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Cancelamento")
    private Integer idCancelamento;

    @ManyToOne
    @JoinColumn(name = "ID_Usuario", nullable = false)
    private Usuarios usuario;

    @OneToOne
    @JoinColumn(name = "ID_Venda", nullable = false)
    private Vendas venda;

    @Column(name = "Data_Evento", nullable = false)
    @CreationTimestamp
    private LocalDateTime dataEvento;

    @Column(name = "Motivo", nullable = true, length = 255)
    private String motivo;


    public CancelamentosVenda() {
    }

    public Integer getIdCancelamento() {
        return this.idCancelamento;
    }

    public void setIdCancelamento(Integer ID_Cancelamento) {
        this.idCancelamento = ID_Cancelamento;
    }

    public Usuarios getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuarios usuario) {
        this.usuario = usuario;
    }

    public Vendas getVenda() {
        return this.venda;
    }

    public void setVenda(Vendas venda) {
        this.venda = venda;
    }

    public LocalDateTime getDataEvento() {
        return this.dataEvento;
    }

    public void setDataEvento(LocalDateTime dataEvento) {
        this.dataEvento = dataEvento;
    }

    public String getMotivo() {
        return this.motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}
