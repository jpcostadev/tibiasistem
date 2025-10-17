import React from "react";
import style from "./HeaderMobile.module.css";
import { Link } from "react-router-dom";
import Button from "../../ui/Button";
import { useUser } from "../../../contexts/UserContext";
import { 
  UserIcon, 
  LoginIcon, 
  RegisterIcon, 
  LogoutIcon, 
  BossesIcon, 
  RankingIcon,
  MenuIcon 
} from "../../../assets/icons";

const HeaderMobile = () => {
  const [openMenu, setOpenMenu] = React.useState<boolean>(false);
  const { login, data, userLogout } = useUser();

  return (
    <header className={style.headerMobile}>
      <nav className={style.menuMobile}>
        <div className={style.logoContainer}>
          <div className={style.logoIcon}>
            <BossesIcon size={28} />
          </div>
          <h1 className={style.logoText}>Guild</h1>
        </div>

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
                <div className={style.mobileUserSection}>
                  <div className={style.mobileUserInfo}>
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
                  </div>
                  <Button
                    variant="outline"
                    size="small"
                    fullWidth
                    onClick={() => {
                      setOpenMenu(false);
                      userLogout();
                    }}
                    icon={<LogoutIcon size={16} />}
                  >
                    Sair
                  </Button>
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
      </nav>
    </header>
  );
};

export default HeaderMobile;
