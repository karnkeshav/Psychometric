import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './routes/LoginPage'
import { ProgramsPage } from './routes/ProgramsPage'
import { DisciplinesPage } from './routes/DisciplinesPage'
import { InstructionsPage } from './routes/InstructionsPage'
import { QuestionsPage } from './routes/QuestionsPage'

function App() {
  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/programs" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/programs"
            element={
              <ProtectedRoute>
                <ProgramsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/programs/:programId/disciplines"
            element={
              <ProtectedRoute>
                <DisciplinesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disciplines/:disciplineId/instructions"
            element={
              <ProtectedRoute>
                <InstructionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disciplines/:disciplineId/questions"
            element={
              <ProtectedRoute>
                <QuestionsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppShell>
    </HashRouter>
  )
}

export default App
