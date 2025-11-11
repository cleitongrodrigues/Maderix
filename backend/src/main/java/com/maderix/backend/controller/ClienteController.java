package com.maderix.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

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

import com.maderix.backend.dto.ClienteRequestDTO;
import com.maderix.backend.dto.ClienteResponseDTO;
import com.maderix.backend.model.Clientes;
import com.maderix.backend.service.ClientesService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("api/clientes")
public class ClienteController {

    
    @Autowired
    private ClientesService clientesService;

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> criarCliente(@Valid @RequestBody ClienteRequestDTO requestDTO){
        Clientes novoCliente = clientesService.salvarCliente(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ClienteResponseDTO(novoCliente));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> buscarTodosClientes(){
        List<ClienteResponseDTO> clientes = clientesService.buscarTodosClientes()
                .stream()
                .map(ClienteResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarClientePorId(@PathVariable Integer id){
        return clientesService.buscarClientePorId(id)
                              .map(ClienteResponseDTO::new)
                              .map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> atualizaClientes(@PathVariable Integer id, @Valid @RequestBody ClienteRequestDTO requestDTO){
        Clientes clienteAtualizado = clientesService.atualizaClientes(id, requestDTO);

        return ResponseEntity.ok(new ClienteResponseDTO(clienteAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Integer id){
        clientesService.deletarCliente(id);

        return ResponseEntity.noContent().build();
    }

}
