export default function ClienteDashboard({
  auth,
  tickets,
  loading,
  ticketData,
  setTicketData,
  onOpenTicket,
  selectedTicket,
  onSelectTicket,
  ticketMessages,
  messageText,
  setMessageText,
  onSendMessage,
  onCloseTicket,
  profileData,
  setProfileData,
  onUpdateProfile,
  onDeleteAccount,
}) {
  return (
    <>
      <section className="grid-3cols">
        <div className="card">
          <h2>Tickets</h2>
          <button className="secondary" onClick={() => onSelectTicket(null)}>Atualizar lista</button>
          {loading ? <p>Carregando...</p> : null}
          {tickets.length === 0 && !loading ? <p>Nenhum ticket encontrado.</p> : null}
          {tickets.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Status</th>
                  <th>Prioridade</th>
                  <th>Cliente</th>
                  <th>Técnico</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.status}</td>
                    <td>{ticket.prioridade}</td>
                    <td>{ticket.cliente?.nome}</td>
                    <td>{ticket.tecnicoNome || '-'}</td>
                    <td>
                      <button type="button" className="small" onClick={() => onSelectTicket(ticket)}>Selecionar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>

        <div className="card">
          <h2>Abrir novo ticket</h2>
          <form onSubmit={onOpenTicket}>
            <label>Título</label>
            <input value={ticketData.titulo} onChange={(e) => setTicketData({ ...ticketData, titulo: e.target.value })} required />
            <label>Descrição</label>
            <textarea value={ticketData.descricao} onChange={(e) => setTicketData({ ...ticketData, descricao: e.target.value })} required rows="4" />
            <button type="submit">Abrir ticket</button>
          </form>
        </div>

        <div className="card">
          <h2>Meu perfil</h2>
          <form onSubmit={onUpdateProfile}>
            <label>Nome</label>
            <input value={profileData.nome} onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })} required />
            <label>Nova senha</label>
            <input value={profileData.senha} onChange={(e) => setProfileData({ ...profileData, senha: e.target.value })} type="password" minLength={6} />
            <button type="submit">Atualizar perfil</button>
          </form>
          <button type="button" className="danger" onClick={onDeleteAccount}>Excluir conta</button>
        </div>
      </section>

      {selectedTicket ? (
        <section className="card ticket-detail">
          <h2>Ticket selecionado: {selectedTicket.id}</h2>
          <p><strong>Título:</strong> {selectedTicket.titulo}</p>
          <p><strong>Status:</strong> {selectedTicket.status}</p>
          <p><strong>Prioridade:</strong> {selectedTicket.prioridade}</p>
          <p><strong>Cliente:</strong> {selectedTicket.cliente?.nome || '-'}</p>
          <p><strong>Técnico:</strong> {selectedTicket.tecnicoNome || 'Não atribuído'}</p>

          <div className="messages-panel">
            <h3>Mensagens</h3>
            {ticketMessages.length === 0 ? <p>Nenhuma mensagem.</p> : null}
            <div className="message-list">
              {ticketMessages.map((message) => (
                <div key={message.id} className="message-item">
                  <strong>{message.remetenteNome}</strong>
                  <p>{message.conteudo}</p>
                  <small>{new Date(message.enviadoEm).toLocaleString()}</small>
                </div>
              ))}
            </div>
            <form onSubmit={onSendMessage}>
              <label>Nova mensagem</label>
              <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows="3" required />
              <button type="submit">Enviar mensagem</button>
            </form>
          </div>
        </section>
      ) : null}
    </>
  );
}
