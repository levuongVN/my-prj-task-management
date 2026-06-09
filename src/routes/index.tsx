import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/mainLayout";

import Login from "../pages/Auth/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardPage from "../pages/DashBoardPage";
import NotFoundPage from "../pages/NotFoundPage";
import TaskPage from "../pages/TaskPage";
import ProjectsPage from "../pages/ProjectPage";
import CalendarPage from "../pages/CalendarPage";
import AnalyticsPage from "../pages/AnalyticPage";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PRIVATE */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/projects" element={<ProjectsPage />}></Route>
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
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