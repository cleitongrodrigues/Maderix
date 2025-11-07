package com.maderix.backend.service;

import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.model.UnidadesMedida;
import com.maderix.backend.repository.UnidadesMedidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UnidadesMedidaService {
    @Autowired
    private UnidadesMedidaRepository unidadesMedidaRepository;

    public UnidadesMedida salvarUnidadeMedida(UnidadesMedida unidade){
        return  unidadesMedidaRepository.save(unidade);
    }
    public List<UnidadesMedida> buscarTodasUnidadesMedida(){
        return unidadesMedidaRepository.findAll();
    }
    public Optional<UnidadesMedida> buscarUnidadeMedidaPorId(Integer id){
        return unidadesMedidaRepository.findById(id);
    }
    public void deletarUnidadeMedida(Integer id){
        if(!unidadesMedidaRepository.existsById(id)){
            throw new ResourceNotFoundException("Unidade de Medida com ID " + id + " não encontrada para deleção.");
        }
        unidadesMedidaRepository.deleteById(id);
    }
    public UnidadesMedida atualizaUnidadeMedida(Integer id, UnidadesMedida detalheunidadesMedida){
        UnidadesMedida unidadeMedidaExistente = unidadesMedidaRepository.findById(id)
                                                                        .orElseThrow(() -> new ResourceNotFoundException("Unidade de Medida com o id: " + id + " não encontrado"));

        unidadeMedidaExistente.setSigla(detalheunidadesMedida.getSigla());
        unidadeMedidaExistente.setDescricao(detalheunidadesMedida.getDescricao());

        return unidadesMedidaRepository.save(unidadeMedidaExistente);
    }
}
