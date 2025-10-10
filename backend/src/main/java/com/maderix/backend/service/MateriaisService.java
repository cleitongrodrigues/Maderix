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

    public Materiais atualizarMaterial(Integer id, Materiais materialDetalhes) {
        Materiais materialExistente = materiaisRepository.findById(id)
            .orElseThrow(() -> new  RuntimeException("Material com ID" + id + "não encontrado."));

        materialExistente.setNM_Material(materialDetalhes.getNM_Material());
        materialExistente.setDescricao(materialDetalhes.getDescricao());
        materialExistente.setEstoque_Atual(materialDetalhes.getEstoque_Atual());
        materialExistente.setPreco_Custo(materialDetalhes.getPreco_Custo());
        materialExistente.setID_Empresa(materialDetalhes.getID_Empresa());
        materialExistente.setID_Unidade(materialDetalhes.getID_Unidade());

        return materiaisRepository.save(materialExistente);
    }
}
