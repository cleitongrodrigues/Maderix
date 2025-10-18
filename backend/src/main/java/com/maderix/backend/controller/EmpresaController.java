package com.maderix.backend.controller;

import com.maderix.backend.model.Empresa;
import com.maderix.backend.service.EmpresaService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @PostMapping
    public ResponseEntity <Empresa> criarEmpresa(@RequestBody Empresa empresa){
        Empresa novaEmpresa = empresaService.salvarEmpresa(empresa);

        return ResponseEntity.status(HttpStatus.CREATED).body(novaEmpresa);
    }

    @GetMapping
    public ResponseEntity<List<Empresa>> buscarTodasEmpresas(){
        List<Empresa> empresas = empresaService.buscarTodasEmpresas();
        return ResponseEntity.ok(empresas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empresa> buscarEmpresaPorId(@PathVariable Integer id){
        return empresaService.buscarEmpresaPorId(id)
                             .map(ResponseEntity::ok)
                             .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empresa> atualizarEmpresa(@PathVariable Integer id, Empresa detalheEmpresa){
        Empresa emprezaAtualizada = empresaService.atualizarEmpresa(id, detalheEmpresa);

        return ResponseEntity.ok(emprezaAtualizada);
    }
}
