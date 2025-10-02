package com.maderix.backend.service;

import com.maderix.backend.model.Empresa;
import com.maderix.backend.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepository empresaRepository;

    @GetMapping
    public List<Empresa> buscarTodasEmpresas(){
        return empresaRepository.findAll();
    }

}
