import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Apps.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx"; // ✅ import AuthProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>  {/* ✅ Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
