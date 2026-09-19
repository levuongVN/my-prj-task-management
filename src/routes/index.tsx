import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/mainLayout";

import Login from "../pages/Auth/Login";
import GithubCallbackPage from "../pages/Auth/GithubCallbackPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardPage from "../pages/DashBoardPage";
import NotFoundPage from "../pages/NotFoundPage";
import TaskPage from "../pages/TaskPage";
import ProjectsPage from "../pages/ProjectPage";
import CalendarPage from "../pages/CalendarPage";
import AnalyticsPage from "../pages/AnalyticPage";
import SettingsPage from "../pages/SettingsPage";
import NotificationPage from "../pages/NotificationPage";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/github/callback" element={<GithubCallbackPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* PRIVATE */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/projects" element={<ProjectsPage />}></Route>
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>

        {/* DEFAULT */}
        <Route
          path="*"
          element={NotFoundPage()}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes