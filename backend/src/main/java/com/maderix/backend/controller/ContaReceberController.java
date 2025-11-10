package com.maderix.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.dto.ContasReceberResponseDTO;
import com.maderix.backend.service.ContasReceberService;

@RestController
@RequestMapping("api/contasReceber")
public class ContaReceberController {

    @Autowired
    private ContasReceberService contasReceberService;

    @GetMapping
    public ResponseEntity<List<ContasReceberResponseDTO>> buscarTodasContasReceber(){
        List<ContasReceberResponseDTO> contasReceber = contasReceberService.buscarTodasContasReceber()
                .stream()
                .map(ContasReceberResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(contasReceber);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContasReceberResponseDTO> buscarContasReceberPorId(@PathVariable Integer id){
        return contasReceberService.buscarPorId(id)
                                    .map(ContasReceberResponseDTO::new)
                                    .map(ResponseEntity::ok)
                                    .orElse(ResponseEntity.notFound().build());

    }

    @PatchMapping("/{id}/pagar")
    public ResponseEntity<ContasReceberResponseDTO> marcarComoPaga(@PathVariable Integer id){
        var contaPaga = contasReceberService.marcarComoPaga(id);

        return ResponseEntity.ok(new ContasReceberResponseDTO(contaPaga));
    }
}
