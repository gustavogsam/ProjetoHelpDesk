export default function TicketDetailPage({
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
  auth,
  onBack,
}) {
  if (!selectedTicket) {
    return null;
  }

  return (
    <div className="ticket-detail-page">
      <div className="back-button">
        <button type="button" onClick={onBack}>← Voltar</button>
      </div>
      <section className="card ticket-detail">
        <h2>Ticket selecionado: {selectedTicket.id}</h2>
        <p><strong>Título:</strong> {selectedTicket.titulo}</p>
        <p><strong>Status:</strong> {selectedTicket.status}</p>
        <p><strong>Prioridade:</strong> {selectedTicket.prioridade}</p>
        <p><strong>Cliente:</strong> {selectedTicket.cliente?.nome || '-'}</p>
        <p><strong>Técnico:</strong> {selectedTicket.tecnicoNome || 'Não atribuído'}</p>

        {auth.perfil !== 'CLIENTE' && (
          <div className="action-group">
            <button type="button" onClick={onAssumeTicket}>Assumir ticket</button>
            <button type="button" onClick={onCloseTicket}>Fechar ticket</button>
          </div>
        )}

        {auth.perfil !== 'CLIENTE' && (
          <div className="action-group">
            <label>Nova prioridade</label>
            <select value={prioritySelection} onChange={(e) => setPrioritySelection(e.target.value)}>
              <option value="BAIXA">BAIXA</option>
              <option value="MEDIA">MEDIA</option>
              <option value="ALTA">ALTA</option>
            </select>
            <button type="button" onClick={onChangePriority}>Alterar prioridade</button>
          </div>
        )}

        {auth.perfil !== 'CLIENTE' && (
          <div className="action-group">
            <label>Transferir para técnico</label>
            <select value={transferData.tecnicoId} onChange={(e) => setTransferData({ ...transferData, tecnicoId: e.target.value })}>
              <option value="">Selecione</option>
              {tecnicos.map((tecnico) => (
                <option key={tecnico.id} value={tecnico.id}>{tecnico.nome}</option>
              ))}
            </select>
            <label>Nível</label>
            <select value={transferData.nivel} onChange={(e) => setTransferData({ ...transferData, nivel: e.target.value })}>
              <option value="n1">n1</option>
              <option value="n2">n2</option>
              <option value="n3">n3</option>
              <option value="n4">n4</option>
            </select>
            <button type="button" onClick={onTransferTicket}>Transferir ticket</button>
          </div>
        )}

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
    </div>
  );
}