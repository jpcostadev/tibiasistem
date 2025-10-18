import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import useMedia from "../../hooks/useMedia";
import {
  UserIcon,
  ShieldIcon,
  TrashIcon,
  EditIcon,
  PlusIcon,
  SaveIcon,
  XIcon,
  EyeIcon,
} from "../../assets/icons";
import { UserAdminModal } from "../../components/ui";
import styles from "./Admin.module.css";

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

interface Cargo {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
}

const Admin: React.FC = () => {
  const { data } = useUser();
  const isMobile = useMedia("(max-width: 768px)");
  const [activeTab, setActiveTab] = useState<"users" | "cargos">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCargoModal, setShowCargoModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  // Verificar se o usuário é admin
  const isAdmin =
    data &&
    typeof data === "object" &&
    (("cargo" in data &&
      (data as { cargo: string }).cargo === "administrador") ||
      ("role" in data && (data as { role: string }).role === "administrator"));

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadCargos();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simular carregamento de usuários
      const mockUsers: User[] = [
        {
          id: "1",
          username: "fallz",
          character_name: "Old Furios",
          email: "fallz@gmail.com",
          role: "admin",
          cargo: "Líder",
          created_at: "2024-01-15",
          last_login: "2024-01-20",
          status: "active",
        },
        {
          id: "2",
          username: "testuser",
          character_name: "Test Character",
          email: "test@email.com",
          role: "user",
          cargo: "Membro",
          created_at: "2024-01-18",
          last_login: "2024-01-19",
          status: "active",
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCargos = async () => {
    setLoading(true);
    try {
      // Simular carregamento de cargos
      const mockCargos: Cargo[] = [
        {
          id: "1",
          name: "Líder",
          description: "Líder da guilda com acesso total",
          permissions: ["manage_users", "manage_cargos", "manage_guild"],
          created_at: "2024-01-01",
        },
        {
          id: "2",
          name: "Vice-Líder",
          description: "Vice-líder com permissões administrativas",
          permissions: ["manage_users", "manage_guild"],
          created_at: "2024-01-01",
        },
        {
          id: "3",
          name: "Membro",
          description: "Membro comum da guilda",
          permissions: ["view_guild"],
          created_at: "2024-01-01",
        },
      ];
      setCargos(mockCargos);
    } catch (error) {
      console.error("Erro ao carregar cargos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        // Simular exclusão
        setUsers(users.filter((user) => user.id !== userId));
        console.log("Usuário deletado:", userId);
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
  };

  const handleDeleteCargo = async (cargoId: string) => {
    if (window.confirm("Tem certeza que deseja deletar este cargo?")) {
      try {
        // Simular exclusão
        setCargos(cargos.filter((cargo) => cargo.id !== cargoId));
        console.log("Cargo deletado:", cargoId);
      } catch (error) {
        console.error("Erro ao deletar cargo:", error);
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleEditCargo = (cargo: Cargo) => {
    setEditingCargo(cargo);
    setShowCargoModal(true);
  };

  const handleCreateCargo = () => {
    setEditingCargo(null);
    setShowCargoModal(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Filtrar usuários baseado na busca
  const filteredUsers = users.filter((user) => {
    const searchTerm = searchFilter.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchTerm) ||
      user.character_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  });

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <ShieldIcon size={64} />
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <ShieldIcon size={32} />
          Painel de Administração
        </h1>
        <p className={styles.subtitle}>Gerencie usuários e cargos da guilda</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "users" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("users")}
        >
          <UserIcon size={20} />
          Usuários ({users.length})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "cargos" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("cargos")}
        >
          <ShieldIcon size={20} />
          Cargos ({cargos.length})
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "users" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Gerenciar Usuários</h2>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Buscar por nome, personagem ou email..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.usersTableContainer}>
              <div className={styles.usersTableHeader}>
                <div className={styles.tableHeaderItem}>Usuário</div>
                <div className={styles.tableHeaderItem}>Personagem</div>
                <div className={styles.tableHeaderItem}>Email</div>
                <div className={styles.tableHeaderItem}>Cargo</div>
                <div className={styles.tableHeaderItem}>Status</div>
                <div className={styles.tableHeaderItem}>Ações</div>
              </div>

              <div className={styles.usersTableBody}>
                {filteredUsers.map((user) => (
                  <div key={user.id} className={styles.userRow}>
                    {isMobile ? (
                      // Layout Mobile - Lista simplificada
                      <>
                        <div className={styles.userInfo}>
                          <div className={styles.userDetails}>
                            <span className={styles.username}>
                              {user.username}
                            </span>
                            <span className={styles.characterName}>
                              {user.character_name}
                            </span>
                          </div>
                          <span className={styles.cargoBadge}>
                            {user.cargo || user.role}
                          </span>
                        </div>
                        <div className={styles.userActions}>
                          <button
                            className={styles.viewButton}
                            onClick={() => handleViewUser(user)}
                            title="Ver Detalhes"
                          >
                            <EyeIcon size={16} />
                          </button>
                          <button
                            className={styles.editButton}
                            onClick={() => handleEditUser(user)}
                            title="Editar"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteUser(user.id)}
                            title="Excluir"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      // Layout Desktop - Tabela completa
                      <>
                        <div className={styles.userCell} data-label="Usuário">
                          <div className={styles.userInfo}>
                            <UserIcon size={20} />
                            <span className={styles.username}>
                              {user.username}
                            </span>
                          </div>
                        </div>
                        <div
                          className={styles.userCell}
                          data-label="Personagem"
                        >
                          <span className={styles.characterName}>
                            {user.character_name}
                          </span>
                        </div>
                        <div className={styles.userCell} data-label="Email">
                          <span className={styles.userEmail}>{user.email}</span>
                        </div>
                        <div className={styles.userCell} data-label="Cargo">
                          <span className={styles.cargoBadge}>
                            {user.cargo || user.role}
                          </span>
                        </div>
                        <div className={styles.userCell} data-label="Status">
                          <span
                            className={`${styles.statusBadge} ${
                              styles[user.status]
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                        <div className={styles.userCell} data-label="Ações">
                          <div className={styles.userActions}>
                            <button
                              className={styles.viewButton}
                              onClick={() => handleViewUser(user)}
                              title="Ver Detalhes"
                            >
                              <EyeIcon size={16} />
                            </button>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEditUser(user)}
                              title="Editar"
                            >
                              <EditIcon size={16} />
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeleteUser(user.id)}
                              title="Excluir"
                            >
                              <TrashIcon size={16} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "cargos" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Gerenciar Cargos</h2>
              <button className={styles.addButton} onClick={handleCreateCargo}>
                <PlusIcon size={20} />
                Criar Cargo
              </button>
            </div>

            <div className={styles.cargosList}>
              {cargos.map((cargo) => (
                <div key={cargo.id} className={styles.cargoCard}>
                  {isMobile ? (
                    // Layout Mobile - Lista simplificada
                    <>
                      <div className={styles.cargoCardHeader}>
                        <div className={styles.cargoInfo}>
                          <ShieldIcon size={20} />
                          <div className={styles.cargoDetails}>
                            <h3 className={styles.cargoName}>{cargo.name}</h3>
                          </div>
                        </div>
                      </div>
                      <div className={styles.cargoCardActions}>
                        <button
                          className={styles.viewButton}
                          onClick={() => {
                            // TODO: Implementar modal de detalhes do cargo
                            console.log("Ver detalhes do cargo:", cargo);
                          }}
                          title="Ver Detalhes"
                        >
                          <EyeIcon size={16} />
                        </button>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditCargo(cargo)}
                          title="Editar"
                        >
                          <EditIcon size={16} />
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteCargo(cargo.id)}
                          title="Excluir"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    // Layout Desktop - Card completo
                    <>
                      <div className={styles.cargoCardHeader}>
                        <div className={styles.cargoInfo}>
                          <ShieldIcon size={24} />
                          <div className={styles.cargoDetails}>
                            <h3 className={styles.cargoName}>{cargo.name}</h3>
                            <p className={styles.cargoDescription}>
                              {cargo.description}
                            </p>
                          </div>
                        </div>
                        <div className={styles.cargoStatus}>
                          <span className={styles.cargoBadge}>
                            {cargo.permissions.length} permissões
                          </span>
                        </div>
                      </div>

                      <div className={styles.cargoCardBody}>
                        <div className={styles.permissions}>
                          <h4 className={styles.permissionsTitle}>
                            Permissões:
                          </h4>
                          <div className={styles.permissionTags}>
                            {cargo.permissions.map((permission, index) => (
                              <span
                                key={index}
                                className={styles.permissionTag}
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className={styles.cargoCardActions}>
                        <button
                          className={styles.viewButton}
                          onClick={() => {
                            // TODO: Implementar modal de detalhes do cargo
                            console.log("Ver detalhes do cargo:", cargo);
                          }}
                        >
                          <EyeIcon size={16} />
                          Ver Detalhes
                        </button>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditCargo(cargo)}
                        >
                          <EditIcon size={16} />
                          Editar
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteCargo(cargo.id)}
                        >
                          <TrashIcon size={16} />
                          Excluir
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de Detalhes do Usuário */}
        <UserAdminModal
          isVisible={showUserModal}
          user={selectedUser}
          onClose={() => setShowUserModal(false)}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>
    </div>
  );
};

export default Admin;
