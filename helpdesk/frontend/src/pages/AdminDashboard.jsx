export default function AdminDashboard({
  canManageTecnicos,
  novoTecnico,
  setNovoTecnico,
  onCreateTecnico,
  tecnicosCompletos,
  onSuspendTecnico,
  onDeleteTecnico,
}) {
  if (!canManageTecnicos) {
    return null;
  }

  return (
    <section className="card admin-panel">
      <h2>Dashboard Admin</h2>
      <form onSubmit={onCreateTecnico}>
        <label>Nome</label>
        <input value={novoTecnico.nome} onChange={(e) => setNovoTecnico({ ...novoTecnico, nome: e.target.value })} required />
        <label>E-mail</label>
        <input value={novoTecnico.email} onChange={(e) => setNovoTecnico({ ...novoTecnico, email: e.target.value })} type="email" required />
        <label>Senha</label>
        <input value={novoTecnico.senha} onChange={(e) => setNovoTecnico({ ...novoTecnico, senha: e.target.value })} type="password" required minLength={6} />
        <label>Nível</label>
        <select value={novoTecnico.nivel} onChange={(e) => setNovoTecnico({ ...novoTecnico, nivel: e.target.value })}>
          <option value="n1">n1</option>
          <option value="n2">n2</option>
          <option value="n3">n3</option>
          <option value="n4">n4</option>
        </select>
        <button type="submit">Criar técnico</button>
      </form>

      <h3>Técnicos cadastrados</h3>
      {tecnicosCompletos.length === 0 ? <p>Nenhum técnico encontrado.</p> : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Nível</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tecnicosCompletos.map((tecnico) => (
              <tr key={tecnico.id}>
                <td>{tecnico.id}</td>
                <td>{tecnico.nome}</td>
                <td>{tecnico.email}</td>
                <td>{tecnico.nivel}</td>
                <td>{String(tecnico.ativo)}</td>
                <td>
                  <button type="button" className="small" onClick={() => onSuspendTecnico(tecnico.id)}>Suspender</button>
                  <button type="button" className="small danger" onClick={() => onDeleteTecnico(tecnico.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
