package com.maderix.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.model.MovimentacaoEstoque;
import com.maderix.backend.service.MovimentacaoEstoqueService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("api/movimentacaoEstoque")
public class MovimentacaoEstoqueController {

    @Autowired
    private MovimentacaoEstoqueService movimentacaoEstoqueService;

    @PostMapping
    public ResponseEntity<MovimentacaoEstoque> registrarMovimentacao(@RequestBody MovimentacaoEstoque movimentacao){
        MovimentacaoEstoque novaMovimentacao = movimentacaoEstoqueService.registrarMovimentacao(movimentacao);

        return ResponseEntity.status(HttpStatus.CREATED).body(novaMovimentacao);
    }

    @GetMapping
    public ResponseEntity<List<MovimentacaoEstoque>> buscarTodasMovimentacoes(){
        List <MovimentacaoEstoque> movimentcacoes = movimentacaoEstoqueService.buscarMovimentacoes();

        return ResponseEntity.ok(movimentcacoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimentacaoEstoque> buscarMovimentacoesPorId(@PathVariable Integer id){
        return movimentacaoEstoqueService.buscarMovimentacoesPorId(id)
                                         .map(ResponseEntity::ok)
                                         .orElse(ResponseEntity.notFound().build());
    }

}
