import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../../contexts/UserContext";
import { VerificationModal } from "../../components/ui";
import style from "./Dashboard.module.css";

interface UserData {
  id: string;
  character_name: string;
  username: string;
  user_email?: string;
  email?: string;
  rank?: string;
  cargo?: string;
  xps?: string;
}

const Dashboard = () => {
  const { data, userLogout } = useUser();
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCompleted, setVerificationCompleted] = useState(false);

  // useEffect para iniciar verificação quando o componente montar
  useEffect(() => {
    if (
      data &&
      typeof data === "object" &&
      "character_name" in data &&
      !verificationCompleted
    ) {
      setShowVerification(true);
    }
  }, [data, verificationCompleted]);

  const handleVerificationSuccess = useCallback(() => {
    setShowVerification(false);
    setVerificationCompleted(true);
  }, []);

  const handleVerificationError = useCallback(() => {
    setShowVerification(false);
    userLogout();
  }, [userLogout]);

  const userData = data as UserData;

  return (
    <section className={`${style.dashContainer} container`}>
      <p>Aqui pode vir o que eu quiser</p>

      <VerificationModal
        isVisible={showVerification}
        characterName={userData?.character_name || ""}
        onSuccess={handleVerificationSuccess}
        onError={handleVerificationError}
      />
    </section>
  );
};

export default Dashboard;
