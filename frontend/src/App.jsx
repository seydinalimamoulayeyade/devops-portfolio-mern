import { Route, Routes } from "react-router-dom";
import Dossier from "./components/Dossier";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import AjouterProjet from "./pages/AjouterProjet";
import DetaillerProjet from "./pages/DetaillerProjet";
import NewHomePage from "./pages/NewHomePage";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<NewHomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projets" element={<Dossier />} />

        <Route element={<PrivateRoute />}>
          <Route path="/ajouter" element={<AjouterProjet />} />
          <Route path="/modifier/:id" element={<AjouterProjet />} />
        </Route>

        <Route path="/projets/:id" element={<DetaillerProjet />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
