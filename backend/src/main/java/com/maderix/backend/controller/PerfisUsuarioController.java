package com.maderix.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.dto.PerfilPermissaoRequestDTO;
import com.maderix.backend.model.PerfisUsuario;
import com.maderix.backend.service.PerfisUsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/perfis")
public class PerfisUsuarioController {
    
    @Autowired
    private PerfisUsuarioService perfisUsuarioService;

    @PostMapping
    public ResponseEntity<PerfisUsuario> criarPerfil(@Valid @RequestBody PerfisUsuario perfisUsuario){
        PerfisUsuario novoPerfil = perfisUsuarioService.salvarPerfil(perfisUsuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(novoPerfil);
    }

    @PatchMapping("/{perfilId}/permissoes/adicionar")
    public ResponseEntity<PerfisUsuario> adicionar(
        @PathVariable("perfilId") Integer id,
        @Valid @RequestBody PerfilPermissaoRequestDTO requestDTO 
    ){
        PerfisUsuario perfilAtualizado = perfisUsuarioService.adicionarPermissoes(
            id,
            requestDTO.getPermissoesIds()
        );

        return ResponseEntity.ok(perfilAtualizado);
    
    }

    @PatchMapping("/{perfilId}/permissoes/remover")
    public ResponseEntity<PerfisUsuario> removerPermissoes(
        @PathVariable("perfilId") Integer id,
        @Valid @RequestBody PerfilPermissaoRequestDTO requestDTO 
    ){
        PerfisUsuario perfilAtualizado = perfisUsuarioService.removerPermissoes(
            id,
            requestDTO.getPermissoesIds()
        );

        return ResponseEntity.ok(perfilAtualizado);
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

    @PutMapping("/{id}")
    public ResponseEntity<PerfisUsuario> atualizarPerfil(@PathVariable Integer id, @RequestBody PerfisUsuario detalhePerfil){
        PerfisUsuario perfilAtualizado = perfisUsuarioService.atualizarPerfil(id, detalhePerfil);

        return ResponseEntity.ok(perfilAtualizado);
    }
}
