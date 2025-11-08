package com.maderix.backend.model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "USUARIOS")
public class Usuarios implements UserDetails{

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Usuario")
    private Integer idUsuario;

    @ManyToOne
    @JoinColumn(name = "ID_Empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "ID_Perfil", nullable = false)
    private PerfisUsuario  perfil;

    @Column(name = "NM_Usuario", length = 150, nullable = false)
    private String nmUsuario;

    @Column(name = "Email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "NM_Login", length = 50 ,nullable = false, unique = true)
    private String nmLogin;

    @Column(name = "SENHA_HASH", length = 200, nullable = false)
    private String senhaHash;

    @Column(name = "Tel_Usuario", length = 20)
    private String telUsuario;

    @Column(name = "Ativo", nullable = false)
    private Boolean ativo = true;

    @Column(name = "ULTIMO_LOGIN", nullable = true)
    private LocalDateTime ultimoLogin;

    @Column(name = "Senha", length = 255, nullable = false)
    private String senha;

    @Column(name = "DT_Cad_Usuario", updatable = false)
    @CreationTimestamp //Registra a data do sistema
    private LocalDateTime dataCadUsuario;

    public Usuarios(){}

    public Integer getIdUsuario() {
        return this.idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Empresa getEmpresa() {
        return this.empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public PerfisUsuario getPerfil() {
        return this.perfil;
    }

    public void setPerfil(PerfisUsuario perfil) {
        this.perfil = perfil;
    }

    public String getNmUsuario() {
        return this.nmUsuario;
    }

    public void setNmUsuario(String nmUsuario) {
        this.nmUsuario = nmUsuario;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNmLogin() {
        return this.nmLogin;
    }

    public void setNmLogin(String nmLogin) {
        this.nmLogin = nmLogin;
    }

    public String getSenhaHash() {
        return this.senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public String getTelUsuario() {
        return this.telUsuario;
    }

    public void setTelUsuario(String telUsuario) {
        this.telUsuario = telUsuario;
    }

    public Boolean isAtivo() {
        return this.ativo;
    }

    public Boolean getAtivo() {
        return this.ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getUltimoLogin() {
        return this.ultimoLogin;
    }

    public void setUltimoLogin(LocalDateTime ultimoLogin) {
        this.ultimoLogin = ultimoLogin;
    }

    public String getSenha() {
        return this.senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public LocalDateTime getDataCadUsuario() {
        return this.dataCadUsuario;
    }

    public void setDataCadUsuario(LocalDateTime dataCadUsuario) {
        this.dataCadUsuario = dataCadUsuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Retorna as autoridades/permissões do usuário
        // Neste exemplo, estamos usando o perfil para definir a autoridade básica
        // Se você tiver a entidade Permissoes mapeada, use ela.
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.perfil.getNmPerfil().toUpperCase()));
    }

    @Override
    public String getPassword() {
        // Retorna o hash da senha
        return senhaHash;
    }

    @Override
    public String getUsername() {
        // Retorna o identificador único (o login neste caso)
        return nmLogin;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Contas nunca expiram
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Contas nunca são bloqueadas
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credenciais nunca expiram
    }

    @Override
    public boolean isEnabled() {
        // Retorna o status de ativo (seu campo Ativo)
        return ativo; 
    }
}

