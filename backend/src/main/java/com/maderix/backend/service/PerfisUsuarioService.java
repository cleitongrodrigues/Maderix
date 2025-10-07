package com.maderix.backend.service;

import com.maderix.backend.model.PerfisUsuario;
import com.maderix.backend.repository.PerfisUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PerfisUsuarioService {
    @Autowired
    private PerfisUsuarioRepository perfisUsuarioRepository;

    public PerfisUsuario salvarPerfil(PerfisUsuario perfisUsuario){
        return perfisUsuarioRepository.save(perfisUsuario);
    }

    public List<PerfisUsuario> buscarTodosPerfis(){
        return perfisUsuarioRepository.findAll();
    }

    public Optional<PerfisUsuario> buscarPerilPorId(Integer id){
        return perfisUsuarioRepository.findById(id);
    }

}
