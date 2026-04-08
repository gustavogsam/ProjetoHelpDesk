package disk.pasta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import disk.pasta.dto.LoginRequestDTO;
import disk.pasta.dto.LoginResponseDTO;
import disk.pasta.model.Cliente;
import disk.pasta.model.Tecnico;
import disk.pasta.repository.ClienteRepository;
import disk.pasta.repository.TecnicoRepository;

import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TecnicoRepository tecnicoRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public LoginResponseDTO logar(LoginRequestDTO dados) {
        Optional<Cliente> cliente = clienteRepository.findByEmail(dados.getEmail());
        if (cliente.isPresent()) {
            if (passwordEncoder.matches(dados.getSenha(), cliente.get().getSenha())) {
                return new LoginResponseDTO(cliente.get().getId(), "token-fake-123", cliente.get().getNome(), "CLIENTE");
            }
        }

        Optional<Tecnico> tecnico = tecnicoRepository.findByEmail(dados.getEmail());
        if (tecnico.isPresent()) {
            if (passwordEncoder.matches(dados.getSenha(), tecnico.get().getSenha())) {
                if (!tecnico.get().isAtivo()) {
                    throw new RuntimeException("Acesso negado: Técnico inativo.");
                }
                return new LoginResponseDTO(tecnico.get().getId(), "token-fake-456", tecnico.get().getNome(), "TECNICO");
            }
        }

        throw new RuntimeException("E-mail ou senha inválidos.");
    }
}