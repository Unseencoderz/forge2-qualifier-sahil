import { useState } from 'react'
import { createCard, deleteList } from './api'
import CardItem from './CardItem'

function ListColumn({ list, boardId, boardLists, onUpdate }) {
  const [newCardTitle, setNewCardTitle] = useState('')
  const [showAddCard, setShowAddCard] = useState(false)

  const addCard = async () => {
    const title = newCardTitle.trim()
    if (!title) return
    await createCard({
      title,
      board_list_id: list.id,
      position: list.cards?.length || 0,
    })
    setNewCardTitle('')
    setShowAddCard(false)
    await onUpdate()
  }

  const removeList = async () => {
    await deleteList(boardId, list.id)
    await onUpdate()
  }

  const cardCount = list.cards?.length || 0

  return (
    <section className="list-column" id={`list-col-${list.id}`}>
      <div className="list-header">
        <h3>{list.name}</h3>
        <span className="list-card-count">{cardCount}</span>
        <button
          type="button"
          id={`delete-list-${list.id}`}
          className="btn-icon btn-danger"
          onClick={removeList}
          title="Delete list"
          aria-label="Delete list"
          style={{ marginLeft: 'auto' }}
        >
          🗑
        </button>
      </div>

      <div className="list-cards">
        {(list.cards || []).map((card) => (
          <CardItem
            key={card.id}
            card={card}
            boardId={boardId}
            boardLists={boardLists}
            onUpdate={onUpdate}
          />
        ))}
      </div>

      {showAddCard ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
          <input
            id={`add-card-input-${list.id}`}
            autoFocus
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addCard()
              if (e.key === 'Escape') { setShowAddCard(false); setNewCardTitle('') }
            }}
            placeholder="Card title…"
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" id={`confirm-add-card-${list.id}`} className="btn-primary" style={{ flex: 1 }} onClick={addCard}>
              Add Card
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => { setShowAddCard(false); setNewCardTitle('') }}
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          id={`add-card-btn-${list.id}`}
          className="list-add-card-btn"
          onClick={() => setShowAddCard(true)}
        >
          + Add a card
        </button>
      )}
    </section>
  )
}

export default ListColumn
