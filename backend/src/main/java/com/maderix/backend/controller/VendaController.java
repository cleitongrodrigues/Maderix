    package com.maderix.backend.controller;

    import java.util.List;
    import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.dto.CancelamentoVendaRequestDTO;
import com.maderix.backend.dto.VendaRequestDTO;
import com.maderix.backend.dto.VendaResponseDTO;
import com.maderix.backend.exception.BusinessRuleException;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.model.Vendas;
import com.maderix.backend.service.CancelamentoVendaService;
import com.maderix.backend.service.VendaService;

import jakarta.validation.Valid;

    @RestController
    @RequestMapping("api/vendas")
    public class VendaController {

        @Autowired
        private VendaService vendaService;

        @Autowired
        private CancelamentoVendaService cancelamentoVendaService;

    @PostMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VendaResponseDTO> registrarVenda(@Valid @RequestBody VendaRequestDTO vendaRequestDTO){
        //Obtem o usuario logado do contexto de segurança (JWT)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Verifica se o Usuario é valido antes de prosseguir 
        if(authentication == null || authentication.getPrincipal() == null || !(authentication.getPrincipal() instanceof Usuarios)){
            // Esta exceção é importante caso o filtro JWT falhe (mas o Spring já deveria proteger)
            throw new BusinessRuleException("Usuário de  auditoria não encontrado no contexto de segurança.");
        }

        Usuarios usuarioLogado = (Usuarios) authentication.getPrincipal();

        Vendas novaVenda = vendaService.registrarNovaVenda(vendaRequestDTO, usuarioLogado);            VendaResponseDTO responseDTO = new VendaResponseDTO(novaVenda);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        }

        @GetMapping
        public ResponseEntity<List<VendaResponseDTO>> buscarTodasVendas() {
            List<Vendas> vendas = vendaService.buscarTodasVendas();
            
            // Converte a lista de Models para lista de DTOs
            List<VendaResponseDTO> responseList = vendas.stream()
                .map(VendaResponseDTO::new)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(responseList);
    }

        @GetMapping("/{id}")
        public ResponseEntity<VendaResponseDTO> buscarVendaPorId(@PathVariable Integer id){
            return vendaService.buscarVendaPorId(id)
                             .map(VendaResponseDTO::new)
                             .map(ResponseEntity::ok)
                             .orElse(ResponseEntity.notFound().build());
    }

        @PatchMapping("/{idVenda}/cancelar")
        public ResponseEntity<VendaResponseDTO> cancelarVenda(
            @PathVariable Integer idVenda,
            @Valid @RequestBody CancelamentoVendaRequestDTO requestDTO
        ){
            //Valida os id
            if(!idVenda.equals(requestDTO.getIdVenda())){
                throw new IllegalArgumentException("O ID da venda na URL não corresponde ao ID no corpo da requisição.");
            }

            //Obter Usuario logado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Usuarios usuarioLogado = (Usuarios) authentication.getPrincipal();

            cancelamentoVendaService.cancelarVenda(requestDTO, usuarioLogado);

            // Busca a Venda já atualizada (status='CANCELADA')
            Vendas vendaAtualizada =   vendaService.buscarVendaPorId(idVenda)
                                                   .orElseThrow(() -> new RuntimeException("Venda desapareceu após cancelamento."));

            VendaResponseDTO responseDTO = new VendaResponseDTO(vendaAtualizada);

            return ResponseEntity.ok(responseDTO);
        }
    }
