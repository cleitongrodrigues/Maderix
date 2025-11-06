package com.maderix.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CancelamentoVendaRequestDTO {

    @NotNull(message = "O ID da venda a ser cancelada é obrigatório.")
    private Integer idVenda;

    @NotNull(message = "O ID do Usuario que autorizou o cancelamento é obrigatório.")
    private Integer idUsuario;

    @NotNull(message = "O motivo do cancelamento é obrigatório.")
    @Size(max = 255, message = "O motivo do cancelamento não pode exceder 255 caracteres.")
    private String motivo;

    public CancelamentoVendaRequestDTO() {
    }

    public Integer getIdVenda() {
        return this.idVenda;
    }

    public void setIdVenda(Integer idVenda) {
        this.idVenda = idVenda;
    }

    public Integer getIdUsuario() {
        return this.idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getMotivo() {
        return this.motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}
