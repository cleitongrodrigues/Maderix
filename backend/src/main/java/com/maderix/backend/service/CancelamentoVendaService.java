package com.maderix.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.maderix.backend.dto.CancelamentoVendaRequestDTO;
import com.maderix.backend.enums.TipoMovimento;
import com.maderix.backend.exception.BusinessRuleException;
import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.model.CancelamentosVenda;
import com.maderix.backend.model.ContasReceber;
import com.maderix.backend.model.ItensVenda;
import com.maderix.backend.model.Materiais;
import com.maderix.backend.model.MovimentacaoEstoque;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.model.Vendas;
import com.maderix.backend.repository.CancelamentosVendaRepository;
import com.maderix.backend.repository.ContasReceberRepository;
import com.maderix.backend.repository.ItensVendaRepository;
import com.maderix.backend.repository.MateriaisRepository;
import com.maderix.backend.repository.UsuariosRepository;
import com.maderix.backend.repository.VendasRepository;

import jakarta.transaction.Transactional;

@Service
public class CancelamentoVendaService {

    @Autowired private VendasRepository vendasRepository;
    @Autowired private UsuariosRepository usuariosRepository;
    @Autowired private ItensVendaRepository itensVendaRepository; // Para buscar os itens da venda
    @Autowired private CancelamentosVendaRepository cancelamentosVendaRepository; // Crie este Repository
    @Autowired private ContasReceberRepository contasReceberRepository; // Para cancelar a conta
    @Autowired private MateriaisRepository materiaisRepository; // Para atualizar o estoque
    @Autowired private MovimentacaoEstoqueService movimentacaoEstoqueService; // Para registrar o estorno

    @Transactional
    public CancelamentosVenda cancelarVenda(CancelamentoVendaRequestDTO dto, Usuarios usuarioLogado){
        //Busca e valida as entidades necessárias 
        Vendas venda = vendasRepository.findById(dto.getIdVenda())
                                       .orElseThrow(() -> new ResourceNotFoundException("Venda com ID " + dto.getIdVenda() + " não encontrada."));

        Usuarios usuario = usuariosRepository.findById(dto.getIdUsuario())
                                             .orElseThrow(() -> new ResourceNotFoundException("Usuário de cancelamento não encontrado."));                                       

        if(venda.getStatusVenda().equals("CANCELADA")){
            throw new BusinessRuleException("A venda já está cancelada.");
        }

        List<ItensVenda> itens = itensVendaRepository.findItensByVendaId(dto.getIdVenda());

        //Reversão da saida dos materiais do estoque
        for(ItensVenda item : itens){
            Materiais material = item.getIdMaterial();
            int quantidadeEstornada = item.getQuantidade();

            MovimentacaoEstoque movimento = new MovimentacaoEstoque();
            movimento.setIdMaterial(material);
            movimento.setIdUsuario(usuario);
            movimento.setIdVenda(venda);
            movimento.setTipoMovimento(TipoMovimento.ENTRADA);
            movimento.setQuantidade(quantidadeEstornada);
            movimento.setValorUnitario(material.getPrecoCusto());
            movimento.setObservacao("Estorno de venda ID " + venda.getIdVenda() + " - Motivo: " + dto.getMotivo());

            //Chama o service que espera um objeto MovimentacaoEstoque
            movimentacaoEstoqueService.registrarMovimentacao(movimento);

            //Atualiza o Estoque do Material
            material.setEstoqueAtual(material.getEstoqueAtual() + quantidadeEstornada);
            materiaisRepository.save(material);
        }

        
        //Cancelar a conta a receber
        
        Optional<ContasReceber> optionalConta = contasReceberRepository.findById(venda.getIdVenda());
        if(optionalConta.isPresent()){
            ContasReceber conta = optionalConta.get();

            if(!conta.isPago()){
                conta.setCancelado(true);
                contasReceberRepository.save(conta);
            } else {
                throw new BusinessRuleException("Venda não pode ser cancelada diretamente pois a conta associada ja foi paga. Necessário extorno financeiro.");
            }
        }

        //Atualiza status da venda
        venda.setStatusVenda("CANCELADA");
        vendasRepository.save(venda);

        //Registra o cancelamento
        CancelamentosVenda cancelamento = new CancelamentosVenda();
        cancelamento.setVenda(venda);
        cancelamento.setUsuario(usuario);
        cancelamento.setMotivo(dto.getMotivo());

        return cancelamentosVendaRepository.save(cancelamento);
    }     
    
    public Optional<CancelamentosVenda> buscarPorVenda(Integer idVenda){
    Vendas venda = vendasRepository.findById(idVenda)
                                    .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada."));

    return cancelamentosVendaRepository.findByVenda(venda);                                          
}
}
