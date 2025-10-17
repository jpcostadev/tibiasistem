import React from "react";
import style from "./Hunts.module.css";

const Hunts = () => {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1 className={style.title}>Hunts</h1>
        <p className={style.subtitle}>Sistema de caçadas da guilda</p>
      </div>

      <div className={style.content}>
        <div className={style.placeholder}>
          <h2>Em Desenvolvimento</h2>
          <p>Esta funcionalidade está sendo desenvolvida.</p>
        </div>
      </div>
    </div>
  );
};

export default Hunts;
