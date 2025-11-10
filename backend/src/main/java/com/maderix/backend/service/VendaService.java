package com.maderix.backend.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maderix.backend.exception.BusinessRuleException;
import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.model.ItensVenda;
import com.maderix.backend.model.MovimentacaoEstoque;
import com.maderix.backend.model.Vendas;
import com.maderix.backend.model.Materiais;
import com.maderix.backend.model.Clientes;
import com.maderix.backend.model.Empresa;
import com.maderix.backend.dto.ItemVendaRequestDTO;
import com.maderix.backend.dto.VendaRequestDTO;
import com.maderix.backend.enums.TipoMovimento;
import com.maderix.backend.repository.VendasRepository;
import com.maderix.backend.repository.ClientesRepository;
import com.maderix.backend.repository.MateriaisRepository;
import com.maderix.backend.repository.EmpresaRepository;

@Service
public class VendaService {

    @Autowired
    private ClientesRepository clientesRepository;

    @Autowired
    private VendasRepository vendasRepository;

    @Autowired
    private MovimentacaoEstoqueService movimentacaoEstoqueService;

    @Autowired
    private MateriaisRepository materiaisRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private ContasReceberService contasReceberService;

    @Transactional
    public Vendas registrarNovaVenda(VendaRequestDTO vendaRequestDTO, com.maderix.backend.model.Usuarios usuarioLogado){
        // Valida e busca Cliente
        Clientes cliente = clientesRepository.findById(vendaRequestDTO.getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado."));

        // Valida e busca Empresa
        Empresa empresa = empresaRepository.findById(vendaRequestDTO.getIdEmpresa())
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada."));

        // Cria a entidade Venda
        Vendas venda = new Vendas();
        venda.setCliente(cliente);
        venda.setEmpresa(empresa);
        venda.setUsuario(usuarioLogado);
        venda.setStatusVenda("ABERTA");

        BigDecimal valorTotalVenda = BigDecimal.ZERO;

        // Processa os itens da venda
        if (vendaRequestDTO.getItens() != null && !vendaRequestDTO.getItens().isEmpty()) {
            for (ItemVendaRequestDTO itemDTO : vendaRequestDTO.getItens()) {
                // Busca o Material
                Materiais material = materiaisRepository.findById(itemDTO.getIdMaterial())
                        .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado: " + itemDTO.getIdMaterial()));

                // Define o preço unitário (do DTO ou do Material)
                BigDecimal precoUnitario = itemDTO.getValorUnitario();
                if (precoUnitario == null) {
                    precoUnitario = material.getPrecoVenda() != null 
                        ? material.getPrecoVenda() 
                        : material.getPrecoCusto();
                }

                if (precoUnitario == null) {
                    throw new BusinessRuleException("Não foi possível determinar o preço para o material: " + material.getNmMaterial());
                }

                // Cria o item da venda
                ItensVenda itemVenda = new ItensVenda();
                itemVenda.setIdMaterial(material);
                itemVenda.setQuantidade(itemDTO.getQuantidade());
                itemVenda.setPrecoUnitario(precoUnitario);
                itemVenda.setValorTotalItem(precoUnitario.multiply(new BigDecimal(itemDTO.getQuantidade())));
                itemVenda.setID_Venda(venda);

                // Adiciona o item à venda
                if (venda.getItensVendas() == null) {
                    venda.setItensVendas(new java.util.ArrayList<>());
                }
                venda.getItensVendas().add(itemVenda);

                // Soma ao valor total
                valorTotalVenda = valorTotalVenda.add(itemVenda.getValorTotalItem());

                // Registra movimentação de estoque (SAÍDA)
                MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
                movimentacao.setIdMaterial(material);
                movimentacao.setQuantidade(itemDTO.getQuantidade());
                movimentacao.setTipoMovimento(TipoMovimento.SAIDA);
                movimentacao.setValorUnitario(precoUnitario);
                movimentacao.setIdUsuario(usuarioLogado);
                movimentacaoEstoqueService.registrarMovimentacao(movimentacao);
            }
        } else {
            throw new BusinessRuleException("A venda deve conter pelo menos um item.");
        }

        // Define o valor total da venda
        venda.setValorTotal(valorTotalVenda);

        // Salva a venda com os itens
        Vendas vendaSalva = vendasRepository.save(venda);

        // Gera automaticamente uma conta a receber para esta venda
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