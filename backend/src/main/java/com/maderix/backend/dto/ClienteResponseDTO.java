package com.maderix.backend.dto;

import java.time.LocalDateTime;

import com.maderix.backend.model.Clientes;

public class ClienteResponseDTO {

    private Integer idCliente;
    private Integer idEmpresa;
    private String nomeEmpresa;
    private String nmCliente;
    private String telCliente;
    private String email;
    private LocalDateTime dataCadCliente;

    // Construtor que converte Model para DTO
    public ClienteResponseDTO(Clientes cliente) {
        this.idCliente = cliente.getIdCliente();
        this.idEmpresa = cliente.getIdEmpresa() != null ? cliente.getIdEmpresa().getIdEmpresa() : null;
        this.nomeEmpresa = cliente.getIdEmpresa() != null ? cliente.getIdEmpresa().getNmFantasia() : null;
        this.nmCliente = cliente.getNmCliente();
        this.telCliente = cliente.getTelCliente();
        this.email = cliente.getEmail();
        this.dataCadCliente = cliente.getDataCadCliente();
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public Integer getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(Integer idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getNomeEmpresa() {
        return nomeEmpresa;
    }

    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }

    public String getNmCliente() {
        return nmCliente;
    }

    public void setNmCliente(String nmCliente) {
        this.nmCliente = nmCliente;
    }

    public String getTelCliente() {
        return telCliente;
    }

    public void setTelCliente(String telCliente) {
        this.telCliente = telCliente;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getDataCadCliente() {
        return dataCadCliente;
    }

    public void setDataCadCliente(LocalDateTime dataCadCliente) {
        this.dataCadCliente = dataCadCliente;
    }
}
