package disk.pasta.controller;

import disk.pasta.dto.MensagemRequestDTO;
import disk.pasta.dto.MensagemResponseDTO;
import disk.pasta.dto.TicketClienteRequestDTO;
import disk.pasta.dto.TicketResponseDTO;
import disk.pasta.model.Ticket;
import disk.pasta.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PreAuthorize("hasRole('CLIENTE') and #clienteId == authentication.principal.id or hasAnyRole('N1','N2','N3','N4')") 
    @GetMapping("listar/cliente/{clienteId}")
    public ResponseEntity<Page<TicketResponseDTO>> listarPorCliente(
            @PathVariable Long clienteId,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ticketService.listadocliente(clienteId, pageable));
    }

    @PreAuthorize("hasAnyRole('N1','N2','N3','N4')")
    @GetMapping("listar/tecnico/{tecnicoId}")
    public ResponseEntity<Page<TicketResponseDTO>> listarParaTecnico(
            @PathVariable Long tecnicoId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ticketService.listarPorNivelTecnico(tecnicoId, pageable));
    }

    @PreAuthorize("hasAnyRole('N1','N2','N3','N4')")
    @GetMapping("listar/status/{status}/{tecnicoId}")
    public ResponseEntity<Page<TicketResponseDTO>> listarPorStatus(
            @PathVariable Ticket.Status status,
            @PathVariable Long tecnicoId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ticketService.listarPorStatus(status, tecnicoId, pageable));
    }

    @PreAuthorize("hasAnyRole('N1','N2','N3','N4')")
    @GetMapping("/listar/todos")
    public ResponseEntity<Page<TicketResponseDTO>> listarTodos(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ticketService.listarTodos(pageable));
    }

    @PreAuthorize("hasRole('CLIENTE') or hasAnyRole('N1','N2','N3','N4')")
    @PostMapping("/abrir")
    public ResponseEntity<Map<String, Object>> abrir(@Valid @RequestBody TicketClienteRequestDTO dto) {
        ticketService.abrirTicket(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "message", "Ticket aberto com sucesso",
            "sucesso", true
        ));
    }

    @PreAuthorize("hasAnyRole('N1','N2','N3','N4')")
    @PutMapping("/fechar/{id}")
    public ResponseEntity<Map<String, Object>> fechar(@PathVariable Long id) {
        ticketService.fecharTicket(id);
        return ResponseEntity.ok(Map.of(
            "message", "Ticket fechado com sucesso", 
            "sucesso", true
        ));
    }

    @PreAuthorize("hasAnyRole('N1','N2','N3','N4')")
    @PutMapping("/{id}/prioridade/{prioridade}")
    public ResponseEntity<TicketResponseDTO> alterarPrioridade(
            @PathVariable Long id, 
            @PathVariable Ticket.Prioridade prioridade) {
        return ResponseEntity.ok(ticketService.alterarPrioridade(id, prioridade));
    }

    @PreAuthorize("hasAnyRole('N1','N2','N3','N4')")
    @PutMapping("/{id}/assumir/{tecnicoId}")
    public ResponseEntity<TicketResponseDTO> assumirTicket(
            @PathVariable Long id, 
            @PathVariable Long tecnicoId) {
        return ResponseEntity.ok(ticketService.assumirTicket(id, tecnicoId));
    }

    @PreAuthorize("hasAnyRole('N1','N2','N3','N4')")
    @PutMapping("/{id}/transferir")
    public ResponseEntity<TicketResponseDTO> transferirTicket(
            @PathVariable Long id,
            @RequestParam(required = false) Long novoTecnicoId,
            @RequestParam(required = false) Ticket.Nivel novoNivel) {
        return ResponseEntity.ok(ticketService.transferirTicket(id, novoTecnicoId, novoNivel));
    }

    @PreAuthorize("hasRole('CLIENTE') or hasAnyRole('N1','N2','N3','N4')")
    @PostMapping("/{ticketId}/mensagens")
    public ResponseEntity<MensagemResponseDTO> enviarMensagem(
            @PathVariable Long ticketId,
            @Valid @RequestBody MensagemRequestDTO dto,
            @org.springframework.security.core.annotation.AuthenticationPrincipal disk.pasta.security.CustomUserDetails principal) {
        
        String nomeRemetente = principal.getNome(); 
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.enviarMensagem(ticketId, dto.getConteudo(), nomeRemetente));
    }

    @PreAuthorize("hasRole('CLIENTE') or hasAnyRole('N1','N2','N3','N4')")
    @GetMapping("/{ticketId}/mensagens")
    public ResponseEntity<List<MensagemResponseDTO>> listarMensagens(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.listarMensagensDoTicket(ticketId));
    }
}