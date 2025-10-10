package com.maderix.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.maderix.backend.model.UnidadesMedida;
import com.maderix.backend.service.UnidadesMedidaService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("api/unidadeMedida")
public class UnidadeMedidaController {

    @Autowired
    private UnidadesMedidaService unidadesMedidaService;

    @PostMapping
    public ResponseEntity<UnidadesMedida> criarUnidadeMedida(@RequestBody UnidadesMedida unidadeMedida){
        UnidadesMedida novaUnidadeMedida = unidadesMedidaService.salvarUnidadeMedida(unidadeMedida);

        return ResponseEntity.status(HttpStatus.CREATED).body(novaUnidadeMedida);
    }

    @GetMapping
    public ResponseEntity <List<UnidadesMedida>> buscarTodasUnidadesMedida(){
        List<UnidadesMedida> unidadeMedida = unidadesMedidaService.buscarTodadasUnidadesMediada();

        return ResponseEntity.ok(unidadeMedida);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnidadesMedida> buscarUnidadeMedidaPorId(@PathVariable Integer id){
        return unidadesMedidaService.buscarUnidadeMedidaPorId(id)
                                    .map(ResponseEntity::ok)
                                    .orElse(ResponseEntity.notFound().build());
    }   

    @PostMapping("/{id}")
    public ResponseEntity<UnidadesMedida> atualizarUnidadeMedida(@PathVariable Integer id, @RequestBody UnidadesMedida unidadeMedida){
        UnidadesMedida unidadeMedidaAtualizada = unidadesMedidaService.atualizaUnidadeMedida(id, unidadeMedida);

        return ResponseEntity.ok(unidadeMedidaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletaUnidadeMedida(@PathVariable Integer id){
        unidadesMedidaService.deletarUnidadeMedida(id);

        return ResponseEntity.noContent().build();
    }
}
