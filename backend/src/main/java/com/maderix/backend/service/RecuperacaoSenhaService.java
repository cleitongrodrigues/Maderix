package com.maderix.backend.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.maderix.backend.exception.ResourceNotFoundException;
import com.maderix.backend.exception.TokenInvalidoException;
import com.maderix.backend.model.TokensRecuperacao;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.repository.TokensRecuperacaoRepository;
import com.maderix.backend.repository.UsuariosRepository;

import jakarta.transaction.Transactional;

@Service
public class RecuperacaoSenhaService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private TokensRecuperacaoRepository tokensRecuperacaoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public TokensRecuperacao gerarToken(String email, String ipSolicitacao){

        //Busca o usuario pelo email fornecido
        Usuarios usuario = usuariosRepository.findByEmail(email)
                                             .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrado para o email fornecido"));

        //Cria o Token aleatório atravéz de UUID
        String token = UUID.randomUUID().toString();
        
        TokensRecuperacao novoToken = new TokensRecuperacao();
        novoToken.setUsuario(usuario);
        novoToken.setToken(token);
        novoToken.setEmailDestinatario(email);
        novoToken.setDataExpiracao(LocalDateTime.now().plusMinutes(15)); //Seta o tempo de 15 minutos para tempo de expiração do token 
        novoToken.setIpSolicitacao(ipSolicitacao);

        return tokensRecuperacaoRepository.save(novoToken);
    }

    @Transactional //Ação que envolve multiplas alterações no DB
    public void resetarSenha(String token, String senhaPura, String ipUtilizacao){

        TokensRecuperacao tokenRecuperacao = tokensRecuperacaoRepository.findByToken(token) 
                                                                        .orElseThrow(() -> new TokenInvalidoException("Token de recuperação inválido ou não existe"));
        
        //Valida Token de recuperação                                                                        
        if (tokenRecuperacao.getUtilizado() || tokenRecuperacao.getDataExpiracao().isBefore(LocalDateTime.now())){
            throw new TokenInvalidoException("Token de recuperação expirado ou ja foi utilizado");
        }                                                                        

        //Criptografa e atualiza senha
        Usuarios usuario = tokenRecuperacao.getUsuario();
        String novaSenhaHash = passwordEncoder.encode(senhaPura);

        usuario.setSenhaHash(novaSenhaHash);
        usuariosRepository.save(usuario);

        tokenRecuperacao.setUtilizado(true);
        tokenRecuperacao.setDataUtilizacao(LocalDateTime.now());
        tokenRecuperacao.setIpUtilizacao(ipUtilizacao);
        tokensRecuperacaoRepository.save(tokenRecuperacao);
    }
}
