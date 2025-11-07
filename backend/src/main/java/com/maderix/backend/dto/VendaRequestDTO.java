package com.maderix.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class VendaRequestDTO {

    @NotNull(message = "O ID do Cliente é obrigatório.")
    private Integer idCliente;
    
    @NotNull(message = "O ID da Empresa é obrigatório.")
    private Integer idEmpresa; 

    @NotNull(message = "A venda deve conter pelo menos um item.")
    @NotEmpty(message = "A lista de itens não pode estar vazia.")
    private List<ItemVendaRequestDTO> itens; // <-- Lista de DTOs de Item
    

    // ... Getters e Setters
    public Integer getIdCliente() { return idCliente; }
    public void setIdCliente(Integer idCliente) { this.idCliente = idCliente; }

    public Integer getIdEmpresa() { return idEmpresa; }
    public void setIdEmpresa(Integer idEmpresa) { this.idEmpresa = idEmpresa; }

    public List<ItemVendaRequestDTO> getItens() { return itens; }
    public void setItens(List<ItemVendaRequestDTO> itens) { this.itens = itens; }
}