package com.maderix.backend.service;

import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.model.Clientes;
import com.maderix.backend.repository.ClientesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientesService {
    @Autowired
    private ClientesRepository clientesRepository;

    public Clientes salvarCliente(Clientes cliente){
        return clientesRepository.save(cliente);
    }

    public List<Clientes> buscarTodosClientes(){
        return clientesRepository.findAll();
    }

    public Optional<Clientes> buscarClientePorId(Integer id){
        return clientesRepository.findById(id);
    }

    public void deletarCliente(Integer id){
        clientesRepository.deleteById(id);
    }

    public Clientes atualizaClientes(Integer id, Clientes detalhCliente){
        Clientes clienteExistente = clientesRepository.findById(id)
                                                      .orElseThrow(() -> new ResourceNotFoundException("Cliente com o id: " + id + " não encontrado"));

        clienteExistente.setNmCliente(detalhCliente.getNmCliente());
        clienteExistente.setEmail(detalhCliente.getEmail());
        clienteExistente.setTelCliente(detalhCliente.getTelCliente());
        
        return clientesRepository.save(clienteExistente);
    }

}
