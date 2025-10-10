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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.model.Clientes;
import com.maderix.backend.service.ClientesService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("api/clientes")
public class ClienteController {

    @Autowired
    private ClientesService clientesService;

    @PostMapping
    public ResponseEntity <Clientes> criarCliente(@RequestBody Clientes cliente){
        Clientes novoCliente = clientesService.salvarCliente(cliente);

        return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
    }

    @GetMapping
    public ResponseEntity<List<Clientes>> buscarTodosClientes(){
        List<Clientes> clientes = clientesService.buscarTodosClientes();

        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clientes> buscarClientePorId(@PathVariable Integer id){
        return clientesService.buscarClientePorId(id)
                              .map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Clientes> atualizaClientes(@PathVariable Integer id, @RequestBody Clientes detalheCliente){
        Clientes clienteAtualizado = clientesService.atualizaClientes(id, detalheCliente);

        return ResponseEntity.ok(clienteAtualizado);
    }

    @DeleteMapping
    public ResponseEntity<Void> deletarCliente(@PathVariable Integer id){
        clientesService.deletarCliente(id);

        return ResponseEntity.noContent().build();
    }

}
