import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { userLogin, loading, error, data } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setLocalError("Por favor, preencha todos os campos");
      return;
    }

    setLocalError("");

    try {
      await userLogin(formData.username, formData.password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);
      setLocalError(
        err instanceof Error
          ? err.message
          : "Erro ao fazer login. Verifique suas credenciais.",
      );
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Sistema de Gestão de Guilda</h1>
        <p className={styles.subtitle}>Login - New Coorporative</p>

        {(error || localError) && (
          <div className={styles.errorMessage}>{error || localError}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Digite seu username"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.registerLink}>
          <p>Não tem uma conta?</p>
          <button
            onClick={() => (window.location.href = "/register")}
            className={styles.linkButton}
          >
            Registre-se aqui
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
