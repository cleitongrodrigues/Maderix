package com.maderix.backend.service;

import com.maderix.backend.model.ItensVenda;
import com.maderix.backend.repository.ItensVendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItensVendaService {

    @Autowired
    private ItensVendaRepository itensVendaRepositiroty;

    public ItensVenda salvarItemVenda(ItensVenda item) {
        return itensVendaRepositiroty.save(item);
    }

    public Optional<ItensVenda> buscarItemVendaPorId(Integer id) {
        return itensVendaRepositiroty.findById(id);
    }

    public void deletarItemVenda(Integer id) {
        itensVendaRepositiroty.deleteById(id);
    }
    public List<ItensVenda> buscarItensPorVenda(Integer idVenda) {
        return itensVendaRepositiroty.findItensByVendaId(idVenda);
    }
}
