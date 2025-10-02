package com.maderix.backend.controller;

import com.maderix.backend.model.Empresa;
import com.maderix.backend.service.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/empresas")
public class EmpresaController {
    @Autowired
    private EmpresaService empresaService;

    @GetMapping
    public ResponseEntity<List<Empresa>> buscarTodasEmpresas(){
        List<Empresa> empresas = empresaService.buscarTodasEmpresas();
        return ResponseEntity.ok(empresas);
    }
}
