package disk.pasta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TicketResponseDTO {

    private long id;
    
    private String titulo;
    
    private String descricao;
    
    private String status;

    private ClienteSimplesResponseDTO cliente;

    private String prioridade;

    private String tecnicoNome;

    

    
}
