import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthPage } from '@/features/auth/pages/auth-page'
import { RequireAuth } from '@/features/auth/require-auth'
import { GoalTimelinePage } from '@/features/goals/pages/goal-timeline-page'
import { HabitsPage } from '@/features/habits/pages/habits-page'
import { TasksPage } from '@/features/tasks/pages/tasks-page'
import { TodayPage } from '@/features/today/pages/today-page'
import { AppShell } from '@/shared/components/app-shell'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<TodayPage />} />
          <Route path="/goals" element={<GoalTimelinePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/habits" element={<HabitsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
