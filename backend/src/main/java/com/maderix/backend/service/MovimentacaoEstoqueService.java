package com.maderix.backend.service;

import com.maderix.backend.enums.TipoMovimento;
import com.maderix.backend.model.Materiais;
import com.maderix.backend.model.MovimentacaoEstoque;
import com.maderix.backend.repository.MateriaisRepository;
import com.maderix.backend.repository.MovimentacaoEstoqueRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovimentacaoEstoqueService {

    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    @Autowired
    private MateriaisRepository materiaisRepository;

    @Transactional
    public MovimentacaoEstoque registrarMovimentacao(MovimentacaoEstoque movimentacao) {

        Materiais material = materiaisRepository.findById(movimentacao.getID_Material().getID_Material())
                .orElseThrow(() -> new RuntimeException("Material não encontrado."));

        if (movimentacao.getTipo_Movimento().equals(TipoMovimento.ENTRADA) || movimentacao.getTipo_Movimento().equals(TipoMovimento.AJUSTE)) {
            material.setEstoque_Atual(material.getEstoque_Atual() + movimentacao.getQuantidade());
        } else if (movimentacao.getTipo_Movimento().equals(TipoMovimento.SAIDA)) {
            if (material.getEstoque_Atual() < movimentacao.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para a movimentação.");
            }
            material.setEstoque_Atual(material.getEstoque_Atual() - movimentacao.getQuantidade());
        }

        materiaisRepository.save(material);

        return movimentacaoEstoqueRepository.save(movimentacao);
    }

    public List<MovimentacaoEstoque> buscarMovimentacoes(){
        return movimentacaoEstoqueRepository.findAll();
    }

    public Optional<MovimentacaoEstoque> buscarMovimentacoesPorId(Integer id){
        return movimentacaoEstoqueRepository.findById(id);
    }

}
