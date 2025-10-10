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
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.service.UsuariosService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("api/usuario")
public class UsuarioController {

    @Autowired
    private UsuariosService usuariosService;

    @PostMapping
    public ResponseEntity<Usuarios> criarUsuario(@RequestBody Usuarios usuario){
        Usuarios novoUsuario = usuariosService.salvarUsuario(usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }

    @GetMapping
    public ResponseEntity <List<Usuarios>> buscarTodosUsuarios(){
        List<Usuarios> usuario = usuariosService.buscarTodosUsuarios();

        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/{email}")
    public ResponseEntity<Usuarios> buscarUsuarioPorEmail(@PathVariable String email){
        return usuariosService.buscarUsuarioPorEmail(email)
                              .map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
    }

}
