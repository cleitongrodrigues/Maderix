package com.maderix.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "UNIDADES_MEDIDA")
public class UnidadesMedida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Unidade")
    private Integer ID_Unidade;
    
    @Column(name = "Sigla", length = 10, nullable = false, unique = true)
    private String Sigla;

    @Column(name = "Descricao", length = 50, nullable = false)
    private String Descricao;
}
