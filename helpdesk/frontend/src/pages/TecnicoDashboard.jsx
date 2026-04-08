export default function TecnicoDashboard({
  auth,
  tickets,
  loading,
  statusFilter,
  onStatusChange,
  onReload,
  onSelectTicket,
  selectedTicket,
  ticketMessages,
  messageText,
  setMessageText,
  onSendMessage,
  onCloseTicket,
  onAssumeTicket,
  onChangePriority,
  prioritySelection,
  setPrioritySelection,
  transferData,
  setTransferData,
  tecnicos,
  onTransferTicket,
}) {
  return (
    <>
      <section className="grid-3cols">
        <div className="card">
          <h2>Tickets</h2>
          <div className="filter-row">
            <label>Filtrar status</label>
            <select value={statusFilter} onChange={onStatusChange}>
              <option value="TODOS">TODOS</option>
              <option value="ABERTO">ABERTO</option>
              <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
              <option value="FECHADO">FECHADO</option>
            </select>
          </div>
          <button className="secondary" onClick={onReload}>Atualizar lista</button>
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
                      {(ticket.status === 'ABERTO' && (!ticket.tecnicoNome || ticket.tecnicoNome === 'Não atribuído' || ticket.tecnicoNome === '-')) && (
                        <button type="button" className="small" onClick={() => onAssumeTicket(ticket.id)}>Assumir</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>

        <div className="card">
          <h2>Ações do técnico</h2>
          <p>Selecione um ticket para habilitar as ações.</p>
        </div>

        <div className="card">
          <h2>Mensagens</h2>
          {selectedTicket ? (
            <>
              <p><strong>Ticket selecionado:</strong> {selectedTicket.id}</p>
              <div className="messages-panel">
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
              </div>
              <form onSubmit={onSendMessage}>
                <label>Nova mensagem</label>
                <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows="3" required />
                <button type="submit">Enviar mensagem</button>
              </form>
            </>
          ) : <p>Escolha um ticket para ver as mensagens.</p>}
        </div>
      </section>
    </>
  );
}
