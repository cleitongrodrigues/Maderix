package com.maderix.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.maderix.backend.dto.PagamentoVendaRequestDTO;
import com.maderix.backend.exception.BusinessRuleException;
import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.model.ContasReceber;
import com.maderix.backend.model.PagamentosVenda;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.model.Vendas;
import com.maderix.backend.repository.ContasReceberRepository;
import com.maderix.backend.repository.PagamentosVendaRepository;
import com.maderix.backend.repository.UsuariosRepository;
import com.maderix.backend.repository.VendasRepository;

import jakarta.transaction.Transactional;

@Service
public class PagamentoVendaService {

    @Autowired
    private ContasReceberRepository contasReceberRepository;

    @Autowired
    private PagamentosVendaRepository pagamentosVendaRepository;

    @Autowired
    private VendasRepository vendasRepository;

    @Autowired
    private ContasReceberService contasReceberService;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Transactional
    public PagamentosVenda registrarPagamento(PagamentoVendaRequestDTO dto){
        //Busca as entidades obrigatórias 
        Vendas venda = vendasRepository.findById(dto.getIdVenda())
                                       .orElseThrow(() -> new ResourceNotFoundException("Venda com ID " + dto.getIdVenda() + " não encontrada."));
        
        Usuarios usuario = usuariosRepository.findById(dto.getIdUsuario())
                                             .orElseThrow(() -> new ResourceNotFoundException("Usuario com ID " + dto.getIdUsuario() + " não encontradao"));                                       

        ContasReceber conta = null;                                             
        if(dto.getIdConta() != null){
            conta = contasReceberService.buscarPorId(dto.getIdConta())
                                        .orElseThrow(() -> new ResourceNotFoundException("Conta a Receber com ID " + dto.getIdVenda() + " não encontrada."));
                                 
            //Checa o Status da conta                                        
            if(conta.isPago()){
                throw new BusinessRuleException("A conta ja está paga.");
            }                                        
            if(conta.getCancelado()){
                throw new BusinessRuleException("A conta está cancelada.");
            }
        }
        
        //Instancia e seta os valores da referencia pagamento
        PagamentosVenda pagamento = new PagamentosVenda();
        pagamento.setVendas(venda); // Seta a Entidade Vendas
        pagamento.setUsuario(usuario); // Seta a Entidade Usuarios
        pagamento.setConta(conta); // Pode ser null
        
        pagamento.setValor(dto.getValor());
        pagamento.setTipo_Pagamento(dto.getTipoPagamento());
        pagamento.setObservacao(dto.getObservacao());
    
        //salva o registro do pagamento
        PagamentosVenda pagamentoSalvo = pagamentosVendaRepository.save(pagamento);

        //Se o pagamento for total marca a conta como paga
        if(conta != null && conta.getValor().compareTo(pagamento.getValor()) <= 0){
            conta.setPago(true);
            conta.setData_Pagamento(LocalDateTime.now());
            contasReceberRepository.save(conta);
        }
        return pagamentoSalvo;
    }

    public List<PagamentosVenda> buscarTodosPagamentos(){
        return pagamentosVendaRepository.findAll();
    }

    public Optional<PagamentosVenda> buscarPorId(Integer id){
        return pagamentosVendaRepository.findById(id);
    }

}
