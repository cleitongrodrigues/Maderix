// src/main/java/com/maderix.backend.dto/VendaResponseDTO.java

package com.maderix.backend.dto;

import com.maderix.backend.model.Vendas;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class VendaResponseDTO {

    private Integer idVenda;
    private String nomeCliente; // Dados da entidade Clientes
    private String nomeUsuario; // Dados da entidade Usuarios
    private String nomeEmpresa; // Dados da entidade Empresa
    private BigDecimal valorTotal;
    private String statusVenda;
    private LocalDateTime dtVenda;
    private List<ItemVendaResponseDTO> itensVendas; // DTO dos Itens (se necessário)

    public VendaResponseDTO(Vendas venda) {
        this.idVenda = venda.getIdVenda();
        this.valorTotal = venda.getValorTotal();
        this.statusVenda = venda.getStatusVenda();
        this.dtVenda = venda.getDataVenda();
        
        // Mapeamento de relacionamentos (acessando os Models aninhados)
        this.nomeCliente = venda.getCliente() != null ? venda.getCliente().getNmCliente() : null;
        this.nomeEmpresa = venda.getEmpresa() != null ? venda.getEmpresa().getNmFantasia() : null;
        this.nomeUsuario = venda.getUsuario() != null ? venda.getUsuario().getNmUsuario() : null;
        
        // Converte os itens da venda para DTOs
        if (venda.getItensVendas() != null && !venda.getItensVendas().isEmpty()) {
            this.itensVendas = venda.getItensVendas().stream()
                .map(ItemVendaResponseDTO::new)
                .collect(Collectors.toList());
        }
    }
    

    public VendaResponseDTO() {
    }

    public Integer getIdVenda() {
        return this.idVenda;
    }

    public void setIdVenda(Integer idVenda) {
        this.idVenda = idVenda;
    }

    public String getNomeCliente() {
        return this.nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public String getNomeUsuario() {
        return this.nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public String getNomeEmpresa() {
        return this.nomeEmpresa;
    }

    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }

    public BigDecimal getValorTotal() {
        return this.valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getStatusVenda() {
        return this.statusVenda;
    }

    public void setStatusVenda(String statusVenda) {
        this.statusVenda = statusVenda;
    }

    public LocalDateTime getDtVenda() {
        return this.dtVenda;
    }

    public void setDtVenda(LocalDateTime dtVenda) {
        this.dtVenda = dtVenda;
    }

    public List<ItemVendaResponseDTO> getItensVendas() {
        return this.itensVendas;
    }

    public void setItensVendas(List<ItemVendaResponseDTO> itensVendas) {
        this.itensVendas = itensVendas;
    }

}