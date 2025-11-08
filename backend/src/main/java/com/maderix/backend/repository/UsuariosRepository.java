package com.maderix.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.maderix.backend.model.Usuarios;

public interface UsuariosRepository extends JpaRepository<Usuarios, Integer> {
    Optional<Usuarios> findByEmail(String email);

    @Query("SELECT u FROM Usuarios u WHERE u.nmLogin = :login")
    Optional<Usuarios> findByNmLogin(@Param("login") String login);
}
