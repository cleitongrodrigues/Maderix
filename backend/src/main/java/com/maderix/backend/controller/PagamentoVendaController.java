package com.maderix.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.dto.PagamentoVendaRequestDTO;
import com.maderix.backend.dto.PagamentoVendaResponseDTO;
import com.maderix.backend.model.PagamentosVenda;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.service.PagamentoVendaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pagamentos-venda")
public class PagamentoVendaController {

    @Autowired
    private PagamentoVendaService pagamentoVendaService;

    @PostMapping
    public ResponseEntity<PagamentoVendaResponseDTO> registarPagamento(
        @Valid @RequestBody PagamentoVendaRequestDTO requestDTO
    ){
        // Captura usuário logado do JWT automaticamente
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof Usuarios) {
            Usuarios usuarioLogado = (Usuarios) authentication.getPrincipal();
            requestDTO.setIdUsuario(usuarioLogado.getIdUsuario());
        }
        
        PagamentosVenda pagamentoSalvo = pagamentoVendaService.registrarPagamento(requestDTO);

        PagamentoVendaResponseDTO responseDTO = new PagamentoVendaResponseDTO(pagamentoSalvo);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<PagamentoVendaResponseDTO>> buscarTodosPagamentos(){
        List<PagamentosVenda> pagamentos = pagamentoVendaService.buscarTodosPagamentos();

        List<PagamentoVendaResponseDTO> responseList = pagamentos.stream()
                                                                 .map(PagamentoVendaResponseDTO::new)
                                                                 .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);                                                                 
    }

    @GetMapping("/{id}")
    public ResponseEntity<PagamentoVendaResponseDTO> buscarPorId(@PathVariable Integer id){
        return pagamentoVendaService.buscarPorId(id)
                                    .map(PagamentoVendaResponseDTO::new) // converte o model em dto
                                    .map(ResponseEntity::ok) //retorna 200 com dto ok
                                    .orElse(ResponseEntity.notFound().build()); //retorna 404 se nao existir
    }

}
