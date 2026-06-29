import { Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { UserProvider } from '@/context/UserContext'
import { BoardsProvider } from '@/context/BoardsContext'
import Layout from '@/components/layout/Layout'
import BoardsPage from '@/pages/BoardsPage'
import BoardDetailPage from '@/pages/BoardDetailPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BoardsProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<BoardsPage />} />
              <Route path="/boards/:boardId" element={<BoardDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
          </Routes>
        </BoardsProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
