// src/main/java/com/maderix.backend.dto/ItemVendaResponseDTO.java

package com.maderix.backend.dto;

import com.maderix.backend.model.ItensVenda;
import java.math.BigDecimal;

public class ItemVendaResponseDTO {

    private Integer idItemVenda;
    private Integer idMaterial;
    private String nomeMaterial; // Nome amigável do material
    private String codigoMaterial; // Código/SKU
    private String unidadeSigla; // Sigla da unidade de medida (ex: M, UN)
    private Integer quantidade;
    private BigDecimal precoUnitario;
    private BigDecimal valorTotalItem;

    public ItemVendaResponseDTO() {}

    /**
     * Construtor que mapeia a entidade ItensVenda para o DTO.
     * @param item A entidade ItensVenda a ser convertida.
     */
    public ItemVendaResponseDTO(ItensVenda item) {
        this.idItemVenda = item.getIdItemVenda();
        this.quantidade = item.getQuantidade();
        this.precoUnitario = item.getPrecoUnitario();
        this.valorTotalItem = item.getValorTotalItem();
        
        // --- Navegação para Entidades Relacionadas (Materiais) ---
        if (item.getIdMaterial() != null) {
            this.idMaterial = item.getIdMaterial().getIdMaterial();
            this.nomeMaterial = item.getIdMaterial().getNmMaterial();
            this.codigoMaterial = item.getIdMaterial().getCodigo();
            
            // Navega para a Unidade de Medida
            if (item.getIdMaterial().getUnidadeMedida() != null) {
                this.unidadeSigla = item.getIdMaterial().getUnidadeMedida().getSigla();
            }
        }
        // Nota: Assumi que getIdMaterial() retorna a entidade Materiais, e esta tem um getID_Unidade().
    }

    // --- Inclua todos os Getters e Setters aqui ---
    
    public Integer getIdItemVenda() { return idItemVenda; }
    public void setIdItemVenda(Integer idItemVenda) { this.idItemVenda = idItemVenda; }

    public Integer getIdMaterial() { return idMaterial; }
    public void setIdMaterial(Integer idMaterial) { this.idMaterial = idMaterial; }

    public String getNomeMaterial() { return nomeMaterial; }
    public void setNomeMaterial(String nomeMaterial) { this.nomeMaterial = nomeMaterial; }

    public String getCodigoMaterial() { return codigoMaterial; }
    public void setCodigoMaterial(String codigoMaterial) { this.codigoMaterial = codigoMaterial; }
    
    public String getUnidadeSigla() { return unidadeSigla; }
    public void setUnidadeSigla(String unidadeSigla) { this.unidadeSigla = unidadeSigla; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }

    public BigDecimal getValorTotalItem() { return valorTotalItem; }
    public void setValorTotalItem(BigDecimal valorTotalItem) { this.valorTotalItem = valorTotalItem; }
}