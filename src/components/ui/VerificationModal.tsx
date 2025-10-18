import React, { useState, useEffect, useRef } from "react";
import styles from "./VerificationModal.module.css";
import { TIBIA_GET_CHARACTER } from "../../apis/tibia";
import intelligentCache from "../../utils/IntelligentCache";
import useDisableScroll from "../../hooks/useDisableScroll";

interface VerificationStep {
  id: string;
  text: string;
  status: "pending" | "loading" | "success" | "error";
  message?: string;
}

interface VerificationModalProps {
  isVisible: boolean;
  characterName: string;
  onSuccess?: () => void;
  onError?: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isVisible,
  characterName,
  onSuccess,
  onError,
}) => {
  // Desabilita scroll quando modal estiver aberto
  useDisableScroll(isVisible);

  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      id: "character",
      text: "🔍 Verificando personagem no Tibia...",
      status: "pending",
    },
    {
      id: "guild",
      text: "🛡️ Verificando se está na guilda New Coorporative...",
      status: "pending",
    },
    {
      id: "complete",
      text: "✅ Verificação concluída!",
      status: "pending",
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  const updateStep = (
    stepIndex: number,
    status: "pending" | "loading" | "success" | "error",
    message?: string,
  ) => {
    setSteps((prev) =>
      prev.map((step, index) =>
        index === stepIndex ? { ...step, status, message } : step,
      ),
    );
    setCurrentStep(stepIndex + 1);
  };

  // EXECUTAR VERIFICAÇÃO UMA ÚNICA VEZ
  useEffect(() => {
    if (!isVisible || !characterName || hasExecuted) return;

    const executeVerification = async () => {
      // Verificar cache primeiro
      const cachedVerification = intelligentCache.getItem(
        "verification",
        characterName,
      );

      if (cachedVerification) {
        console.log(
          "✅ Verificação já foi feita nas últimas 3 horas, pulando modal",
        );
        if (onSuccessRef.current) onSuccessRef.current();
        setHasExecuted(true);
        return;
      }

      console.log("🔄 Verificação necessária, mostrando modal");
      setShouldShowModal(true);
      setIsExecuting(true);

      try {
        // Etapa 1: Verificar personagem
        updateStep(0, "loading");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const { url } = TIBIA_GET_CHARACTER(characterName);
        const response = await fetch(url);
        const data = await response.json();

        console.log("🔍 Dados da API do Tibia:", data);
        console.log("📊 Status da resposta:", response.status);
        console.log("✅ Response OK:", response.ok);

        if (!response.ok || !data.character) {
          updateStep(0, "error", "Personagem não encontrado no Tibia");
          throw new Error("Personagem não encontrado no Tibia");
        }

        console.log("👤 Dados do personagem:", data.character.character);
        console.log("🏰 Dados da guilda:", data.character.character.guild);

        updateStep(
          0,
          "success",
          `Personagem ${data.character.character.name} encontrado!`,
        );

        // Etapa 2: Verificar guilda
        updateStep(1, "loading");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const guildName = data.character.character.guild?.name;
        console.log("🔍 Nome da guilda encontrada:", guildName);
        console.log(
          "🎯 Comparando com 'New Coorporative':",
          guildName === "New Coorporative",
        );
        if (guildName !== "New Coorporative") {
          updateStep(
            1,
            "error",
            `Personagem está na guilda: ${guildName || "Nenhuma"}`,
          );
          throw new Error(
            "❌ Seu personagem não está na guilda New Coorporative. Entre em contato com um líder para resolver esta situação.",
          );
        }

        updateStep(1, "success", `Membro da guilda ${guildName}!`);

        // Etapa 3: Concluir
        updateStep(2, "success");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Sucesso - salvar no cache e chamar callback
        intelligentCache.setItem("verification", characterName, {
          verified: true,
          timestamp: Date.now(),
        });

        console.log("💾 Verificação salva no cache por 3 horas");
        if (onSuccessRef.current) onSuccessRef.current();
      } catch (error) {
        // Erro - chamar callback
        if (onErrorRef.current) onErrorRef.current();
      } finally {
        setIsExecuting(false);
        setHasExecuted(true);
      }
    };

    executeVerification();
  }, [isVisible, characterName, hasExecuted]);

  if (!isVisible || !shouldShowModal) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>🔐 Verificação de Acesso</h2>
          <p className={styles.subtitle}>
            Verificando personagem: <strong>{characterName}</strong>
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.stepsContainer}>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`${styles.step} ${
                  step.status === "success"
                    ? styles.stepSuccess
                    : step.status === "error"
                    ? styles.stepError
                    : step.status === "loading"
                    ? styles.stepLoading
                    : styles.stepPending
                }`}
              >
                <div className={styles.stepIcon}>
                  {step.status === "success" && "✅"}
                  {step.status === "error" && "❌"}
                  {step.status === "loading" && "⏳"}
                  {step.status === "pending" && "⏸️"}
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepText}>{step.text}</div>
                  {step.message && (
                    <div className={styles.stepMessage}>{step.message}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${(currentStep / steps.length) * 100}%`,
              }}
            />
          </div>

          <div className={styles.footer}>
            <div className={styles.progressText}>
              Etapa {currentStep} de {steps.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
