import { useEffect, useState } from 'react'
import { createList, getBoard } from './api'
import ListColumn from './ListColumn'

function BoardView({ boardId }) {
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)

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
    const name = prompt('List name')
    if (!name) return
    await createList(boardId, {
      name,
      board_id: boardId,
      position: board?.lists?.length || 0,
    })
    await loadBoard()
  }

  if (loading) return <p className="empty-state">Loading board...</p>
  if (!board) return <p className="empty-state">Board not found.</p>

  return (
    <section className="board-view">
      <div className="board-header">
        <h2>{board.name}</h2>
        <button type="button" onClick={addList}>Add List</button>
      </div>
      <div className="lists-row">
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
