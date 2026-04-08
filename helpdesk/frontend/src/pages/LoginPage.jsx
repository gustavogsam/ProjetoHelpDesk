import { useState } from 'react';

export default function LoginPage({
  email,
  senha,
  setEmail,
  setSenha,
  registerData,
  setRegisterData,
  onLogin,
  onRegister,
}) {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <section className="auth-container">
      <div className="auth-tabs">
        <button
          type="button"
          className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Cadastrar Cliente
        </button>
      </div>

      <div className="card auth-card">
        {activeTab === 'login' && (
          <>
            <h2>Login</h2>
            <form onSubmit={onLogin}>
              <label>E-mail</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              <label>Senha</label>
              <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" required />
              <button type="submit">Entrar</button>
            </form>
          </>
        )}

        {activeTab === 'register' && (
          <>
            <h2>Cadastrar Cliente</h2>
            <form onSubmit={onRegister}>
              <label>Nome</label>
              <input value={registerData.nome} onChange={(e) => setRegisterData({ ...registerData, nome: e.target.value })} required />
              <label>E-mail</label>
              <input value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} type="email" required />
              <label>Senha</label>
              <input value={registerData.senha} onChange={(e) => setRegisterData({ ...registerData, senha: e.target.value })} type="password" required minLength={6} />
              <label>CPF</label>
              <input value={registerData.cpf} onChange={(e) => setRegisterData({ ...registerData, cpf: e.target.value })} required />
              <label>Telefone</label>
              <input value={registerData.telefone} onChange={(e) => setRegisterData({ ...registerData, telefone: e.target.value })} />
              <button type="submit">Cadastrar</button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
