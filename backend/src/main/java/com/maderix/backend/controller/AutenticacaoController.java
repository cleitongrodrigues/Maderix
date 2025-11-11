package com.maderix.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.dto.LoginRequestDTO;
import com.maderix.backend.dto.LoginResponseDTO;
import com.maderix.backend.dto.RecuperacaoSenhaRequestDTO;
import com.maderix.backend.dto.RecuperacaoSenhaResponseDTO;
import com.maderix.backend.dto.ResetSenhaRequestDTO;
import com.maderix.backend.dto.UsuarioResponseDTO;
import com.maderix.backend.model.TokensRecuperacao;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.service.AutenticacaoService;
import com.maderix.backend.service.RecuperacaoSenhaService;
import com.maderix.backend.service.TokenService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AutenticacaoController {

    @Autowired
    private AutenticacaoService autenticacaoService;

    @Autowired
    private RecuperacaoSenhaService recuperacaoSenhaService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request){
        Usuarios usuarioAutenticado = autenticacaoService.autenticar(
            request.getNmLogin()
           ,request.getSenhaPura()
        );

        String tokenJWT = tokenService.generateToken(usuarioAutenticado);

        UsuarioResponseDTO usuarioDTO = new UsuarioResponseDTO(usuarioAutenticado);
        LoginResponseDTO response = new LoginResponseDTO(tokenJWT, usuarioDTO);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/esqueceu-senha")
    public ResponseEntity<RecuperacaoSenhaResponseDTO> solicitarRecuperacao(
        @RequestBody RecuperacaoSenhaRequestDTO request,
        HttpServletRequest httpRequest
    ){
        String ipSolicitacao = httpRequest.getRemoteAddr();      
        
        TokensRecuperacao tokenGerado = recuperacaoSenhaService.gerarToken(
            request.getEmail(),
            ipSolicitacao
        );

        RecuperacaoSenhaResponseDTO response = new RecuperacaoSenhaResponseDTO(tokenGerado);
        
        return ResponseEntity.ok(response);
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
