import React from "react";
import styles from "./ProgressBar.module.css";

interface ProgressStep {
  id: string;
  text: string;
  completed: boolean;
  active: boolean;
}

interface ProgressBarProps {
  steps: ProgressStep[];
  currentStep: number;
  totalSteps: number;
  isVisible: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStep,
  totalSteps,
  isVisible,
}) => {
  if (!isVisible) return null;

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <h3 className={styles.progressTitle}>🔐 Verificação de Acesso</h3>
        <p className={styles.progressSubtitle}>
          Validando credenciais e sincronizando dados com o Tibia...
        </p>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`${styles.step} ${
              step.completed ? styles.stepCompleted : ""
            } ${step.active ? styles.stepActive : ""}`}
          >
            <div className={styles.stepIcon}>
              {step.completed ? (
                <div className={styles.checkIcon}>✓</div>
              ) : step.active ? (
                <div className={styles.loadingIcon}>⟳</div>
              ) : (
                <div className={styles.pendingIcon}>○</div>
              )}
            </div>
            <span className={styles.stepText}>{step.text}</span>
          </div>
        ))}
      </div>

      <div className={styles.progressInfo}>
        <span className={styles.progressText}>
          Etapa {currentStep} de {totalSteps}
        </span>
        <span className={styles.progressPercentage}>
          {Math.round(progressPercentage)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
