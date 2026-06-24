import { useEffect, useState } from 'react'
import { createBoard, deleteBoard, getBoards } from './api'
import BoardView from './BoardView'
import './App.css'

function App() {
  const [boards, setBoards] = useState([])
  const [selectedBoardId, setSelectedBoardId] = useState(null)
  const [newBoardName, setNewBoardName] = useState('')

  const loadBoards = async () => {
    const { data } = await getBoards()
    setBoards(data)
    if (!selectedBoardId && data.length > 0) setSelectedBoardId(data[0].id)
  }

  useEffect(() => {
    loadBoards()
  }, [])

  const addBoard = async () => {
    const name = newBoardName.trim()
    if (!name) return
    const { data } = await createBoard({ name })
    setNewBoardName('')
    await loadBoards()
    setSelectedBoardId(data.id)
  }

  const removeBoard = async (id) => {
    await deleteBoard(id)
    if (selectedBoardId === id) setSelectedBoardId(null)
    await loadBoards()
  }

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="boards-panel">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">⚡</div>
          <h1>KanFlow</h1>
        </div>

        <span className="sidebar-section-label">New Board</span>
        <div className="create-row">
          <input
            id="new-board-input"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addBoard()}
            placeholder="Board name…"
          />
          <button type="button" id="add-board-btn" className="btn-primary" onClick={addBoard}>
            +
          </button>
        </div>

        <span className="sidebar-section-label" style={{ marginTop: 12 }}>My Boards</span>
        <div className="board-buttons">
          {boards.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 12, padding: '4px 8px' }}>
              No boards yet
            </p>
          )}
          {boards.map((board) => (
            <div className="board-row" key={board.id}>
              <button
                type="button"
                id={`board-btn-${board.id}`}
                className={`board-row-btn ${selectedBoardId === board.id ? 'active' : ''}`}
                onClick={() => setSelectedBoardId(board.id)}
                title={board.name}
              >
                {board.name}
              </button>
              <button
                type="button"
                id={`delete-board-${board.id}`}
                className="btn-icon"
                onClick={() => removeBoard(board.id)}
                title="Delete board"
                aria-label="Delete board"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="board-main">
        {selectedBoardId ? (
          <BoardView boardId={selectedBoardId} />
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon">📋</span>
            <p>Select a board or create one to get started.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
