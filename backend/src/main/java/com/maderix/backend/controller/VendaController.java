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

import com.maderix.backend.model.Vendas;
import com.maderix.backend.service.VendaService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("api/venda")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    @PostMapping
    public ResponseEntity<Vendas> registrarVenda(@RequestBody Vendas venda){
        Vendas novaVenda = vendaService.registrarNovaVenda(venda);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(novaVenda);
    }

    @GetMapping
    public ResponseEntity<List<Vendas>> buscarTodasVendas(){
        List<Vendas> vendas = vendaService.buscarTodasVendas();

        return ResponseEntity.ok(vendas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendas> buscarVendaPorId(@PathVariable Integer id){
        return vendaService.buscarVendaPorId(id)
                           .map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }


}
