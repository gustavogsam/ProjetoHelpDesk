import { useEffect, useMemo, useState } from 'react';
import LoginPage from './pages/LoginPage';
import ClienteDashboard from './pages/ClienteDashboard';
import TecnicoDashboard from './pages/TecnicoDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TicketDetailPage from './pages/TicketDetailPage';
import {
  login as apiLogin,
  registerCliente,
  fetchTicketsCliente,
  fetchTecnicoTickets,
  fetchTicketsByStatus,
  fetchTecnicosSimples,
  fetchTecnicosCompletos,
  criarTecnico,
  suspenderTecnico,
  deletarTecnico,
  abrirTicket,
  fecharTicket,
  assumirTicket,
  alterarPrioridade,
  transferirTicket,
  fetchMensagensTicket,
  enviarMensagem,
  atualizarCliente,
  deletarCliente,
} from './api';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ticketStatusOptions = ['TODOS', 'ABERTO', 'EM_ANDAMENTO', 'FECHADO'];
const prioridadeOptions = ['BAIXA', 'MEDIA', 'ALTA'];
const nivelOptions = ['n1', 'n2', 'n3', 'n4'];

function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : null;
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState('LOGIN');
  const [isValidatingToken, setIsValidatingToken] = useState(() => {
    return Boolean(localStorage.getItem('auth'));
  });

  const [registerData, setRegisterData] = useState({ nome: '', email: '', senha: '', cpf: '', telefone: '' });
  const [profileData, setProfileData] = useState({ nome: '', senha: '' });
  const [ticketData, setTicketData] = useState({ titulo: '', descricao: '' });
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [prioritySelection, setPrioritySelection] = useState('MEDIA');
  const [transferData, setTransferData] = useState({ tecnicoId: '', nivel: 'n1' });
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicosCompletos, setTecnicosCompletos] = useState([]);
  const [novoTecnico, setNovoTecnico] = useState({ nome: '', email: '', senha: '', nivel: 'n1' });
  const [canManageTecnicos, setCanManageTecnicos] = useState(false);
  const [loading, setLoading] = useState(false);

  const authHeader = useMemo(() => {
    if (!auth) return null;
    return { email: auth.email, senha: auth.senha };
  }, [auth]);

  useEffect(() => {
    if (!auth) return;

    loadTickets();

    if (auth.perfil !== 'CLIENTE') {
      loadTecnicos();
      loadTecnicosSimples();
      loadTecnicosCompletos();
    }

    if (auth.perfil === 'CLIENTE') {
      setProfileData({ nome: auth.nome, senha: '' });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth) {
      setCurrentPage('LOGIN');
      return;
    }

    if (auth.perfil === 'CLIENTE') {
      setCurrentPage('CLIENTE');
    } else {
      setCurrentPage('TECNICO');
    }
  }, [auth]);

  useEffect(() => {
    const validate = async () => {
      const savedAuth = localStorage.getItem('auth');
      if (!savedAuth) {
        setIsValidatingToken(false);
        return;
      }

      try {
        const parsedAuth = JSON.parse(savedAuth);
        let url = `${baseUrl}/tickets/listar/todos?page=0&size=1`;

        if (parsedAuth.perfil === 'CLIENTE') {
          url = `${baseUrl}/tickets/listar/cliente/${parsedAuth.id}?page=0&size=1`;
        } else {
          url = `${baseUrl}/tickets/listar/tecnico/${parsedAuth.id}?page=0&size=1`;
        }

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`${parsedAuth.email}:${parsedAuth.senha}`)}`,
          },
        });

        if (response.ok) {
          setAuth(parsedAuth);
        } else {
          localStorage.removeItem('auth');
          setAuth(null);
        }
      } catch (error) {
        localStorage.removeItem('auth');
        setAuth(null);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validate();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await apiLogin(email, senha);
      const authData = { ...response, email, senha };
      setAuth(authData);
      localStorage.setItem('auth', JSON.stringify(authData));
      setEmail('');
      setSenha('');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Falha no login. Verifique e-mail e senha.');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await registerCliente(registerData);
      setSuccessMessage('Cliente cadastrado com sucesso. Agora faça login.');
      setRegisterData({ nome: '', email: '', senha: '', cpf: '', telefone: '' });
    } catch (error) {
      console.error('Register error:', error);
      setErrorMessage(error.message || 'Erro ao cadastrar cliente. Verifique os dados.');
    }
  };

  const loadTecnicos = async () => {
    if (!authHeader) return;

    try {
      const data = await fetchTecnicosSimples(authHeader);
      setTecnicos(data || []);
    } catch (error) {
      console.error('Não foi possível carregar técnicos', error);
    }
  };

  const loadTickets = async () => {
    if (!authHeader) return;

    setLoading(true);
    setErrorMessage('');

    try {
      if (auth.perfil === 'CLIENTE') {
        const data = await fetchTicketsCliente(auth.id, authHeader);
        setTickets(data.content || []);
      } else if (statusFilter !== 'TODOS') {
        const data = await fetchTicketsByStatus(statusFilter, auth.id, authHeader);
        setTickets(data.content || []);
      } else {
        const data = await fetchTecnicoTickets(auth.id, authHeader);
        setTickets(data.content || []);
      }
    } catch (error) {
      setErrorMessage('Falha ao carregar tickets.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = async (event) => {
    const filter = event.target.value;
    setStatusFilter(filter);
    setSelectedTicket(null);

    if (!authHeader) return;

    setLoading(true);
    setErrorMessage('');

    try {
      if (filter === 'TODOS') {
        const data = await fetchTecnicoTickets(auth.id, authHeader);
        setTickets(data.content || []);
      } else {
        const data = await fetchTicketsByStatus(filter, auth.id, authHeader);
        setTickets(data.content || []);
      }
    } catch (error) {
      setErrorMessage('Falha ao aplicar filtro de status.');
    } finally {
      setLoading(false);
    }
  };

  const loadTecnicosSimples = async () => {
    if (!authHeader) return;

    try {
      const data = await fetchTecnicosSimples(authHeader);
      setTecnicos(data || []);
    } catch (error) {
      console.error('Não foi possível carregar técnicos simples', error);
    }
  };

  const loadTecnicosCompletos = async () => {
    if (!authHeader) return;

    try {
      const data = await fetchTecnicosCompletos(authHeader);
      setTecnicosCompletos(data?.content || []);
      setCanManageTecnicos(true);
    } catch (error) {
      setCanManageTecnicos(false);
    }
  };

  const handleCreateTecnico = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await criarTecnico(novoTecnico, authHeader);
      setSuccessMessage('Técnico criado com sucesso.');
      setNovoTecnico({ nome: '', email: '', senha: '', nivel: 'n1' });
      loadTecnicosCompletos();
      loadTecnicosSimples();
    } catch (error) {
      setErrorMessage('Erro ao criar técnico.');
    }
  };

  const handleSuspendTecnico = async (id) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await suspenderTecnico(id, authHeader);
      setSuccessMessage('Técnico suspenso com sucesso.');
      loadTecnicosCompletos();
      loadTecnicosSimples();
    } catch (error) {
      setErrorMessage('Erro ao suspender técnico.');
    }
  };

  const handleDeleteTecnico = async (id) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await deletarTecnico(id, authHeader);
      setSuccessMessage('Técnico deletado com sucesso.');
      loadTecnicosCompletos();
      loadTecnicosSimples();
    } catch (error) {
      setErrorMessage('Erro ao deletar técnico.');
    }
  };

  const handleAbrirTicket = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await abrirTicket({ ...ticketData, clienteId: auth.id }, authHeader);
      setSuccessMessage('Ticket aberto com sucesso.');
      setTicketData({ titulo: '', descricao: '' });
      loadTickets();
    } catch (error) {
      setErrorMessage('Erro ao abrir ticket.');
    }
  };

  const loadMessages = async (ticketId) => {
    if (!authHeader || !ticketId) {
      setTicketMessages([]);
      return;
    }

    try {
      const data = await fetchMensagensTicket(ticketId, authHeader);
      setTicketMessages(data || []);
    } catch (error) {
      console.error('Falha ao carregar mensagens', error);
      setTicketMessages([]);
    }
  };

  const handleSelectTicket = async (ticket) => {
    if (!ticket) {
      setSelectedTicket(null);
      setTicketMessages([]);
      setMessageText('');
      return;
    }

    const selected = { ...ticket };
    setSelectedTicket(selected);
    setMessageText('');

    if (selected.id) {
      await loadMessages(selected.id);
    } else {
      setTicketMessages([]);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!selectedTicket) return;
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await enviarMensagem(selectedTicket.id, messageText, authHeader);
      setSuccessMessage('Mensagem enviada com sucesso.');
      setMessageText('');
      loadMessages(selectedTicket.id);
    } catch (error) {
      setErrorMessage('Erro ao enviar mensagem.');
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await fecharTicket(selectedTicket.id, authHeader);
      setSuccessMessage('Ticket fechado com sucesso.');
      loadTickets();
      setSelectedTicket(null);
    } catch (error) {
      setErrorMessage('Erro ao fechar ticket.');
    }
  };

  const handleAssumirTicket = async (ticketId = null) => {
    const idToAssume = ticketId || selectedTicket?.id;
    if (!idToAssume) {
      setErrorMessage('Selecione um ticket para assumir.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      await assumirTicket(idToAssume, auth.id, authHeader);
      setSuccessMessage('Ticket assumido com sucesso.');
      loadTickets();
      setSelectedTicket(null);
    } catch (error) {
      setErrorMessage('Erro ao assumir ticket.');
    }
  };

  const handleChangePriority = async () => {
    if (!selectedTicket) return;
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await alterarPrioridade(selectedTicket.id, prioritySelection, authHeader);
      setSuccessMessage('Prioridade alterada com sucesso.');
      loadTickets();
      setSelectedTicket(null);
    } catch (error) {
      setErrorMessage('Erro ao alterar prioridade.');
    }
  };

  const handleTransferTicket = async () => {
    if (!selectedTicket) return;
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await transferirTicket(selectedTicket.id, transferData.tecnicoId || null, transferData.nivel || null, authHeader);
      setSuccessMessage('Ticket transferido com sucesso.');
      loadTickets();
      setSelectedTicket(null);
    } catch (error) {
      setErrorMessage('Erro ao transferir ticket.');
    }
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    if (!auth) return;
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await atualizarCliente(auth.id, profileData, authHeader);
      setSuccessMessage('Perfil atualizado com sucesso.');
      const updatedAuth = { ...auth, nome: profileData.nome };
      setAuth(updatedAuth);
      localStorage.setItem('auth', JSON.stringify(updatedAuth));
    } catch (error) {
      setErrorMessage('Erro ao atualizar perfil.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth) return;
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await deletarCliente(auth.id, authHeader);
      handleLogout();
      setSuccessMessage('Conta excluída com sucesso.');
    } catch (error) {
      setErrorMessage('Erro ao excluir conta.');
    }
  };

  const handleLogout = () => {
    setAuth(null);
    setCurrentPage('LOGIN');
    setTickets([]);
    setSelectedTicket(null);
    setTicketMessages([]);
    setTecnicos([]);
    setTecnicosCompletos([]);
    setCanManageTecnicos(false);
    setErrorMessage('');
    setSuccessMessage('');
    localStorage.removeItem('auth');
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="app-shell">
      <header>
        <h1>HelpDesk React</h1>
        {auth ? (
          <div className="user-info">
            <span>{auth.nome} ({auth.perfil})</span>
            <button onClick={handleLogout}>Sair</button>
          </div>
        ) : null}
      </header>

      <main>
        {isValidatingToken ? (
          <div className="loading-screen">
            <p>Validando sessão...</p>
          </div>
        ) : !auth ? (
          <LoginPage
            email={email}
            senha={senha}
            setEmail={setEmail}
            setSenha={setSenha}
            registerData={registerData}
            setRegisterData={setRegisterData}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        ) : (
          <>
            <div className="page-nav">
              {auth.perfil === 'CLIENTE' ? (
                <button className={currentPage === 'CLIENTE' ? 'active' : ''} onClick={() => handlePageChange('CLIENTE')}>Meu Dashboard</button>
              ) : (
                <>
                  <button className={currentPage === 'TECNICO' ? 'active' : ''} onClick={() => handlePageChange('TECNICO')}>Dashboard Técnico</button>
                  {canManageTecnicos && (
                    <button className={currentPage === 'ADMIN' ? 'active' : ''} onClick={() => handlePageChange('ADMIN')}>Dashboard Admin</button>
                  )}
                </>
              )}
            </div>

            {currentPage === 'CLIENTE' && auth.perfil === 'CLIENTE' && !selectedTicket && (
              <ClienteDashboard
                auth={auth}
                tickets={tickets}
                loading={loading}
                ticketData={ticketData}
                setTicketData={setTicketData}
                onOpenTicket={handleAbrirTicket}
                selectedTicket={selectedTicket}
                onSelectTicket={handleSelectTicket}
                ticketMessages={ticketMessages}
                messageText={messageText}
                setMessageText={setMessageText}
                onSendMessage={handleSendMessage}
                onCloseTicket={handleCloseTicket}
                profileData={profileData}
                setProfileData={setProfileData}
                onUpdateProfile={handleUpdateProfile}
                onDeleteAccount={handleDeleteAccount}
              />
            )}

            {currentPage === 'TECNICO' && auth.perfil !== 'CLIENTE' && !selectedTicket && (
              <TecnicoDashboard
                auth={auth}
                tickets={tickets}
                loading={loading}
                statusFilter={statusFilter}
                onStatusChange={handleStatusFilterChange}
                onReload={loadTickets}
                onSelectTicket={handleSelectTicket}
                selectedTicket={selectedTicket}
                ticketMessages={ticketMessages}
                messageText={messageText}
                setMessageText={setMessageText}
                onSendMessage={handleSendMessage}
                onCloseTicket={handleCloseTicket}
                onAssumeTicket={handleAssumirTicket}
                onChangePriority={handleChangePriority}
                prioritySelection={prioritySelection}
                setPrioritySelection={setPrioritySelection}
                transferData={transferData}
                setTransferData={setTransferData}
                tecnicos={tecnicos}
                onTransferTicket={handleTransferTicket}
              />
            )}

            {currentPage === 'ADMIN' && canManageTecnicos && !selectedTicket && (
              <AdminDashboard
                canManageTecnicos={canManageTecnicos}
                novoTecnico={novoTecnico}
                setNovoTecnico={setNovoTecnico}
                onCreateTecnico={handleCreateTecnico}
                tecnicosCompletos={tecnicosCompletos}
                onSuspendTecnico={handleSuspendTecnico}
                onDeleteTecnico={handleDeleteTecnico}
              />
            )}

            {selectedTicket && (
              <TicketDetailPage
                selectedTicket={selectedTicket}
                ticketMessages={ticketMessages}
                messageText={messageText}
                setMessageText={setMessageText}
                onSendMessage={handleSendMessage}
                onCloseTicket={handleCloseTicket}
                onAssumeTicket={handleAssumirTicket}
                onChangePriority={handleChangePriority}
                prioritySelection={prioritySelection}
                setPrioritySelection={setPrioritySelection}
                transferData={transferData}
                setTransferData={setTransferData}
                tecnicos={tecnicos}
                onTransferTicket={handleTransferTicket}
                auth={auth}
                onBack={() => handleSelectTicket(null)}
              />
            )}
          </>
        )}

        {errorMessage ? <div className="alert alert-error">{errorMessage}</div> : null}
        {successMessage ? <div className="alert alert-success">{successMessage}</div> : null}
      </main>
    </div>
  );
}

export default App;
