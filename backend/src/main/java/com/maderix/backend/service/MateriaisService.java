package com.maderix.backend.service;


import com.maderix.backend.dto.MaterialRequestDTO;
import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.model.Empresa;
import com.maderix.backend.model.Materiais;
import com.maderix.backend.model.UnidadesMedida;
import com.maderix.backend.repository.EmpresaRepository;
import com.maderix.backend.repository.MateriaisRepository;
import com.maderix.backend.repository.UnidadesMedidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MateriaisService {
    @Autowired
    private MateriaisRepository materiaisRepository;
    
    @Autowired
    private EmpresaRepository empresaRepository;
    
    @Autowired
    private UnidadesMedidaRepository unidadesMedidaRepository;

    public Materiais salvarMaterial(MaterialRequestDTO requestDTO){
        // Busca empresa
        Empresa empresa = empresaRepository.findById(requestDTO.getIdEmpresa())
            .orElseThrow(() -> new ResourceNotFoundException("Empresa com id " + requestDTO.getIdEmpresa() + " não encontrada"));
        
        // Busca unidade de medida
        UnidadesMedida unidade = unidadesMedidaRepository.findById(requestDTO.getIdUnidade())
            .orElseThrow(() -> new ResourceNotFoundException("Unidade de medida com id " + requestDTO.getIdUnidade() + " não encontrada"));
        
        // Converte DTO para Model
        Materiais material = new Materiais();
        material.setEmpresa(empresa);
        material.setUnidadeMedida(unidade);
        material.setNmMaterial(requestDTO.getNmMaterial());
        material.setCodigo(requestDTO.getCodigo());
        material.setPrecoVenda(requestDTO.getPrecoVenda());
        material.setDescricao(requestDTO.getDescricao());
        material.setPrecoCusto(requestDTO.getPrecoCusto());
        material.setEstoqueAtual(requestDTO.getEstoqueAtual());
        material.setFornecedor(requestDTO.getFornecedor());
        material.setCategoria(requestDTO.getCategoria());
        material.setAtivo(requestDTO.getAtivo());
        
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

    public Materiais atualizarMaterial(Integer id, MaterialRequestDTO requestDTO) {
        Materiais materialExistente = materiaisRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Material com ID " + id + " não encontrado."));

        // Atualiza empresa se fornecida
        if (requestDTO.getIdEmpresa() != null) {
            Empresa empresa = empresaRepository.findById(requestDTO.getIdEmpresa())
                .orElseThrow(() -> new ResourceNotFoundException("Empresa com id " + requestDTO.getIdEmpresa() + " não encontrada"));
            materialExistente.setEmpresa(empresa);
        }
        
        // Atualiza unidade se fornecida
        if (requestDTO.getIdUnidade() != null) {
            UnidadesMedida unidade = unidadesMedidaRepository.findById(requestDTO.getIdUnidade())
                .orElseThrow(() -> new ResourceNotFoundException("Unidade de medida com id " + requestDTO.getIdUnidade() + " não encontrada"));
            materialExistente.setUnidadeMedida(unidade);
        }

        materialExistente.setNmMaterial(requestDTO.getNmMaterial());
        materialExistente.setDescricao(requestDTO.getDescricao());
        materialExistente.setEstoqueAtual(requestDTO.getEstoqueAtual());
        materialExistente.setPrecoCusto(requestDTO.getPrecoCusto());
        materialExistente.setPrecoVenda(requestDTO.getPrecoVenda());
        materialExistente.setFornecedor(requestDTO.getFornecedor());
        materialExistente.setCategoria(requestDTO.getCategoria());
        materialExistente.setAtivo(requestDTO.getAtivo());

        return materiaisRepository.save(materialExistente);
    }
}
