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

    public Empresa atualizarEmpresa(Integer id, Empresa detalheEmpresa){
        Empresa empresaExistente = empresaRepository.findById(id)
                                               .orElseThrow(() -> new RuntimeException("Empresa com o id: " + id + " não encontrado"));

        empresaExistente.setCNPJ(detalheEmpresa.getCNPJ());
        empresaExistente.setNM_Fantasia(detalheEmpresa.getNM_Fantasia());
        empresaExistente.setRZ_Social(detalheEmpresa.getRZ_Social());

        return empresaRepository.save(empresaExistente);
    }

}
