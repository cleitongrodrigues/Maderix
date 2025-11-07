// src/main/java/com/maderix.backend.dto/VendaResponseDTO.java

package com.maderix.backend.dto;

import com.maderix.backend.model.Vendas;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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
        this.idVenda = venda.getID_Venda();
        this.valorTotal = venda.getValor_Total();
        this.statusVenda = venda.getStatus_Venda();
        this.dtVenda = venda.getDT_Venda();
        
        // Mapeamento de relacionamentos (acessando os Models aninhados)
        this.nomeCliente = venda.getCliente() != null ? venda.getCliente().getNM_Cliente() : null;
        this.nomeEmpresa = venda.getEmpresa() != null ? venda.getEmpresa().getNM_Fantasia() : null;
        this.nomeUsuario = venda.getUsuario() != null ? venda.getUsuario().getnmUsuario() : null;
        
        // NOTA: Para listar os itens, você precisaria de uma lógica de conversão aqui:
        /*
        this.itensVendas = venda.getItensVendas().stream()
            .map(ItemVendaResponseDTO::new)
            .collect(Collectors.toList());
        */
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