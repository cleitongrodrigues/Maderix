// src/main/java/com/maderix.backend.config/DatabaseInitializer.java

package com.maderix.backend.config;

import com.maderix.backend.model.Empresa;
import com.maderix.backend.model.PerfisUsuario;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.service.AutenticacaoService; // O Service que criptografa
import com.maderix.backend.repository.EmpresaRepository;
import com.maderix.backend.repository.PerfisUsuarioRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DatabaseInitializer {

    // Repositories e Services
    private final AutenticacaoService autenticacaoService;
    private final EmpresaRepository empresaRepository;
    private final PerfisUsuarioRepository perfisUsuarioRepository;
    
    // Construtor com injeção
    public DatabaseInitializer(AutenticacaoService as, EmpresaRepository er, PerfisUsuarioRepository pr) {
        this.autenticacaoService = as;
        this.empresaRepository = er;
        this.perfisUsuarioRepository = pr;
    }

    // Este método roda assim que a aplicação está pronta
    @EventListener(ApplicationReadyEvent.class)
    public void runAfterStartup() {
        if (empresaRepository.count() == 0) {
            // 1. Cria a Empresa e Perfil (se não existirem)
            Empresa empresa = new Empresa();
            empresa.setNmFantasia("Maderix Central");
            empresa.setRzSocial("Maderix Ltda");
            empresa.setDataCadEmpresa(LocalDateTime.now());
            empresa.setCnpj("10.888.888");
            empresaRepository.save(empresa);

            PerfisUsuario perfil = new PerfisUsuario();
            perfil.setNmPerfil("ADMIN");
            // ... setar outros campos obrigatórios
            perfisUsuarioRepository.save(perfil);

            // 2. CRIA E CRIPTOGRAFA O USUÁRIO DIRETAMENTE NO SERVICE
            Usuarios admin = new Usuarios();
            admin.setNmUsuario("Admin Principal");
            admin.setNmLogin("admin.test");
            admin.setSenha("123456");
            admin.setEmail("admin@maderix.com");
            admin.setAtivo(true);
            admin.setEmpresa(empresa); // Relacionamento
            admin.setPerfil(perfil);   // Relacionamento
            
            // 🔥 O AutenticacaoService faz o hash da senha '123456'
            autenticacaoService.salvarUsuarios(admin, "123456"); 
        }
    }
}