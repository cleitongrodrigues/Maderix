package com.maderix.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.maderix.backend.dto.MaterialRequestDTO;
import com.maderix.backend.dto.MaterialResponseDTO;
import com.maderix.backend.model.Materiais;
import com.maderix.backend.service.MateriaisService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("api/materiais")
public class MaterialController {

    @Autowired
    private MateriaisService materialService;

    @PostMapping
    public ResponseEntity<MaterialResponseDTO> criarMaterial(@Valid @RequestBody MaterialRequestDTO requestDTO){
        Materiais novoMaterial = materialService.salvarMaterial(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(new MaterialResponseDTO(novoMaterial));
    }

    @GetMapping
    public ResponseEntity<List<MaterialResponseDTO>> buscarTodosMateriais(){
        List<MaterialResponseDTO> materiais = materialService.buscarTodosMaterias()
                .stream()
                .map(MaterialResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(materiais);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> buscarMaterialPorId(@PathVariable Integer id){
        return materialService.buscarMaterialPorId(id)
                              .map(MaterialResponseDTO::new)
                              .map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> atualizarMaterial(@PathVariable Integer id, @Valid @RequestBody MaterialRequestDTO requestDTO) {
        Materiais materialAtualizado = materialService.atualizarMaterial(id, requestDTO);
        
        return ResponseEntity.ok(new MaterialResponseDTO(materialAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMaterial(@PathVariable Integer id){
        materialService.deletarMaterial(id);

        return ResponseEntity.noContent().build();
    }

    
}
