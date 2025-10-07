package com.maderix.backend.service;

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

}
