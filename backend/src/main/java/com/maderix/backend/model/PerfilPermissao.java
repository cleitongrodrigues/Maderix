package com.maderix.backend.model;


import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// @Entity
// @Table(name = "PERFIL_PERMISSAO")
public class PerfilPermissao {

    @ManyToOne
    @JoinColumn(name = "ID_PERFIL")
    private PerfisUsuario perfil;

    @ManyToOne
    @JoinColumn(name = "ID_PERMISSAO")
    private Permissoes permissao;


    public PerfisUsuario getPerfil() {
        return this.perfil;
    }

    public void setPerfil(PerfisUsuario perfil) {
        this.perfil = perfil;
    }

    public Permissoes getPermissao() {
        return this.permissao;
    }

    public void setPermissao(Permissoes permissao) {
        this.permissao = permissao;
    }


}
