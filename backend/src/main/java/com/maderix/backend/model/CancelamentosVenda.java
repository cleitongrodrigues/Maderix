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
    private Integer ID_Cancelamento;

    @ManyToOne
    @JoinColumn(name = "ID_Usuario", nullable = false)
    private Usuarios usuario;

    @OneToOne
    @JoinColumn(name = "ID_Venda", nullable = false)
    private Vendas venda;

    @Column(name = "Data_Evento", nullable = false)
    @CreationTimestamp
    private LocalDateTime Data_Evento;

    @Column(name = "Motivo", nullable = true, length = 255)
    private String Motivo;


    public CancelamentosVenda() {
    }

    public Integer getID_Cancelamento() {
        return this.ID_Cancelamento;
    }

    public void setID_Cancelamento(Integer ID_Cancelamento) {
        this.ID_Cancelamento = ID_Cancelamento;
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

    public LocalDateTime getData_Evento() {
        return this.Data_Evento;
    }

    public void setData_Evento(LocalDateTime Data_Evento) {
        this.Data_Evento = Data_Evento;
    }

    public String getMotivo() {
        return this.Motivo;
    }

    public void setMotivo(String Motivo) {
        this.Motivo = Motivo;
    }
}
