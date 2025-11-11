package com.maderix.backend.service;

import com.maderix.backend.dto.ClienteRequestDTO;
import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.model.Clientes;
import com.maderix.backend.model.Empresa;
import com.maderix.backend.repository.ClientesRepository;
import com.maderix.backend.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientesService {
    @Autowired
    private ClientesRepository clientesRepository;
    
    @Autowired
    private EmpresaRepository empresaRepository;

    public Clientes salvarCliente(ClienteRequestDTO requestDTO){
        // Busca a empresa
        Empresa empresa = empresaRepository.findById(requestDTO.getIdEmpresa())
            .orElseThrow(() -> new ResourceNotFoundException("Empresa com id " + requestDTO.getIdEmpresa() + " não encontrada"));
        
        // Converte DTO para Model
        Clientes cliente = new Clientes();
        cliente.setIdEmpresa(empresa);
        cliente.setNmCliente(requestDTO.getNmCliente());
        cliente.setTelCliente(requestDTO.getTelCliente());
        cliente.setEmail(requestDTO.getEmail());
        
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

    public Clientes atualizaClientes(Integer id, ClienteRequestDTO requestDTO){
        Clientes clienteExistente = clientesRepository.findById(id)
                                                      .orElseThrow(() -> new ResourceNotFoundException("Cliente com o id: " + id + " não encontrado"));

        // Atualiza empresa se fornecida
        if (requestDTO.getIdEmpresa() != null) {
            Empresa empresa = empresaRepository.findById(requestDTO.getIdEmpresa())
                .orElseThrow(() -> new ResourceNotFoundException("Empresa com id " + requestDTO.getIdEmpresa() + " não encontrada"));
            clienteExistente.setIdEmpresa(empresa);
        }
        
        clienteExistente.setNmCliente(requestDTO.getNmCliente());
        clienteExistente.setEmail(requestDTO.getEmail());
        clienteExistente.setTelCliente(requestDTO.getTelCliente());
        
        return clientesRepository.save(clienteExistente);
    }

}
