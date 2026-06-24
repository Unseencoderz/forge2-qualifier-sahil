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
      <aside className="boards-panel">
        <h1>Boards</h1>
        <div className="create-row">
          <input
            value={newBoardName}
            onChange={(event) => setNewBoardName(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && addBoard()}
            placeholder="New board"
          />
          <button type="button" onClick={addBoard}>Add</button>
        </div>
        <div className="board-buttons">
          {boards.map((board) => (
            <div className="board-row" key={board.id}>
              <button
                type="button"
                className={selectedBoardId === board.id ? 'active' : ''}
                onClick={() => setSelectedBoardId(board.id)}
              >
                {board.name}
              </button>
              <button type="button" onClick={() => removeBoard(board.id)}>x</button>
            </div>
          ))}
        </div>
      </aside>
      <main className="board-main">
        {selectedBoardId ? (
          <BoardView boardId={selectedBoardId} />
        ) : (
          <p className="empty-state">Create a board to begin.</p>
        )}
      </main>
    </div>
  )
}

export default App
