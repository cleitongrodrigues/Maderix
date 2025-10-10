package com.maderix.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.maderix.backend.model.Materiais;
import com.maderix.backend.service.MateriaisService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("api/materiais")
public class MaterialController {

    @Autowired
    private MateriaisService materialService;

    @PostMapping
    public ResponseEntity<Materiais> criarMaterial(@RequestBody Materiais material){
        Materiais novoMaterial = materialService.salvarMaterial(material);

        return ResponseEntity.status(HttpStatus.CREATED).body(novoMaterial);
    }

    @GetMapping
    public ResponseEntity<List<Materiais>> buscarTodosMateriais(){
        List<Materiais> materiais = materialService.buscarTodosMaterias();

        return ResponseEntity.ok(materiais);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Materiais> buscarMaterialPorId(Integer id){
        return materialService.buscarMaterialPorId(id)
                              .map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Materiais> atualizarMaterial(@PathVariable Integer id, @RequestBody Materiais materialDetalhes) {
        Materiais materialAtualizado = materialService.atualizarMaterial(id, materialDetalhes);
        
        return ResponseEntity.ok(materialAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMaterial(Integer id){
        materialService.deletarMaterial(id);

        return ResponseEntity.noContent().build();
    }

    
}
