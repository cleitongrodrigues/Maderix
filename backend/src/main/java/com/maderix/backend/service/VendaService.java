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
import com.maderix.backend.dto.ItemVendaRequestDTO;
import com.maderix.backend.dto.ItemVendaResponseDTO;
import com.maderix.backend.enums.TipoMovimento;
import com.maderix.backend.repository.VendasRepository;
import com.maderix.backend.repository.ClientesRepository;
import com.maderix.backend.repository.MateriaisRepository;

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

    @Transactional
    public Vendas registrarNovaVenda(Vendas vendaRequestDTO, com.maderix.backend.model.Usuarios usuarioLogado){
        //Valida e busca as entidades       
        if (vendaRequestDTO.getCliente() == null) {
            throw new IllegalArgumentException("Cliente é obrigatório para registrar uma venda.");
        }
        clientesRepository.findById(vendaRequestDTO.getCliente().getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado."));

        BigDecimal valorTotalVenda = BigDecimal.ZERO;
        vendaRequestDTO.setUsuario(usuarioLogado);

        if (vendaRequestDTO.getItensVendas() != null) {
            for (ItensVenda item : vendaRequestDTO.getItensVendas()) {
                BigDecimal precoUnit = item.getPrecoUnitario();
                Materiais mat = null;

                // tentar obter Materiais a partir do item (caso id ou objeto)
                try {
                    if (item.getIdMaterial() != null) {
                        // se getIdMaterial() já for Materiais
                        mat = item.getIdMaterial();
                    }
                } catch (Exception e) {
                    // ignore
                }

                // se ainda não tem preço, tentar buscar pelo id do material (se possível)
                if (precoUnit == null) {
                    try {
                        Integer idMat = null;
                        try { idMat = item.getIdMaterial().getIdMaterial(); } catch (Exception e) { /* ignore */ }
                        if (idMat == null) {
                            // tenta extrair de outro getter caso exista
                            try { idMat = (Integer) item.getClass().getMethod("getIdMaterialId").invoke(item); } catch (Exception ex) { /* ignore */ }
                        }
                        if (idMat != null) {
                            Optional<Materiais> matOpt = materiaisRepository.findById(idMat);
                            if (matOpt.isPresent()) {
                                mat = matOpt.get();
                                if (mat.getPrecoVenda() != null) precoUnit = mat.getPrecoVenda();
                                else precoUnit = mat.getPrecoCusto();
                            }
                        }
                    } catch (Exception e) {
                        // ignore - validação abaixo
                    }
                }

                if (precoUnit == null) {
                    throw new BusinessRuleException("Não foi possível determinar precoUnitario para um item da venda. Informe precoUnitario no item ou cadastre preco no material.");
                }

                item.setPrecoUnitario(precoUnit);

                MovimentacaoEstoque mov = new MovimentacaoEstoque();
                // atribui material ao movimento (usa o objeto Materiais quando disponível)
                if (mat != null) mov.setIdMaterial(mat);
                else mov.setIdMaterial(item.getIdMaterial());

                mov.setQuantidade(item.getQuantidade());
                mov.setTipoMovimento(TipoMovimento.SAIDA);
                mov.setValorUnitario(precoUnit);
                // usuario de auditoria
                mov.setIdUsuario(usuarioLogado);
                // idVenda pode ser setado depois se desejar; persistimos a movimentação agora
                movimentacaoEstoqueService.registrarMovimentacao(mov);
            }
        }

        return vendasRepository.save(vendaRequestDTO);
    }

    public List<Vendas> buscarTodasVendas() {
        return vendasRepository.findAll();
    }

    public Optional<Vendas> buscarVendaPorId(Integer id) {
        return vendasRepository.findById(id);
    }
}