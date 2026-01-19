import React, { useState } from 'react';



const BiometricAuth = ({ onBiometricLogin }) => {
  const [isSupported, setIsSupported] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      if (onBiometricLogin) {
        onBiometricLogin();
      }
    }, 2000);
  };

  if (!isSupported) {
    return null;
  }

  return null;
};

export default BiometricAuth;