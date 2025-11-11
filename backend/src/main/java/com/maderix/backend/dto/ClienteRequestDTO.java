package com.maderix.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ClienteRequestDTO {

    @NotNull(message = "ID da empresa é obrigatório")
    private Integer idEmpresa;

    @NotBlank(message = "Nome do cliente é obrigatório")
    @Size(max = 150, message = "Nome não pode ter mais de 150 caracteres")
    private String nmCliente;

    @Size(max = 20, message = "Telefone não pode ter mais de 20 caracteres")
    private String telCliente;

    @Email(message = "Email deve ser válido")
    @Size(max = 100, message = "Email não pode ter mais de 100 caracteres")
    private String email;

    public Integer getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(Integer idEmpresa) {
        this.idEmpresa = idEmpresa;
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
}
