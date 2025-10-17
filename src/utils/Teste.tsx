import React from "react";
import jsonURL from "../../public/dados.json";

type TesteProps = {
  nome: string;
  idade: number;
};

const Teste = () => {
  const [json, setJson] = React.useState<TesteProps[] | null>(null);

  React.useEffect(() => {
    async function puxarSapoha() {
      const respose = await fetch("/dados.json");
      const json = await respose.json();
      setJson(json);
    }
    puxarSapoha();
  }, []);

  return (
    <div>
      <ul>
        {json &&
          json.map((u, i) => (
            <li key={i}>
              <p>{u.nome}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Teste;
