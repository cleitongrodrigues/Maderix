package com.maderix.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.model.Permissoes;
import com.maderix.backend.service.PermissoesService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/permissoes")
public class PermissoesController {

    @Autowired
    private PermissoesService permissoesService;

    @PostMapping
    public ResponseEntity<Permissoes> criarPermissao(@Valid @RequestBody Permissoes permissao){
        Permissoes novaPermissao = permissoesService.criarPermissao(permissao);

        return ResponseEntity.status(HttpStatus.CREATED).body(novaPermissao);
    }

    @GetMapping
    public ResponseEntity<List<Permissoes>> buscarTodasPermissoes(){
        List<Permissoes> permissoes = permissoesService.buscarTodasPermissoes();

        return ResponseEntity.ok(permissoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Permissoes> buscarPermissaoPorId(@PathVariable Integer id){
        return permissoesService.buscarPermissaoPorId(id)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Permissoes> atualizarPermissao(@PathVariable Integer id, @Valid @RequestBody Permissoes detalhePermissao){
        Permissoes permissaoAtualizada = permissoesService.atualizarPermissao(id, detalhePermissao);

        return ResponseEntity.ok(permissaoAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPermissao(@PathVariable Integer id){
        permissoesService.deletarPermissao(id);

        return ResponseEntity.noContent().build();
    }

}
