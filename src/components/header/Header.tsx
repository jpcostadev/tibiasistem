import React from "react";
import style from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useUser } from "../../contexts/UserContext";
import {
  UserIcon,
  LoginIcon,
  RegisterIcon,
  LogoutIcon,
  BossesIcon,
  RankingIcon,
  SettingsIcon,
  ChevronDownIcon,
  ProfileIcon,
} from "../../assets/icons";

const Header = () => {
  const { login, data, userLogout } = useUser();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
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
    <header className={style.header}>
      <nav className={`${style.menu} container`}>
        <div
          className={style.logoContainer}
          onClick={() => navigate("/dashboard")}
        >
          <div className={style.logoIcon}>
            <BossesIcon size={32} />
          </div>
          <h1 className={style.logoText}>Guild System</h1>
        </div>

        <ul className={style.links}>
          <Link to={"/"} className={style.navLink}>
            <BossesIcon size={20} />
            <span>Bosses</span>
          </Link>
          <Link to={"/ranking"} className={style.navLink}>
            <RankingIcon size={20} />
            <span>Ranking</span>
          </Link>
        </ul>

        <div className={style.authButtons}>
          {login && data ? (
            <div className={style.userGreeting} ref={dropdownRef}>
              <div
                className={style.userInfo}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <UserIcon size={20} />
                <span className={style.greetingText}>
                  Olá,{" "}
                  <span className={style.characterName}>
                    {data &&
                    typeof data === "object" &&
                    "character_name" in data
                      ? (data as { character_name: string }).character_name
                      : data && typeof data === "object" && "username" in data
                      ? (data as { username: string }).username
                      : "Usuário"}
                  </span>
                </span>
                <ChevronDownIcon
                  size={16}
                  className={`${style.chevron} ${
                    isDropdownOpen ? style.chevronOpen : ""
                  }`}
                />
              </div>

              {isDropdownOpen && (
                <div className={style.userDropdown}>
                  <button
                    className={style.dropdownItem}
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <ProfileIcon size={16} />
                    <span>Meu Perfil</span>
                  </button>
                  <button
                    className={style.dropdownItem}
                    onClick={() => {
                      navigate("/settings");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <SettingsIcon size={16} />
                    <span>Configurações</span>
                  </button>
                  <button
                    className={style.dropdownItem}
                    onClick={() => {
                      userLogout();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogoutIcon size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                size="small"
                onClick={() => (window.location.href = "/login")}
                icon={<LoginIcon size={16} />}
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => (window.location.href = "/register")}
                icon={<RegisterIcon size={16} />}
              >
                Registrar
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
