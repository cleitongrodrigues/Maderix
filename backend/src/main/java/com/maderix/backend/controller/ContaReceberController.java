package com.maderix.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maderix.backend.model.ContasReceber;
import com.maderix.backend.service.ContasReceberService;

@RestController
@RequestMapping("api/contasReceber")
public class ContaReceberController {

    @Autowired
    private ContasReceberService contasReceberService;

    @GetMapping
    public ResponseEntity<List<ContasReceber>> buscarTodasContasReceber(){
        List<ContasReceber> contasReceber = contasReceberService.buscarTodasContasReceber();

        return ResponseEntity.ok(contasReceber);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContasReceber> buscarContasReceberPorId(@PathVariable Integer id){
        return contasReceberService.buscarPorId(id)
                                    .map(ResponseEntity::ok)
                                    .orElse(ResponseEntity.notFound().build());

    }

    @PatchMapping("/{id}/pagar")
    public ResponseEntity<ContasReceber> marcarComoPaga(@PathVariable Integer id){
        ContasReceber contaPaga = contasReceberService.marcarComoPaga(id);

        return ResponseEntity.ok(contaPaga);
    }
}
