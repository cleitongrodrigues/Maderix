package com.maderix.backend.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "PERFIS_USUARIO")
public class PerfisUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Perfil")
    private Integer ID_Perfil;

    @Column(name = "NM_Perfil", length = 50, nullable = false, unique = true)
    private String NM_Perfil;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name               = "PERFIL_PERMISSAO", // Nome da tabela de relacionamento
        joinColumns        = @JoinColumn(name = "ID_PERFIL"), //Chave desta entidade
        inverseJoinColumns = @JoinColumn(name = "ID_PERMISSAO") //Chave da outra entidade
    )
    private Set<Permissoes> permissoes; // Coleção de permissoes

    public PerfisUsuario(){}

    public Integer getID_Perfil() {
        return ID_Perfil;
    }

    public void setID_Perfil(Integer ID_Perfil) {
        this.ID_Perfil = ID_Perfil;
    }

    public String getNM_Perfil() {
        return NM_Perfil;
    }

    public void setNM_Perfil(String NM_Perfil) {
        this.NM_Perfil = NM_Perfil;
    }
    
    public Set<Permissoes> getPermissoes() {
    // Se for nulo, inicialize para evitar NullPointerException ao chamar .addAll() ou .removeIf()
    if (this.permissoes == null) {
        this.permissoes = new HashSet<>();
    }
    return this.permissoes;
}

    public void setPermissoes(Set<Permissoes> permissoes) {
        this.permissoes = permissoes;
    }
}
