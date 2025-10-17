import React from "react";
import style from "./Header.module.css";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { useUser } from "../../contexts/UserContext";
import {
  UserIcon,
  LoginIcon,
  RegisterIcon,
  LogoutIcon,
  BossesIcon,
  RankingIcon,
} from "../../assets/icons";

const Header = () => {
  const { login, data, userLogout } = useUser();

  return (
    <header className={style.header}>
      <nav className={`${style.menu} container`}>
        <div className={style.logoContainer}>
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
            <div className={style.userGreeting}>
              <div className={style.userInfo}>
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
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={userLogout}
                icon={<LogoutIcon size={16} />}
              >
                Sair
              </Button>
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
