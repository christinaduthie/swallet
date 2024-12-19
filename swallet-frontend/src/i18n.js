const translations = {
    en: {
      // General App Texts
      selectLanguage: "Select Language",
      english: "English",
      spanish: "Español",
      welcomeText: "Welcome, ",
      scanQr: "Scan QR for payments",
  
      // Signup Page Texts
      signupTitle: "Sign Up",
      nameLabel: "Name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      passwordLabel: "Password",
      pinLabel: "PIN",
      signupButton: "Sign Up",
      haveAccount: "Already have an account?",
      loginLink: "Log In",
      userRegistered: "User registered successfully! Please log in.",
  
      // My Account Page Texts
      myAccountTitle: "My Account",
      languageLabel: "Language",
      updateProfileButton: "Update Profile",
      changePasswordTitle: "Change Password",
      currentPasswordLabel: "Current Password",
      newPasswordLabel: "New Password",
      changePasswordButton: "Change Password",
  
      // Home Page Texts
      digitalWalletCard: "Your Digital Wallet Card",
      digitalWalletAccount: "Your Digital Wallet Account",
      send: "Send",
      add: "Add",
      more: "More",
      cashInLocations: "Cash-in locations",
      clickMapCommunity: "Click map to open Community Banks page",
      quickPay: "Quick Pay",
      recentTransactions: "Recent Transactions",
      filter: "Filter",
      download: "Download",
  
      // Transactions Table Headers
      transactionDate: "Transaction Date",
      description: "Description",
      status: "Status",
      mode: "Mode",
      amount: "Amount",
      balanceText: "Balance",
  
      // Additional Texts
      completed: "Completed",
      transactionsReport: "Transactions Report",
  
      // Other (from previous examples)
      sendToFriend: "Send to friend",
      addFundsTitle: "Add Funds",
      transferMoneyTitle: "Transfer Money"
    },
    es: {
      // General App Texts
      selectLanguage: "Seleccionar idioma",
      english: "Inglés",
      spanish: "Español",
      welcomeText: "Bienvenido, ",
      scanQr: "Escanea QR para pagos",
  
      // Signup Page Texts
      signupTitle: "Regístrate",
      nameLabel: "Nombre",
      emailLabel: "Correo electrónico",
      phoneLabel: "Teléfono",
      passwordLabel: "Contraseña",
      pinLabel: "PIN",
      signupButton: "Registrarse",
      haveAccount: "¿Ya tienes una cuenta?",
      loginLink: "Iniciar sesión",
      userRegistered: "¡Usuario registrado con éxito! Por favor inicie sesión.",
  
      // My Account Page Texts
      myAccountTitle: "Mi Cuenta",
      languageLabel: "Idioma",
      updateProfileButton: "Actualizar perfil",
      changePasswordTitle: "Cambiar Contraseña",
      currentPasswordLabel: "Contraseña Actual",
      newPasswordLabel: "Nueva Contraseña",
      changePasswordButton: "Cambiar Contraseña",
  
      // Home Page Texts
      digitalWalletCard: "Tu Tarjeta de Billetera Digital",
      digitalWalletAccount: "Tu Cuenta de Billetera Digital",
      send: "Enviar",
      add: "Agregar",
      more: "Más",
      cashInLocations: "Puntos de recarga",
      clickMapCommunity: "Haz clic en el mapa para abrir la página de Bancos Comunitarios",
      quickPay: "Pago Rápido",
      recentTransactions: "Transacciones Recientes",
      filter: "Filtrar",
      download: "Descargar",
  
      // Transactions Table Headers
      transactionDate: "Fecha de Transacción",
      description: "Descripción",
      status: "Estado",
      mode: "Modo",
      amount: "Cantidad",
      balanceText: "Balance",
  
      // Additional Texts
      completed: "Completado",
      transactionsReport: "Reporte de Transacciones",
  
      // Other (from previous examples)
      sendToFriend: "Enviar a un amigo",
      addFundsTitle: "Agregar Fondos",
      transferMoneyTitle: "Transferir Dinero"
    }
  };
  
  // Helper function to get translation
  export function t(key, lang='en') {
    return translations[lang][key] || key;
  }
  