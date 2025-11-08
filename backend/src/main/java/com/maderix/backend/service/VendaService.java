package com.maderix.backend.service;

import com.maderix.backend.enums.TipoMovimento;
import com.maderix.backend.exception.BusinessRuleException;
import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.model.ItensVenda;
import com.maderix.backend.model.Materiais;
import com.maderix.backend.model.MovimentacaoEstoque;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.model.Vendas;
import com.maderix.backend.repository.ClientesRepository;
import com.maderix.backend.repository.ItensVendaRepository;
import com.maderix.backend.repository.MateriaisRepository;
import com.maderix.backend.repository.VendasRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class VendaService {
    @Autowired
    private VendasRepository vendasRepository;

    @Autowired
    private ClientesRepository clientesRepository;

    @Autowired
    private MateriaisRepository materiaisRepository;

    @Autowired
    private ItensVendaRepository itensVendaRepository;

    @Autowired
    private MovimentacaoEstoqueService movimentacaoEstoqueService;

    @Autowired
    private ContasReceberService contasReceberService;

    @Transactional
    public Vendas registrarNovaVenda(Vendas novaVenda, Usuarios usuarioLogado) {
        //Valida e busca as entidades       
        if (novaVenda.getCliente() == null) {
            throw new IllegalArgumentException("Cliente é obrigatório para registrar uma venda.");
        }
        clientesRepository.findById(novaVenda.getCliente().getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado."));

        BigDecimal valorTotalVenda = BigDecimal.ZERO;
        novaVenda.setUsuario(usuarioLogado);

        if (novaVenda.getItensVendas() != null) {
            for(ItensVenda item: novaVenda.getItensVendas()){
                Materiais material = materiaisRepository.findById(item.getIdMaterial().getIdMaterial())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                String.format("Material com ID %d não encontrado.", item.getIdMaterial().getIdMaterial())
                        ));

                if (material.getEstoqueAtual() < item.getQuantidade()){
                    throw new BusinessRuleException("Estoque insuficiente para o material: " + material.getNmMaterial());
                }

                BigDecimal valorTotalItem = material.getPrecoCusto().multiply(BigDecimal.valueOf(item.getQuantidade()));
                item.setValorTotalItem(valorTotalItem);

                item.setID_Venda(novaVenda);

                MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
                movimentacao.setIdMaterial(material);
                movimentacao.setQuantidade(item.getQuantidade());
                movimentacao.setTipoMovimento(TipoMovimento.SAIDA);

                movimentacaoEstoqueService.registrarMovimentacao(movimentacao);
                itensVendaRepository.save(item);

                valorTotalVenda = valorTotalVenda.add(valorTotalItem);
            }
        }

        novaVenda.setValorTotal(valorTotalVenda);
        Vendas vendaSalva = vendasRepository.save(novaVenda);

        contasReceberService.gerarConta(vendaSalva);

        return vendaSalva;
    }

    public List<Vendas> buscarTodasVendas() {
        return vendasRepository.findAll();
    }

    public Optional<Vendas> buscarVendaPorId(Integer id) {
        return vendasRepository.findById(id);
    }
}