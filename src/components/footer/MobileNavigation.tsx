import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import {
  BossesIcon,
  TrophyIcon,
  RankingIcon,
  SettingsIcon,
  HomeIcon,
  SwordIcon,
  SkullIcon,
} from "../../assets/icons";
import style from "./MobileNavigation.module.css";

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, data } = useUser();

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: HomeIcon,
      path: "/dashboard",
    },
    {
      id: "hunts",
      label: "Hunts",
      icon: SwordIcon,
      path: "/hunts",
    },
    {
      id: "bosses",
      label: "Bosses",
      icon: SkullIcon,
      path: "/",
    },
    {
      id: "ranking",
      label: "Ranking",
      icon: TrophyIcon,
      path: "/ranking",
    },
    {
      id: "config",
      label: "Config",
      icon: SettingsIcon,
      path: "/settings",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Só renderiza se o usuário estiver logado
  if (login !== true || data === null) {
    return null;
  }

  return (
    <div className={style.mobileNavigation}>
      <div className={style.tabContainer}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`${style.tab} ${
                isActive(tab.path) ? style.tabActive : ""
              }`}
              onClick={() => navigate(tab.path)}
            >
              <div className={style.tabIcon}>
                <IconComponent size={20} />
              </div>
              <span className={style.tabLabel}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
