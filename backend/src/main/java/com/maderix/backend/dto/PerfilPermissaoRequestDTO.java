package com.maderix.backend.dto;

import java.util.Set;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class PerfilPermissaoRequestDTO {

    @NotNull(message = "A lista de IDs de permissão é obrigatória.")
    @NotEmpty(message = "A lista de IDs de permissão não pode estar vazia.")
    private Set<Integer> permissoesIds;

    public PerfilPermissaoRequestDTO() {
    }

    public Set<Integer> getPermissoesIds() { return permissoesIds; }
    public void setPermissoesIds(Set<Integer> permissoesIds) { this.permissoesIds = permissoesIds; }

}   
