package com.maderix.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.dto.LoginRequestDTO;
import com.maderix.backend.dto.RecuperacaoSenhaRequestDTO;
import com.maderix.backend.dto.ResetSenhaRequestDTO;
import com.maderix.backend.dto.UsuarioResponseDTO;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.service.AutenticacaoService;
import com.maderix.backend.service.RecuperacaoSenhaService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AutenticacaoController {

    @Autowired
    private AutenticacaoService autenticacaoService;

    @Autowired
    private RecuperacaoSenhaService recuperacaoSenhaService;

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@Valid @RequestBody LoginRequestDTO request){
        Usuarios usuarioAutenticado = autenticacaoService.autenticar(
            request.getNmLogin()
           ,request.getSenhaPura()
        );

        UsuarioResponseDTO responseDTO = new UsuarioResponseDTO(usuarioAutenticado);

        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/esqueceu-senha")
    public ResponseEntity<Void> solicitarRecuperacao(@RequestBody RecuperacaoSenhaRequestDTO request
                                                                 ,HttpServletRequest httpRequest){
                                                                    
        String ipSolicitacao = httpRequest.getRemoteAddr();      
        
        recuperacaoSenhaService.gerarToken(
            request.getEmail()
           ,ipSolicitacao
        );


        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-senha")
    public ResponseEntity<Void> resetarSenha(@Valid @RequestBody ResetSenhaRequestDTO request
                                                                                     ,HttpServletRequest httpRequest){

        String ipUtilizado = httpRequest.getRemoteAddr();                               
        
        recuperacaoSenhaService.resetarSenha(
            request.getToken()
           ,request.getNovaSenhaPura()
           ,ipUtilizado
        );

        return ResponseEntity.ok().build();
    }
}
