import React from "react";
import style from "./HeaderMobile.module.css";
import { Link } from "react-router-dom";

const HeaderMobile = () => {
  const [openMenu, setOpenMenu] = React.useState<boolean>(false);

  return (
    <header className={style.headerMobile}>
      <nav className={style.menuMobile}>
        <h1>Logo</h1>
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className={style.btnMenu}
        >
          Menu
        </button>

        {openMenu && (
          <ul className={style.mobileLinks}>
            <Link onClick={() => setOpenMenu(false)} to={"/"}>
              Bosses
            </Link>
            <Link onClick={() => setOpenMenu(false)} to={"/ranking"}>
              Ranking
            </Link>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default HeaderMobile;
