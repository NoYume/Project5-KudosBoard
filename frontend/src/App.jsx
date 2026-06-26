import { Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { BoardsProvider } from '@/context/BoardsContext'
import Layout from '@/components/layout/Layout'
import BoardsPage from '@/pages/BoardsPage'
import BoardDetailPage from '@/pages/BoardDetailPage'

function App() {
  return (
    <ThemeProvider>
      <BoardsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<BoardsPage />} />
            <Route path="/boards/:boardId" element={<BoardDetailPage />} />
          </Route>
        </Routes>
      </BoardsProvider>
    </ThemeProvider>
  )
}

export default App
