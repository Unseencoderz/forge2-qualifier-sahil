import { useEffect, useState } from 'react'
import { createList, getBoard } from './api'
import ListColumn from './ListColumn'

function BoardView({ boardId }) {
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newListName, setNewListName] = useState('')
  const [showAddList, setShowAddList] = useState(false)

  const loadBoard = async () => {
    setLoading(true)
    const { data } = await getBoard(boardId)
    setBoard(data)
    setLoading(false)
  }

  useEffect(() => {
    loadBoard()
  }, [boardId])

  const addList = async () => {
    const name = newListName.trim()
    if (!name) return
    await createList(boardId, {
      name,
      board_id: boardId,
      position: board?.lists?.length || 0,
    })
    setNewListName('')
    setShowAddList(false)
    await loadBoard()
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Loading board…</span>
      </div>
    )
  }
  if (!board) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">🔍</span>
        <p>Board not found.</p>
      </div>
    )
  }

  return (
    <section className="board-view">
      <div className="board-header">
        <h2>{board.name}</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {showAddList ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                id="new-list-input"
                autoFocus
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addList()
                  if (e.key === 'Escape') { setShowAddList(false); setNewListName('') }
                }}
                placeholder="List name…"
                style={{ width: 160 }}
              />
              <button type="button" id="confirm-add-list-btn" className="btn-primary" onClick={addList}>Add</button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => { setShowAddList(false); setNewListName('') }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="add-list-btn"
              className="btn-primary"
              onClick={() => setShowAddList(true)}
            >
              + Add List
            </button>
          )}
        </div>
      </div>

      <div className="lists-row">
        {board.lists.length === 0 && (
          <div className="empty-state" style={{ height: 'auto', padding: '40px 0' }}>
            <span className="empty-state-icon">📝</span>
            <p>Add a list to start organising your board.</p>
          </div>
        )}
        {board.lists.map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            boardId={boardId}
            boardLists={board.lists}
            onUpdate={loadBoard}
          />
        ))}
      </div>
    </section>
  )
}

export default BoardView
