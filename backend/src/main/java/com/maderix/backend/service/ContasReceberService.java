package com.maderix.backend.service;

import com.maderix.backend.model.ContasReceber;
import com.maderix.backend.model.Vendas;
import com.maderix.backend.repository.ContasReceberRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContasReceberService {
    @Autowired
    private ContasReceberRepository contasReceberRepository;

    @Transactional
    public ContasReceber gerarConta(Vendas venda) {
        ContasReceber conta = new ContasReceber();
        conta.setVenda(venda);
        conta.setEmpresa(venda.getEmpresa());
        conta.setValor(venda.getValorTotal());
        
        // Define o nome do cliente
        if (venda.getCliente() != null) {
            conta.setCliente(venda.getCliente().getNmCliente());
        }
        
        // Gera um número de conta baseado no ID da venda
        conta.setNumero("VENDA-" + venda.getIdVenda());
        
        // Define descrição mais detalhada
        String descricao = "Venda #" + venda.getIdVenda();
        if (venda.getCliente() != null) {
            descricao += " - Cliente: " + venda.getCliente().getNmCliente();
        }
        conta.setDescricao(descricao);
        
        // Define vencimento para 30 dias
        conta.setDataVencimento(LocalDateTime.now().plusDays(30));
        conta.setPago(false);
        conta.setCancelado(false);

        return contasReceberRepository.save(conta);
    }

    public List<ContasReceber> buscarTodasContasReceber(){
        return contasReceberRepository.findAll();
    }

    public Optional<ContasReceber> buscarPorId(Integer id) {
        return contasReceberRepository.findById(id);
    }

    @Transactional
    public ContasReceber marcarComoPaga(Integer id) {
        ContasReceber conta = contasReceberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conta a receber não encontrada"));
        conta.setPago(true);
        conta.setDataPagamento(LocalDateTime.now());
        return contasReceberRepository.save(conta);
    }

}
