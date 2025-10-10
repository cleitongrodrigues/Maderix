package com.maderix.backend.service;

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
    public List<UnidadesMedida> buscarTodadasUnidadesMediada(){
        return unidadesMedidaRepository.findAll();
    }
    public Optional<UnidadesMedida> buscarUnidadeMedidaPorId(Integer id){
        return unidadesMedidaRepository.findById(id);
    }
    public void deletarUnidadeMedida(Integer id){
        unidadesMedidaRepository.deleteById(id);
    }
    public UnidadesMedida atualizaUnidadeMedida(Integer id, UnidadesMedida detalheunidadesMedida){
        UnidadesMedida unidadeMedidaExistente = unidadesMedidaRepository.findById(id)
                                                                        .orElseThrow(() -> new RuntimeException("Unidade de Medida com o id: " + id + " não encontrado"));

        unidadeMedidaExistente.setSigla(detalheunidadesMedida.getSigla());
        unidadeMedidaExistente.setDescricao(detalheunidadesMedida.getDescricao());

        return unidadesMedidaRepository.save(unidadeMedidaExistente);
    }
}
