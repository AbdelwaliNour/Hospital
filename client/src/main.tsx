import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet } from 'react-helmet';

createRoot(document.getElementById("root")!).render(
  <>
    <Helmet>
      <title>MediCare - Healthcare Dashboard</title>
      <meta name="description" content="Healthcare management dashboard with appointment scheduling, patient monitoring, and medical analytics" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    </Helmet>
    <App />
  </>
);
