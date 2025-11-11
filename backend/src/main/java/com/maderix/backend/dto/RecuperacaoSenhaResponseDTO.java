package com.maderix.backend.dto;

import com.maderix.backend.model.TokensRecuperacao;

public class RecuperacaoSenhaResponseDTO {

    private String token;
    private String email;
    private String mensagem;

    public RecuperacaoSenhaResponseDTO(TokensRecuperacao tokenRecuperacao) {
        this.token = tokenRecuperacao.getToken();
        this.email = tokenRecuperacao.getEmailDestinatario();
        this.mensagem = "Token de recuperação gerado com sucesso. Válido por 15 minutos.";
    }

    // Getters e Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
}
