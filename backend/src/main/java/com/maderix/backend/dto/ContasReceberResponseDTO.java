package com.maderix.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.maderix.backend.model.ContasReceber;

public class ContasReceberResponseDTO {
    
    private Integer idConta;
    private String numero;
    private String cliente;
    private String descricao;
    private BigDecimal valor;
    private LocalDateTime dataVencimento;
    private boolean pago;
    private LocalDateTime dataPagamento;
    private LocalDateTime dataCadConta;
    private Boolean cancelado;
    
    // Dados simplificados da venda
    private Integer idVenda;
    private String statusVenda;
    
    // Dados simplificados da empresa
    private Integer idEmpresa;
    private String nomeEmpresa;
    
    // Construtor que converte de Model para DTO
    public ContasReceberResponseDTO(ContasReceber conta) {
        this.idConta = conta.getIdConta();
        this.numero = conta.getNumero();
        this.cliente = conta.getCliente();
        this.descricao = conta.getDescricao();
        this.valor = conta.getValor();
        this.dataVencimento = conta.getDataVencimento();
        this.pago = conta.isPago();
        this.dataPagamento = conta.getDataPagamento();
        this.dataCadConta = conta.getDataCadConta();
        this.cancelado = conta.getCancelado();
        
        // Extrai dados da venda sem trazer todo o objeto
        if (conta.getVenda() != null) {
            this.idVenda = conta.getVenda().getIdVenda();
            this.statusVenda = conta.getVenda().getStatusVenda();
        }
        
        // Extrai dados da empresa sem trazer todo o objeto
        if (conta.getEmpresa() != null) {
            this.idEmpresa = conta.getEmpresa().getIdEmpresa();
            this.nomeEmpresa = conta.getEmpresa().getNmFantasia();
        }
    }
    
    // Getters e Setters
    public Integer getIdConta() {
        return idConta;
    }

    public void setIdConta(Integer idConta) {
        this.idConta = idConta;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDateTime getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(LocalDateTime dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public boolean isPago() {
        return pago;
    }

    public void setPago(boolean pago) {
        this.pago = pago;
    }

    public LocalDateTime getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public LocalDateTime getDataCadConta() {
        return dataCadConta;
    }

    public void setDataCadConta(LocalDateTime dataCadConta) {
        this.dataCadConta = dataCadConta;
    }

    public Boolean getCancelado() {
        return cancelado;
    }

    public void setCancelado(Boolean cancelado) {
        this.cancelado = cancelado;
    }

    public Integer getIdVenda() {
        return idVenda;
    }

    public void setIdVenda(Integer idVenda) {
        this.idVenda = idVenda;
    }

    public String getStatusVenda() {
        return statusVenda;
    }

    public void setStatusVenda(String statusVenda) {
        this.statusVenda = statusVenda;
    }

    public Integer getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(Integer idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getNomeEmpresa() {
        return nomeEmpresa;
    }

    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }
}
