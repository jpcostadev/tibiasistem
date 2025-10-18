import React from "react";
import { UserIcon, EditIcon, TrashIcon, XIcon } from "../../assets/icons";
import useDisableScroll from "../../hooks/useDisableScroll";
import styles from "./UserAdminModal.module.css";

interface User {
  id: string;
  username: string;
  character_name: string;
  email: string;
  role: string;
  cargo: string;
  created_at: string;
  last_login: string;
  status: "active" | "banned" | "inactive";
}

interface UserAdminModalProps {
  isVisible: boolean;
  user: User | null;
  onClose: () => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserAdminModal: React.FC<UserAdminModalProps> = ({
  isVisible,
  user,
  onClose,
  onEdit,
  onDelete,
}) => {
  // Desabilita scroll quando modal estiver aberto
  useDisableScroll(isVisible);

  if (!isVisible || !user) return null;

  const handleEdit = () => {
    onEdit(user);
    onClose();
  };

  const handleDelete = () => {
    onDelete(user.id);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.userModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Detalhes do Usuário</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <XIcon size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.userModalInfo}>
            <div className={styles.userModalAvatar}>
              <UserIcon size={48} />
            </div>
            <div className={styles.userModalDetails}>
              <h3 className={styles.userModalName}>{user.username}</h3>
              <p className={styles.userModalCharacter}>{user.character_name}</p>
              <span className={`${styles.statusBadge} ${styles[user.status]}`}>
                {user.status}
              </span>
            </div>
          </div>

          <div className={styles.userModalInfoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Cargo:</span>
              <span className={styles.cargoBadge}>
                {user.cargo || user.role}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Último Login:</span>
              <span className={styles.infoValue}>
                {new Date(user.last_login).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Data de Criação:</span>
              <span className={styles.infoValue}>
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.editButton} onClick={handleEdit}>
            <EditIcon size={16} />
            Editar Usuário
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            <TrashIcon size={16} />
            Excluir Usuário
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAdminModal;
