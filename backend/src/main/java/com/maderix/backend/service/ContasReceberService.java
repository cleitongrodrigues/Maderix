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
        conta.setDescricao("Conta a receber gerada automaticamente pela venda " + venda.getIdVenda());
        conta.setDataVencimento(LocalDateTime.now().plusDays(30));
        conta.setPago(false);

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
