package com.maderix.backend.service;

import com.maderix.backend.model.Usuarios;
import com.maderix.backend.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuariosService {
    @Autowired
    private UsuariosRepository usuariosRepository;

    public Usuarios salvarUsuario (Usuarios usuario){
        return usuariosRepository.save(usuario);
    }

    public List<Usuarios> buscarTodosUsuarios(){
        return usuariosRepository.findAll();
    }

    public Optional<Usuarios> buscarUsuarioPorEmail(String email){
        return usuariosRepository.findByEmail(email);
    }
}
