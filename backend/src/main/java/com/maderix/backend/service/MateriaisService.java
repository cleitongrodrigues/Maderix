package com.maderix.backend.service;


import com.maderix.backend.model.Materiais;
import com.maderix.backend.repository.MateriaisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MateriaisService {
    @Autowired
    private MateriaisRepository materiaisRepository;

    public Materiais salvarMaterial(Materiais material){
        return materiaisRepository.save(material);
    }

    public List<Materiais> buscarTodosMaterias(){
        return materiaisRepository.findAll();
    }

    public Optional<Materiais> buscarMaterialPorId(Integer id){
        return materiaisRepository.findById(id);
    }

    public void deletarMaterial(Integer id){
        materiaisRepository.deleteById(id);
    }
}
