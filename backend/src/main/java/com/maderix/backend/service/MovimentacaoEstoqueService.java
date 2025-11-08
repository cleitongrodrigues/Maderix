package com.maderix.backend.service;

import com.maderix.backend.enums.TipoMovimento;
import com.maderix.backend.exception.BusinessRuleException;
import com.maderix.backend.exception.ResourceNotFoundException;
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

        Materiais material = materiaisRepository.findById(movimentacao.getIdMaterial().getIdMaterial())
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado."));

        if (movimentacao.getTipoMovimento().equals(TipoMovimento.ENTRADA) || movimentacao.getTipoMovimento().equals(TipoMovimento.AJUSTE)) {
            material.setEstoqueAtual(material.getEstoqueAtual() + movimentacao.getQuantidade());
        } else if (movimentacao.getTipoMovimento().equals(TipoMovimento.SAIDA)) {
            if (material.getEstoqueAtual() < movimentacao.getQuantidade()) {
                throw new BusinessRuleException("Estoque insuficiente para a movimentação.");
            }
            material.setEstoqueAtual(material.getEstoqueAtual() - movimentacao.getQuantidade());
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
