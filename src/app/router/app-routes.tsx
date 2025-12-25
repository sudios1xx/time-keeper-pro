import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Login from "@/components/Login";
import SelecaoPerfil from "@/components/SelecaoPerfil";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoadingTransition from "@/components/ui/loading-transition";
import PageTransition from "@/components/ui/page-transition";
import ScrollToTop from "@/components/ScrollToTop";

// Lazy loaded feature screens
const DashboardAdmin = React.lazy(() => import("@/components/admin/DashboardAdmin"));
const DashboardJogador = React.lazy(() => import("@/components/player/DashboardJogador"));
const GestaoJogadores = React.lazy(() => import("@/components/admin/GestaoJogadores"));
const GestaoJogos = React.lazy(() => import("@/components/admin/GestaoJogos"));
const GestaoEventos = React.lazy(() => import("@/components/admin/GestaoEventos"));
const Financas = React.lazy(() => import("@/components/admin/Financas"));
const Configuracoes = React.lazy(() => import("@/components/admin/Configuracoes"));
const JogosJogador = React.lazy(() => import("@/components/player/JogosJogador"));
const EventosJogador = React.lazy(() => import("@/components/player/EventosJogador"));
import LandingPage from "@/landing-page/LandingPage";

const PageLoading = ({ text }: { text: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <PageTransition delay={0.1}>
      <LoadingTransition text={text} size="lg" variant="soccer" className="text-slate-700" />
    </PageTransition>
  </div>
);

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { usuario, perfilSelecionado, isLoading } = useAuth();

  if (isLoading) return <PageLoading text="Inicializando..." />;
  if (usuario && perfilSelecionado) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const AdminRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["administrador"]}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/elenco"
        element={
          <ProtectedRoute allowedRoles={["administrador"]}>
            <GestaoJogadores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/financas"
        element={
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Financas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jogos"
        element={
          <ProtectedRoute allowedRoles={["administrador"]}>
            <GestaoJogos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/eventos"
        element={
          <ProtectedRoute allowedRoles={["administrador"]}>
            <GestaoEventos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/configuracoes"
        element={
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Configuracoes />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </>
);

const PlayerRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route
        path="/jogador"
        element={
          <ProtectedRoute allowedRoles={["jogador"]}>
            <DashboardJogador />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jogador/jogos"
        element={
          <ProtectedRoute allowedRoles={["jogador"]}>
            <JogosJogador />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jogador/eventos"
        element={
          <ProtectedRoute allowedRoles={["jogador"]}>
            <EventosJogador />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/jogador" replace />} />
    </Routes>
  </>
);

const AppRoutes = () => {
  const { usuario, perfilSelecionado, isLoading } = useAuth();

  if (isLoading) return <PageLoading text="Inicializando..." />;

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Rota /beta sempre acessível */}
        <Route path="/beta" element={
          <Suspense fallback={<PageLoading text="Carregando..." />}>
            <LandingPage />
          </Suspense>
        } />
        
        {!usuario ? (
          <>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="*" element={<Navigate to="/beta" replace />} />
          </>
        ) : !perfilSelecionado ? (
          <>
            <Route path="/selecao-perfil" element={<SelecaoPerfil />} />
            <Route path="*" element={<Navigate to="/selecao-perfil" replace />} />
          </>
        ) : (
          <Route
            path="/*"
            element={
              <Layout>
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                      <PageTransition delay={0.05}>
                        <LoadingTransition
                          text="Carregando página..."
                          size="md"
                          variant="minimal"
                          className="text-slate-600"
                        />
                      </PageTransition>
                    </div>
                  }
                >
                  {usuario.tipo === "administrador" ? <AdminRoutes /> : <PlayerRoutes />}
                </Suspense>
              </Layout>
            }
          />
        )}
      </Routes>
    </>
  );
};

export default AppRoutes;
