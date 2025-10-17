import React from "react";
import style from "./HeaderMobile.module.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import { useUser } from "../../../contexts/UserContext";
import {
  UserIcon,
  LoginIcon,
  RegisterIcon,
  LogoutIcon,
  BossesIcon,
  RankingIcon,
  MenuIcon,
  SettingsIcon,
  ChevronDownIcon,
  ProfileIcon,
  UsersIcon,
} from "../../../assets/icons";
import { useGuildMembers } from "../../../hooks/useGuildMembers";

const HeaderMobile = () => {
  const [openMenu, setOpenMenu] = React.useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] =
    React.useState<boolean>(false);
  const { login, data, userLogout } = useUser();
  const { guildData } = useGuildMembers();
  const navigate = useNavigate();
  const userDropdownRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  // Fechar dropdown e menu quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Fechar dropdown do usuário
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }

      // Fechar menu mobile
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <header className={style.headerMobile}>
      <nav className={style.menuMobile}>
        <div
          className={style.logoContainer}
          onClick={() => navigate("/dashboard")}
        >
          <div className={style.logoIcon}>
            <BossesIcon size={28} />
          </div>
          <h1 className={style.logoText}>Guild</h1>
        </div>

        {/* Contador de Membros Online Mobile */}
        {guildData && (
          <div className={style.mobileOnlineMembers}>
            <UsersIcon size={16} />
            <span className={style.mobileOnlineCount}>
              {guildData.players_online}
            </span>
          </div>
        )}

        <div ref={mobileMenuRef}>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className={style.btnMenu}
          >
            <MenuIcon size={24} />
          </button>

          {openMenu && (
            <div className={style.mobileMenu}>
              <div className={style.mobileLinks}>
                <Link
                  onClick={() => setOpenMenu(false)}
                  to={"/"}
                  className={style.mobileLink}
                >
                  <BossesIcon size={20} />
                  <span>Bosses</span>
                </Link>
                <Link
                  onClick={() => setOpenMenu(false)}
                  to={"/ranking"}
                  className={style.mobileLink}
                >
                  <RankingIcon size={20} />
                  <span>Ranking</span>
                </Link>

                {login && data ? (
                  <div
                    ref={userDropdownRef}
                    className={style.mobileUserSection}
                  >
                    <div
                      className={style.mobileUserInfo}
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    >
                      <UserIcon size={24} />
                      <div className={style.mobileUserDetails}>
                        <h3 className={style.mobileUserName}>
                          Olá,{" "}
                          <span className={style.mobileCharacterName}>
                            {data &&
                            typeof data === "object" &&
                            "character_name" in data
                              ? (data as { character_name: string })
                                  .character_name
                              : data &&
                                typeof data === "object" &&
                                "username" in data
                              ? (data as { username: string }).username
                              : "Usuário"}
                          </span>
                        </h3>
                        <p className={style.mobileUserStatus}>Online</p>
                      </div>
                      <ChevronDownIcon
                        size={20}
                        className={`${style.mobileChevron} ${
                          isUserDropdownOpen ? style.mobileChevronOpen : ""
                        }`}
                      />
                    </div>

                    {isUserDropdownOpen && (
                      <div className={style.mobileUserDropdown}>
                        <button
                          className={style.mobileDropdownItem}
                          onClick={() => {
                            navigate("/profile");
                            setIsUserDropdownOpen(false);
                            setOpenMenu(false);
                          }}
                        >
                          <ProfileIcon size={18} />
                          <span>Meu Perfil</span>
                        </button>
                        <button
                          className={style.mobileDropdownItem}
                          onClick={() => {
                            navigate("/settings");
                            setIsUserDropdownOpen(false);
                            setOpenMenu(false);
                          }}
                        >
                          <SettingsIcon size={18} />
                          <span>Configurações</span>
                        </button>
                        <button
                          className={style.mobileDropdownItem}
                          onClick={() => {
                            userLogout();
                            setIsUserDropdownOpen(false);
                            setOpenMenu(false);
                          }}
                        >
                          <LogoutIcon size={18} />
                          <span>Sair</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={style.mobileAuthSection}>
                    <h3 className={style.authTitle}>Acesso</h3>
                    <div className={style.mobileAuthButtons}>
                      <Button
                        variant="outline"
                        size="small"
                        fullWidth
                        onClick={() => {
                          setOpenMenu(false);
                          window.location.href = "/login";
                        }}
                        icon={<LoginIcon size={16} />}
                      >
                        Login
                      </Button>
                      <Button
                        variant="primary"
                        size="small"
                        fullWidth
                        onClick={() => {
                          setOpenMenu(false);
                          window.location.href = "/register";
                        }}
                        icon={<RegisterIcon size={16} />}
                      >
                        Registrar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default HeaderMobile;
