package com.maderix.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.model.PerfisUsuario;
import com.maderix.backend.service.PerfisUsuarioService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("api/perfil")
public class PerfilController {
    
    @Autowired
    private PerfisUsuarioService perfisUsuarioService;

    @PostMapping
    public ResponseEntity<PerfisUsuario> criarPerfil(@RequestBody PerfisUsuario perfisUsuario){
        PerfisUsuario novoPerfil = perfisUsuarioService.salvarPerfil(perfisUsuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(novoPerfil);
    }

    @GetMapping
    public ResponseEntity<List<PerfisUsuario>> buscarTodosPerfis(){
        List<PerfisUsuario> perfis = perfisUsuarioService.buscarTodosPerfis();

        return ResponseEntity.ok(perfis);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerfisUsuario> buscarPerfilPorId(@PathVariable Integer id){
        return perfisUsuarioService.buscarPerfilPorId(id)
                                   .map(ResponseEntity::ok)
                                   .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<PerfisUsuario> atualizarPerfil(@PathVariable Integer id, @RequestBody PerfisUsuario detalhePerfil){
        PerfisUsuario perfilAtualizado = perfisUsuarioService.atualizarPerfil(id, detalhePerfil);

        return ResponseEntity.ok(perfilAtualizado);
    }
}
