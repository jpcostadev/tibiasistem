import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { SettingsIcon, BellIcon, ShieldIcon } from "../../assets/icons";
import styles from "./Settings.module.css";

const Settings: React.FC = () => {
  const { data } = useUser();
  const [activeTab, setActiveTab] = useState("notifications");

  const tabs = [
    { id: "notifications", label: "Notificações", icon: BellIcon },
    { id: "privacy", label: "Privacidade", icon: ShieldIcon },
  ];

  const renderNotificationSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Configurações de Notificação</h3>
      <div className={styles.settingsGrid}>
        <div className={styles.settingItem}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <label className={styles.settingLabel}>
                Notificações de Boss
              </label>
              <p className={styles.settingDescription}>
                Receber notificações quando novos bosses aparecerem
              </p>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" defaultChecked />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <label className={styles.settingLabel}>
                Notificações de Ranking
              </label>
              <p className={styles.settingDescription}>
                Receber notificações sobre mudanças no ranking
              </p>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <label className={styles.settingLabel}>
                Notificações de Sistema
              </label>
              <p className={styles.settingDescription}>
                Receber notificações importantes do sistema
              </p>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" defaultChecked />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Configurações de Privacidade</h3>
      <div className={styles.settingsGrid}>
        <div className={styles.settingItem}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <label className={styles.settingLabel}>Perfil Público</label>
              <p className={styles.settingDescription}>
                Permitir que outros usuários vejam seu perfil
              </p>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" defaultChecked />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <label className={styles.settingLabel}>
                Mostrar Status Online
              </label>
              <p className={styles.settingDescription}>
                Mostrar quando você está online para outros usuários
              </p>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" defaultChecked />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <label className={styles.settingLabel}>
                Histórico de Atividades
              </label>
              <p className={styles.settingDescription}>
                Manter histórico das suas atividades na guilda
              </p>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" defaultChecked />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "notifications":
        return renderNotificationSettings();
      case "privacy":
        return renderPrivacySettings();
      default:
        return renderNotificationSettings();
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsCard}>
        <div className={styles.settingsHeader}>
          <div className={styles.headerIcon}>
            <SettingsIcon size={32} />
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Configurações</h1>
            <p className={styles.subtitle}>
              Gerencie suas preferências e configurações
            </p>
          </div>
        </div>

        <div className={styles.settingsContent}>
          <div className={styles.sidebar}>
            <nav className={styles.tabs}>
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`${styles.tab} ${
                      activeTab === tab.id ? styles.tabActive : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <IconComponent size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className={styles.mainContent}>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
