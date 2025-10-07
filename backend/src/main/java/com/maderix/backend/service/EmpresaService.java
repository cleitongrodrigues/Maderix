package com.maderix.backend.service;

import com.maderix.backend.model.Empresa;
import com.maderix.backend.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepository empresaRepository;

    public Empresa salvarEmpresa(Empresa empresa){
        return empresaRepository.save(empresa);
    }

    public List<Empresa> buscarTodasEmpresas(){
        return empresaRepository.findAll();
    }

    public Optional<Empresa> buscarEmpresaPorId(Integer id){
        return empresaRepository.findById(id);
    }

    public void deletarEmpresa(Integer id){
        empresaRepository.deleteById(id);
    }

}
