import React, { useState } from "react";
import {
  verifyGuildMembership,
  verifyTokenInComment,
  generateGuildToken,
} from "../../apis/tibia";
import { USER_POST } from "../../apis/user";
import { TOKEN_POST } from "../../apis/auth";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  characterName: string;
  guildToken?: string;
  rank?: string;
}

const Register: React.FC = () => {
  const { loading, error: contextError } = useUser();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    characterName: "",
    guildToken: "",
    rank: "",
  });
  const [generatedToken, setGeneratedToken] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [useManualToken, setUseManualToken] = useState(false);
  const [characterComment, setCharacterComment] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError("");
  };

  const saveUserWithToken = async (token?: string) => {
    try {
      setLocalLoading(true);
      setLocalError("");

      const userData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        character_name: formData.characterName,
        guild_token: token || formData.guildToken || "",
        rank: formData.rank || "",
      };

      const { url, options } = USER_POST(userData);

      const response = await fetch(url, options);

      if (!response.ok) {
        // Tentar extrair mensagem de erro da resposta
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Se não conseguir parsear JSON, usar statusText
        }

        // Mapear códigos de status para mensagens específicas
        switch (response.status) {
          case 400:
            throw new Error(
              "Limite de registros atingido (máximo 100 usuários)",
            );
          case 403:
            if (errorMessage.includes("Email")) {
              throw new Error("Este email já está cadastrado no sistema");
            } else if (errorMessage.includes("Username")) {
              throw new Error("Este nome de usuário já está em uso");
            }
            throw new Error("Acesso negado: " + errorMessage);
          case 406:
            throw new Error("Username e senha são obrigatórios");
          case 500:
            throw new Error(
              "Erro interno do servidor. Tente novamente mais tarde",
            );
          default:
            throw new Error(
              `Erro no registro (${response.status}): ${errorMessage}`,
            );
        }
      }

      const responseData = await response.json();

      // Após criar o usuário, fazer login para obter o token
      const { url: tokenUrl, options: tokenOptions } = TOKEN_POST({
        username: formData.username,
        password: formData.password,
      });

      const tokenResponse = await fetch(tokenUrl, tokenOptions);

      if (!tokenResponse.ok) {
        throw new Error("Erro ao obter token de autenticação");
      }

      const tokenData = await tokenResponse.json();

      const { token: apiToken } = tokenData;

      if (!apiToken) {
        throw new Error("Token não encontrado na resposta de autenticação");
      }

      window.localStorage.setItem("token", apiToken);

      // Redirecionar para dashboard após sucesso
      navigate("/dashboard");
    } catch (err) {
      console.error("ERRO NO REGISTRO:", err);
      setLocalError(
        `Erro ao salvar usuário: ${
          err instanceof Error ? err.message : "Erro desconhecido"
        }`,
      );
    } finally {
      setLocalLoading(false);
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações do Step 1
    if (
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.email
    ) {
      setLocalError("Por favor, preencha todos os campos");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!formData.email.includes("@")) {
      setLocalError("Por favor, insira um email válido");
      return;
    }

    setCurrentStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.characterName) {
      setLocalError("Por favor, informe o nome do personagem");
      return;
    }

    setLocalLoading(true);
    setLocalError("");

    try {
      const result = await verifyGuildMembership(formData.characterName);

      if (!result.success) {
        setLocalError(result.error || "Erro ao verificar personagem");
        return;
      }

      if (!result.isInGuild) {
        setLocalError("Personagem não encontrado na guilda New Coorporative");
        return;
      }

      // Salvar o comentário e rank do personagem para mostrar no Step 3
      if (result.character) {
        setCharacterComment(result.character.comment);

        // Capturar o rank do personagem na guilda
        const characterRank = result.character.guild?.rank || "";

        // Atualizar o formData com o rank
        setFormData((prev) => ({
          ...prev,
          rank: characterRank,
        }));
      }

      // Perguntar se quer usar token manual ou gerar novo
      setCurrentStep(3);
    } catch (err) {
      setLocalError("Erro inesperado ao verificar personagem");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGenerateToken = () => {
    const token = generateGuildToken();
    setGeneratedToken(token);
    setFormData((prev) => ({
      ...prev,
      guildToken: token,
    }));
    setUseManualToken(false);
  };

  const handleUseManualToken = () => {
    if (!manualToken.trim()) {
      setLocalError("Por favor, insira um token válido");
      return;
    }

    setUseManualToken(true);
    setFormData((prev) => ({
      ...prev,
      guildToken: manualToken.trim(),
    }));
    setLocalError("");
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError("");

    try {
      const tokenToVerify = useManualToken ? manualToken : generatedToken;

      const result = await verifyTokenInComment(
        formData.characterName,
        tokenToVerify,
      );

      if (!result.success) {
        setLocalError(result.error || "Erro ao verificar token");
        return;
      }

      if (!result.tokenMatches) {
        setLocalError(
          "Token não encontrado no comentário do personagem. Verifique se você adicionou o token corretamente.",
        );
        return;
      }

      // Salvar o token no formData antes de salvar o usuário
      const tokenToSave = useManualToken ? manualToken : generatedToken;

      setFormData((prev) => ({
        ...prev,
        guildToken: tokenToSave,
      }));

      // Salvar usuário com token passando o token diretamente
      await saveUserWithToken(tokenToSave);
    } catch (err) {
      setLocalError("Erro inesperado ao verificar token");
    } finally {
      setLocalLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Step 1: Dados Pessoais</h2>
      <p className={styles.stepDescription}>
        Preencha seus dados para criar uma conta no sistema
      </p>

      <form onSubmit={handleStep1Submit} className={styles.form}>
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
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Digite seu email"
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

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirmar Senha
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Confirme sua senha"
            required
          />
        </div>

        <button type="submit" className={styles.button}>
          Continuar
        </button>
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Step 2: Verificação de Personagem</h2>
      <p className={styles.stepDescription}>
        Informe o nome do seu personagem no Tibia para verificar se ele está na
        guilda "New Coorporative"
      </p>

      <form onSubmit={handleStep2Submit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="characterName" className={styles.label}>
            Nome do Personagem
          </label>
          <input
            type="text"
            id="characterName"
            name="characterName"
            value={formData.characterName}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Digite o nome do seu personagem"
            required
          />
        </div>

        <button type="submit" className={styles.button} disabled={localLoading}>
          {localLoading ? "Verificando..." : "Verificar Personagem"}
        </button>
      </form>

      <button onClick={() => setCurrentStep(1)} className={styles.backButton}>
        Voltar
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Step 3: Validação de Token</h2>
      <p className={styles.stepDescription}>
        Escolha uma opção para validar seu token no comentário do personagem:
      </p>

      <div className={styles.tokenOptions}>
        <div className={styles.tokenOption}>
          <h3 className={styles.optionTitle}>Opção 1: Gerar Novo Token</h3>
          <p className={styles.optionDescription}>
            Gere um novo token e cole no comentário do seu personagem
          </p>
          {generatedToken && (
            <div className={styles.tokenContainer}>
              <label className={styles.label}>Token Gerado:</label>
              <div className={styles.tokenBox}>
                <span className={styles.token}>{generatedToken}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedToken)}
                  className={styles.copyButton}
                >
                  Copiar
                </button>
              </div>
            </div>
          )}
          <button onClick={handleGenerateToken} className={styles.optionButton}>
            {generatedToken ? "Gerar Novo Token" : "Gerar Token"}
          </button>
        </div>

        <div className={styles.tokenOption}>
          <h3 className={styles.optionTitle}>Opção 2: Usar Token Existente</h3>
          <p className={styles.optionDescription}>
            Se você já tem um token no comentário do seu personagem
          </p>

          {characterComment && (
            <div className={styles.commentInfo}>
              <label className={styles.label}>
                Comentário atual do personagem:
              </label>
              <div className={styles.commentBox}>
                <span className={styles.comment}>{characterComment}</span>
                <button
                  onClick={() => {
                    // Tentar extrair token do comentário (formato GUILD-XXXXXX)
                    const tokenMatch =
                      characterComment.match(/GUILD-[A-Z0-9]+/i);
                    if (tokenMatch) {
                      setManualToken(tokenMatch[0]);
                    }
                  }}
                  className={styles.extractButton}
                >
                  Extrair Token
                </button>
              </div>
            </div>
          )}

          {formData.rank && (
            <div className={styles.rankInfo}>
              <label className={styles.label}>Rank na guilda:</label>
              <div className={styles.rankBox}>
                <span className={styles.rank}>{formData.rank}</span>
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="manualToken" className={styles.label}>
              Token Existente
            </label>
            <input
              type="text"
              id="manualToken"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              className={styles.input}
              placeholder="Cole aqui o token do seu comentário"
            />
          </div>
          <button
            onClick={handleUseManualToken}
            className={styles.optionButton}
            disabled={!manualToken.trim()}
          >
            Usar Este Token
          </button>
        </div>
      </div>

      <form onSubmit={handleStep3Submit} className={styles.form}>
        <button
          type="submit"
          className={styles.button}
          disabled={localLoading || (!generatedToken && !manualToken)}
        >
          {localLoading ? "Validando..." : "Validar Token"}
        </button>
      </form>

      <button onClick={() => setCurrentStep(2)} className={styles.backButton}>
        Voltar
      </button>
    </div>
  );

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <h1 className={styles.title}>Sistema de Gestão de Guilda</h1>
        <p className={styles.subtitle}>Registro - New Coorporative</p>

        <div className={styles.stepIndicator}>
          <div
            className={`${styles.step} ${
              currentStep >= 1 ? styles.active : ""
            }`}
          >
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>Dados</span>
          </div>
          <div
            className={`${styles.step} ${
              currentStep >= 2 ? styles.active : ""
            }`}
          >
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>Personagem</span>
          </div>
          <div
            className={`${styles.step} ${
              currentStep >= 3 ? styles.active : ""
            }`}
          >
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepLabel}>Token</span>
          </div>
        </div>

        {(contextError || localError) && (
          <div className={styles.errorMessage}>
            {contextError || localError}
          </div>
        )}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default Register;
