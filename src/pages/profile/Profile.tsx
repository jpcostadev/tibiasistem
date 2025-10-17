import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import {
  UserIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  TrophyIcon,
  MailIcon,
  RankingIcon,
} from "../../assets/icons";
import styles from "./Profile.module.css";
import Loading from "../../components/ui/Loading";

interface UserData {
  character_name?: string;
  username?: string;
  user_email?: string;
  email?: string;
  xps?: string;
  cargo?: string;
  rank?: string;
}

const Profile: React.FC = () => {
  const { data } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    character_name: "",
    user_email: "",
    username: "",
    xps: "",
  });

  const handleEdit = () => {
    const userData = data && typeof data === "object" ? (data as UserData) : {};
    setEditData({
      character_name: userData.character_name || "",
      user_email: userData.user_email || userData.email || "",
      username: userData.username || "",
      xps: userData.xps || "0",
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    setIsEditing(false);
  };

  const handleCancel = () => {
    const userData = data && typeof data === "object" ? (data as UserData) : {};
    setEditData({
      character_name: userData.character_name || "",
      user_email: userData.user_email || userData.email || "",
      username: userData.username || "",
      xps: userData.xps || "0",
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const userData: UserData =
    data && typeof data === "object" ? (data as UserData) : {};

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        {/* Header do Perfil */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <UserIcon size={48} />
            </div>
            <div className={styles.avatarInfo}>
              <h1 className={styles.userName}>
                {userData.character_name || userData.username || "Usuário"}
              </h1>
              <div className={styles.userTitle}>
                <RankingIcon size={16} />
                <span className={styles.rankText}>
                  {userData.rank || "Membro da Guilda"}
                </span>
              </div>
              <div className={styles.userStatus}>
                <div className={styles.statusDot}></div>
                <span>Online</span>
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            {!isEditing ? (
              <button className={styles.editButton} onClick={handleEdit}>
                <EditIcon size={20} />
                <span>Editar Perfil</span>
              </button>
            ) : (
              <div className={styles.editActions}>
                <button className={styles.saveButton} onClick={handleSave}>
                  <SaveIcon size={20} />
                  <span>Salvar</span>
                </button>
                <button className={styles.cancelButton} onClick={handleCancel}>
                  <XIcon size={20} />
                  <span>Cancelar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo do Perfil */}
        <div className={styles.profileContent}>
          <div className={styles.profileGrid}>
            {/* Informações Básicas */}
            <div className={styles.profileSection}>
              <h2 className={styles.sectionTitle}>Informações Básicas</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Nome do Personagem</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={styles.editInput}
                      value={editData.character_name}
                      onChange={(e) =>
                        handleInputChange("character_name", e.target.value)
                      }
                    />
                  ) : (
                    <div className={styles.infoValue}>
                      <UserIcon size={16} />
                      <span>{userData.character_name || "N/A"}</span>
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      className={styles.editInput}
                      value={editData.user_email}
                      onChange={(e) =>
                        handleInputChange("user_email", e.target.value)
                      }
                    />
                  ) : (
                    <div className={styles.infoValue}>
                      <MailIcon size={16} />
                      <span>
                        {userData.user_email || userData.email || "N/A"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className={styles.profileSection}>
              <h2 className={styles.sectionTitle}>Estatísticas</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <TrophyIcon size={24} />
                  </div>
                  <div className={styles.statContent}>
                    {isEditing ? (
                      <input
                        type="text"
                        className={styles.editInput}
                        value={editData.xps}
                        onChange={(e) =>
                          handleInputChange("xps", e.target.value)
                        }
                        placeholder="XP Total"
                      />
                    ) : (
                      <div className={styles.statValue}>
                        {userData.xps || "0"}
                      </div>
                    )}
                    <div className={styles.statLabel}>XP Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações da Conta */}
            <div className={styles.profileSection}>
              <h2 className={styles.sectionTitle}>Informações da Conta</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={styles.editInput}
                      value={editData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      placeholder="Username"
                    />
                  ) : (
                    <div className={styles.infoValue}>
                      <span>{userData.username || "N/A"}</span>
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Cargo na Guilda</label>
                  <div className={styles.infoValue}>
                    <span className={styles.badge}>
                      {userData.cargo || "Membro"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
