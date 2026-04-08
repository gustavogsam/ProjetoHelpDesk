const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function basicAuthHeader(email, senha) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(`${email}:${senha}`)}`,
  };
}

async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.erro || errorMessage);
    } catch (e) {
      throw new Error(e.message || errorMessage);
    }
  }
  return response.json();
}

export async function login(email, senha) {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  });

  return handleResponse(response, 'Falha no login');
}

export async function registerCliente(dto) {
  const response = await fetch(`${baseUrl}/clientes/criar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  return handleResponse(response, 'Falha ao cadastrar cliente');
}

export async function fetchTicketsCliente(clienteId, auth) {
  const response = await fetch(`${baseUrl}/tickets/listar/cliente/${clienteId}?page=0&size=20`, {
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao buscar tickets do cliente');
}

export async function fetchTecnicoTickets(tecnicoId, auth) {
  const response = await fetch(`${baseUrl}/tickets/listar/tecnico/${tecnicoId}?page=0&size=20`, {
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao buscar tickets do técnico');
}

export async function fetchTicketsByStatus(status, tecnicoId, auth) {
  const response = await fetch(`${baseUrl}/tickets/listar/status/${status}/${tecnicoId}?page=0&size=20`, {
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao buscar tickets por status');
}

export async function fetchAllTickets(auth) {
  const response = await fetch(`${baseUrl}/tickets/listar/todos?page=0&size=20`, {
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao buscar tickets');
}

export async function fetchTecnicosSimples(auth) {
  const response = await fetch(`${baseUrl}/tecnicos/listar/simples`, {
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao buscar técnicos');
}

export async function fetchTecnicosCompletos(auth) {
  const response = await fetch(`${baseUrl}/tecnicos/listar/completo`, {
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao buscar técnicos completos');
}

export async function criarTecnico(dto, auth) {
  const response = await fetch(`${baseUrl}/tecnicos/criar`, {
    method: 'POST',
    headers: basicAuthHeader(auth.email, auth.senha),
    body: JSON.stringify(dto),
  });

  return handleResponse(response, 'Falha ao criar técnico');
}

export async function suspenderTecnico(id, auth) {
  const response = await fetch(`${baseUrl}/tecnicos/suspender/${id}`, {
    method: 'PUT',
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao suspender técnico');
}

export async function deletarTecnico(id, auth) {
  const response = await fetch(`${baseUrl}/tecnicos/deletar/${id}`, {
    method: 'DELETE',
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao deletar técnico');
}

export async function abrirTicket(dto, auth) {
  const response = await fetch(`${baseUrl}/tickets/abrir`, {
    method: 'POST',
    headers: basicAuthHeader(auth.email, auth.senha),
    body: JSON.stringify(dto),
  });

  return handleResponse(response, 'Falha ao abrir ticket');
}

export async function fecharTicket(ticketId, auth) {
  const response = await fetch(`${baseUrl}/tickets/fechar/${ticketId}`, {
    method: 'PUT',
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao fechar ticket');
}

export async function assumirTicket(ticketId, tecnicoId, auth) {
  const response = await fetch(`${baseUrl}/tickets/${ticketId}/assumir/${tecnicoId}`, {
    method: 'PUT',
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao assumir ticket');
}

export async function alterarPrioridade(ticketId, prioridade, auth) {
  const response = await fetch(`${baseUrl}/tickets/${ticketId}/prioridade/${prioridade}`, {
    method: 'PUT',
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao alterar prioridade');
}

export async function transferirTicket(ticketId, novoTecnicoId, novoNivel, auth) {
  const params = new URLSearchParams();
  if (novoTecnicoId) params.append('novoTecnicoId', novoTecnicoId);
  if (novoNivel) params.append('novoNivel', novoNivel);

  const response = await fetch(`${baseUrl}/tickets/${ticketId}/transferir?${params.toString()}`, {
    method: 'PUT',
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao transferir ticket');
}

export async function fetchMensagensTicket(ticketId, auth) {
  const response = await fetch(`${baseUrl}/tickets/${ticketId}/mensagens`, {
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao buscar mensagens');
}

export async function enviarMensagem(ticketId, conteudo, auth) {
  const response = await fetch(`${baseUrl}/tickets/${ticketId}/mensagens`, {
    method: 'POST',
    headers: basicAuthHeader(auth.email, auth.senha),
    body: JSON.stringify({ conteudo }),
  });

  return handleResponse(response, 'Falha ao enviar mensagem');
}

export async function atualizarCliente(id, dto, auth) {
  const response = await fetch(`${baseUrl}/clientes/atualizar/${id}`, {
    method: 'PUT',
    headers: basicAuthHeader(auth.email, auth.senha),
    body: JSON.stringify(dto),
  });

  return handleResponse(response, 'Falha ao atualizar cliente');
}

export async function deletarCliente(id, auth) {
  const response = await fetch(`${baseUrl}/clientes/deletar/${id}`, {
    method: 'DELETE',
    headers: basicAuthHeader(auth.email, auth.senha),
  });

  return handleResponse(response, 'Falha ao deletar cliente');
}
