package com.maderix.backend.repository;

import com.maderix.backend.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UsuariosRepository extends JpaRepository<Usuarios, Integer> {
    @Query("SELECT u FROM Usuarios u WHERE u.Email = :email")
    Optional<Usuarios> findByEmail(String email);

    Optional<Usuarios> findByNM_Login(String NM_Login);
}
