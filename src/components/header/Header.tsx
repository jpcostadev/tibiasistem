import React from "react";
import style from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className={style.header}>
      <nav className={style.menu}>
        <h1>Logo</h1>
        <ul className={style.links}>
          <Link to={"/"}>Bosses</Link>
          <Link to={"/ranking"}>Ranking</Link>
          {/* <button className="btnSair">Sair</button> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
