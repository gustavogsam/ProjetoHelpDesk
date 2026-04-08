package disk.pasta.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TicketClienteRequestDTO {

    private Long clienteId;

    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    
    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

   
    
    
    


}
