package com.maderix.backend.service;

import com.maderix.backend.dto.MovimentacaoRequestDTO;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class MovimentacaoEstoqueService {

    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    @Autowired
    private MateriaisRepository materiaisRepository;

    @Transactional
    public MovimentacaoEstoque registrarMovimentacao(MovimentacaoRequestDTO dto){
        Integer matId = dto.getIdMaterial();
        Materiais material = materiaisRepository.findById(matId)
            .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado. id=" + matId));

        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setIdMaterial(material);
        movimentacao.setQuantidade(dto.getQuantidade() == null ? 0 : dto.getQuantidade());
        movimentacao.setTipoMovimento(dto.getTipoMovimento());
        movimentacao.setValorUnitario(dto.getValorUnitario());
        movimentacao.setObservacao(dto.getObservacao());
        // set idUsuario, idVenda se necessário carregando as entidades correspondentes...
        return registrarMovimentacao(movimentacao); // reusa validação existente
    }

    @Transactional
    public MovimentacaoEstoque registrarMovimentacao(MovimentacaoEstoque movimentacao) {
        if (movimentacao.getIdMaterial() == null || movimentacao.getIdMaterial().getIdMaterial() == null) {
            throw new ResourceNotFoundException("Material da movimentação não informado.");
        }

        Integer matId = movimentacao.getIdMaterial().getIdMaterial();
        Materiais material = materiaisRepository.findById(matId)
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado. id=" + matId));

        // Determinar valorUnitario (prioriza valor já fornecido)
        BigDecimal valorUnitario = movimentacao.getValorUnitario();
        if (valorUnitario == null) {
            if (material.getPrecoVenda() != null) valorUnitario = material.getPrecoVenda();
            else if (material.getPrecoCusto() != null) valorUnitario = material.getPrecoCusto();
        }

        if (valorUnitario == null) {
            throw new BusinessRuleException("valorUnitario da movimentação não informado e não foi possível inferir a partir do material.");
        }

        movimentacao.setValorUnitario(valorUnitario);

        // Atualiza estoque conforme tipoMovimento
        if (movimentacao.getTipoMovimento() == null) {
            throw new BusinessRuleException("Tipo de movimento obrigatório na movimentação de estoque.");
        }

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
