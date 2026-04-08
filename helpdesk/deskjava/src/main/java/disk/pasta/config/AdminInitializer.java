package disk.pasta.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import disk.pasta.model.Tecnico;
import disk.pasta.repository.TecnicoRepository;

@Component
public class AdminInitializer implements ApplicationRunner {

    @Autowired
    private TecnicoRepository tecnicoRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        var adminOpt = tecnicoRepository.findByEmail("admin@tecnico.com");
        
        if (adminOpt.isEmpty()) {
            Tecnico admin = new Tecnico();
            admin.setNome("Administrador Sistema");
            admin.setEmail("admin@tecnico.com");
            admin.setSenha(bCryptPasswordEncoder.encode("@admin123"));
            admin.setNivel(Tecnico.Nivel.n4);
            admin.setAtivo(true);
            
            tecnicoRepository.save(admin);
        } else {
            Tecnico admin = adminOpt.get();
            admin.setSenha(bCryptPasswordEncoder.encode("@admin123"));
            admin.setAtivo(true);
            admin.setNivel(Tecnico.Nivel.n4);
            tecnicoRepository.save(admin);
        }
    }
}