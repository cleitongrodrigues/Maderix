package com.maderix.backend.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.maderix.backend.exception.CredenciaisInvalidasException;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.repository.UsuariosRepository;

@Service
public class AutenticacaoService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuarios autenticarUsuarios (String nmLogin, String senhaPura){

        //Buscar usuario pelo nome de login
        Usuarios usuario = usuariosRepository.findByNM_Login(nmLogin)
                                             .orElseThrow(() -> new CredenciaisInvalidasException("Login ou senha inválidos."));

        //Verifica se o usuario está ativo                                             
        if (!usuario.getAtivo()){
            throw new CredenciaisInvalidasException("Usuario inativo. Contate o administrador.");
        }
        //Valida senha do usuario
        if (!passwordEncoder.matches(senhaPura, usuario.getSENHA_HASH())){
            throw new CredenciaisInvalidasException("Login ou senha Inválidos");
        }

        //Atualiza a data do ultimo login
        usuario.setULTIMO_LOGIN(LocalDateTime.now());
        usuariosRepository.save(usuario);

        return usuario;
    }


    public Usuarios salvarUsuarios(Usuarios novoUsuario, String senhaPura){
        //Criptografa a senha antes de salvar 
        String senhaHash = passwordEncoder.encode(senhaPura);
        novoUsuario.setSENHA_HASH(senhaHash);

        return usuariosRepository.save(novoUsuario);
    }

}
