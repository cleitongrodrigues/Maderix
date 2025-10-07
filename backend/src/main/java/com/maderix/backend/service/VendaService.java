package com.maderix.backend.service;

import com.maderix.backend.enums.TipoMovimento;
import com.maderix.backend.model.ItensVenda;
import com.maderix.backend.model.Materiais;
import com.maderix.backend.model.MovimentacaoEstoque;
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
    public Vendas registrarNovaVenda(Vendas novaVenda) {
        if (novaVenda.getID_Cliente() == null) {
            throw new IllegalArgumentException("Cliente é obrigatório para registrar uma venda.");
        }
        clientesRepository.findById(novaVenda.getID_Cliente().getID_Cliente())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        BigDecimal valorTotalVenda = BigDecimal.ZERO;

        if (novaVenda.getItensVendas() != null) {
            for(ItensVenda item: novaVenda.getItensVendas()){
                Materiais material = materiaisRepository.findById(item.getID_Material().getID_Material())
                        .orElseThrow(() -> new RuntimeException(
                                String.format("Material com ID %d não encontrado.", item.getID_Material().getID_Material())
                        ));

                if (material.getEstoque_Atual() < item.getQuantidade()){
                    throw new RuntimeException("Estoque insuficiente para o material: " + material.getNM_Material());
                }

                BigDecimal valorTotalItem = material.getPreco_Custo().multiply(BigDecimal.valueOf(item.getQuantidade()));
                item.setValor_Total_Item(valorTotalItem);

                item.setID_Venda(novaVenda);

                MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
                movimentacao.setID_Material(material);
                movimentacao.setQuantidade(item.getQuantidade());
                movimentacao.setTipo_Movimento(TipoMovimento.SAIDA);

                movimentacaoEstoqueService.registrarMovimentacao(movimentacao);
                itensVendaRepository.save(item);

                valorTotalVenda = valorTotalVenda.add(valorTotalItem);
            }
        }

        novaVenda.setValor_Total(valorTotalVenda);
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