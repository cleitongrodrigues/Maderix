package com.maderix.backend.service;

import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.model.PerfisUsuario;
import com.maderix.backend.model.Permissoes;
import com.maderix.backend.repository.PerfisUsuarioRepository;
import com.maderix.backend.repository.PermissoesRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PerfisUsuarioService {
    @Autowired
    private PerfisUsuarioRepository perfisUsuarioRepository;

    @Autowired
    private PermissoesRepository permissoesRepository;
    

    public PerfisUsuario salvarPerfil(PerfisUsuario perfisUsuario) {
        return perfisUsuarioRepository.save(perfisUsuario);
    }

    public List<PerfisUsuario> buscarTodosPerfis() {
        return perfisUsuarioRepository.findAll();
    }

    public Optional<PerfisUsuario> buscarPerfilPorId(Integer id) {
        return perfisUsuarioRepository.findById(id);
    }

    public PerfisUsuario atualizarPerfil(Integer id, PerfisUsuario detalhePerfil) {
        PerfisUsuario perfilExistente = perfisUsuarioRepository.findById(id)
                                                               .orElseThrow(() -> new RuntimeException("Perfil com o id: " + id + " não encontrado"));

        perfilExistente.setNmPerfil(detalhePerfil.getNmPerfil());

        return perfisUsuarioRepository.save(perfilExistente);
    }

    @Transactional
    public PerfisUsuario adicionarPermissoes(Integer perfilId, Set<Integer> permissoesIds) {

        PerfisUsuario perfil = perfisUsuarioRepository.findById(perfilId)
                                                      .orElseThrow(() -> new ResourceNotFoundException("Perfil com ID " + perfilId + " não encontrado."));

        Set<Permissoes> permissoesExistentes = new HashSet<>();

        for (Integer permId : permissoesIds) {
            // 1. Busca e valida se cada Permissão existe
            Permissoes permissao = permissoesRepository.findById(permId)
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Permissão com ID " + permId + " não encontrada."));

            permissoesExistentes.add(permissao);
        }

        // 2. Adiciona as novas permissões à coleção existente (Set)
        perfil.getPermissoes().addAll(permissoesExistentes);

        return perfisUsuarioRepository.save(perfil);
    }

    @Transactional
    public PerfisUsuario removerPermissoes(Integer perfilId, Set<Integer> permissoesIds) {
        PerfisUsuario perfil = perfisUsuarioRepository.findById(perfilId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil com ID " + perfilId + " não encontrado."));

        // Remove as permissões da coleção
        perfil.getPermissoes().removeIf(p -> permissoesIds.contains(p.getIdPermissoes()));

        return perfisUsuarioRepository.save(perfil);
    }
}
