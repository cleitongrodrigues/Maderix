package com.maderix.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.service.UsuariosService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("api/usuario")
public class UsuarioController {

    @Autowired
    private UsuariosService usuariosService;

    @PostMapping
    public ResponseEntity<Usuarios> criarUsuario(@Valid @RequestBody Usuarios usuario){
        Usuarios novoUsuario = usuariosService.salvarUsuario(usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }

    @GetMapping
    public ResponseEntity <List<Usuarios>> buscarTodosUsuarios(){
        List<Usuarios> usuario = usuariosService.buscarTodosUsuarios();

        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/{email}")
    public ResponseEntity<Usuarios> buscarUsuarioPorEmail(@Valid @PathVariable String email){
        return usuariosService.buscarUsuarioPorEmail(email)
                              .map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuarios> atualizarUsuario(@PathVariable Integer id, @Valid @RequestBody Usuarios usuarioAtualizado) {
        return usuariosService.buscarUsuarioPorId(id)
                .map(usuarioExistente -> {
                    usuarioAtualizado.setIdUsuario(id);
                    Usuarios usuarioSalvo = usuariosService.salvarUsuario(usuarioAtualizado);
                    return ResponseEntity.ok(usuarioSalvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Integer id) {
        return usuariosService.buscarUsuarioPorId(id)
                .map(usuario -> {
                    usuariosService.deletarUsuario(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
