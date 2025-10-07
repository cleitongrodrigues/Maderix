package com.maderix.backend.service;

import com.maderix.backend.model.ContasReceber;
import com.maderix.backend.model.Vendas;
import com.maderix.backend.repository.ContasReceberRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ContasReceberService {
    @Autowired
    private ContasReceberRepository contasReceberRepository;

    @Transactional
    public ContasReceber gerarConta(Vendas venda) {
        ContasReceber conta = new ContasReceber();
        conta.setID_Venda(venda);
        conta.setID_Empresa(venda.getID_Empresa());
        conta.setValor(venda.getValor_Total());
        conta.setDescricao("Conta a receber gerada automaticamente pela venda " + venda.getID_Venda());
        conta.setData_Vencimento(LocalDateTime.now().plusDays(30));
        conta.setPago(false);

        return contasReceberRepository.save(conta);
    }

    public Optional<ContasReceber> buscarPorId(Integer id) {
        return contasReceberRepository.findById(id);
    }

    @Transactional
    public ContasReceber marcarComoPaga(Integer id) {
        ContasReceber conta = contasReceberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conta a receber não encontrada"));
        conta.setPago(true);
        conta.setData_Pagamento(LocalDateTime.now());
        return contasReceberRepository.save(conta);
    }

}
