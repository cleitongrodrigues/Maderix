package com.maderix.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.dto.MovimentacaoRequestDTO;
import com.maderix.backend.exception.BusinessRuleException;
import com.maderix.backend.model.MovimentacaoEstoque;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.service.MovimentacaoEstoqueService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/movimentacaoEstoque")
public class MovimentacaoEstoqueController {

    @Autowired
    private MovimentacaoEstoqueService movimentacaoEstoqueService;

    @PostMapping
    public ResponseEntity<MovimentacaoEstoque> criarMovimentacao(@Valid @RequestBody MovimentacaoRequestDTO dto){
        // Obter usuário logado do contexto de segurança
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof Usuarios) {
            Usuarios usuarioLogado = (Usuarios) authentication.getPrincipal();
            dto.setIdUsuario(usuarioLogado.getIdUsuario());
        }
        
        // Validações
        if (dto.getIdMaterial() == null) {
            throw new BusinessRuleException("O ID do material é obrigatório.");
        }
        
        if (dto.getTipoMovimento() == null) {
            throw new BusinessRuleException("O tipo de movimentação é obrigatório.");
        }
        
        if (dto.getQuantidade() == null || dto.getQuantidade() <= 0) {
            throw new BusinessRuleException("A quantidade deve ser maior que zero.");
        }
        
        MovimentacaoEstoque movimentacao = movimentacaoEstoqueService.registrarMovimentacao(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(movimentacao);
    }


    @GetMapping
    public ResponseEntity<List<MovimentacaoEstoque>> buscarTodasMovimentacoes(){
        List <MovimentacaoEstoque> movimentcacoes = movimentacaoEstoqueService.buscarMovimentacoes();
        return ResponseEntity.ok(movimentcacoes);
    }

    @GetMapping("/material/{idMaterial}")
    public ResponseEntity<List<MovimentacaoEstoque>> buscarMovimentacoesPorMaterial(@PathVariable Integer idMaterial) {
        List<MovimentacaoEstoque> movimentacoes = movimentacaoEstoqueService.buscarMovimentacoesPorMaterial(idMaterial);
        return ResponseEntity.ok(movimentacoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimentacaoEstoque> buscarMovimentacoesPorId(@PathVariable Integer id){
        return movimentacaoEstoqueService.buscarMovimentacoesPorId(id)
                                         .map(ResponseEntity::ok)
                                         .orElse(ResponseEntity.notFound().build());
    }

}
