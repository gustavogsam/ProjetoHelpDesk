# HelpDesk Frontend

Frontend React criado para o backend localizado em `deskjava`.

## Como usar

1. Abra um terminal em `frontend`.
2. Execute `npm install`.
3. Execute `npm run dev`.
4. Acesse o endereço exibido no terminal, por padrão `http://localhost:5173`.

## Endpoints usados

- POST `/auth/login`
- POST `/clientes/criar`
- GET `/tickets/listar/cliente/{clienteId}`
- GET `/tickets/listar/todos`
- POST `/tickets/abrir`

> O backend deve estar rodando em `http://localhost:8080` para que o frontend funcione corretamente.
