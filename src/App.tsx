
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import ThemeProvider from "./components/ThemeProvider";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Channels from "./pages/Channels";
import CreateChannel from "./pages/CreateChannel";
import ChannelDetail from "./pages/ChannelDetail";
import Tutorials from "./pages/Tutorials";
import CreateTutorial from "./pages/CreateTutorial";
import TutorialDetail from "./pages/TutorialDetail";
import Files from "./pages/Files";
import Assignments from "./pages/Assignments";
import Settings from "./pages/Settings";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <AppProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/channels" element={<Channels />} />
                    <Route path="/channels/create" element={<CreateChannel />} />
                    <Route path="/channels/:id" element={<ChannelDetail />} />
                    <Route path="/tutorials" element={<Tutorials />} />
                    <Route path="/tutorials/create" element={<CreateTutorial />} />
                    <Route path="/tutorials/:id" element={<TutorialDetail />} />
                    <Route path="/files" element={<Files />} />
                    <Route path="/assignments" element={<Assignments />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </AppProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
