package com.maderix.backend.service;

import java.util.List;
import java.util.Optional;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.model.Permissoes;
import com.maderix.backend.repository.PermissoesRepository;

@Service
public class PermissoesService {

    @Autowired
    private PermissoesRepository permissoesRepository;

    public Permissoes criarPermissao(Permissoes permissao){
        return permissoesRepository.save(permissao);
    }

    public List<Permissoes> buscarTodasPermissoes(){
        return permissoesRepository.findAll();
    }

    public Optional<Permissoes> buscarPermissaoPorId(Integer id){
        return permissoesRepository.findById(id);
    }

    public Permissoes atualizarPermissao(Integer id, Permissoes detalhesPermissao) {
        Permissoes permissaoExistente = permissoesRepository.findById(id)
                                                            .orElseThrow(() -> new ResourceNotFoundException("Permissão com ID " + id + " não encontrada."));

        permissaoExistente.setNome(detalhesPermissao.getNome());
        permissaoExistente.setDescricao(detalhesPermissao.getDescricao());
        

        return permissoesRepository.save(permissaoExistente);
    }

    public void deletarPermissao(Integer id) {
        if (!permissoesRepository.existsById(id)) {
            throw new ResourceNotFoundException("Permissão com ID " + id + " não encontrada para deleção.");
        }

        permissoesRepository.deleteById(id);
    }
}
