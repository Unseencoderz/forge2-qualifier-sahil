import { createCard, deleteList } from './api'
import CardItem from './CardItem'

function ListColumn({ list, boardId, boardLists, onUpdate }) {
  const addCard = async () => {
    const title = prompt('Card title')
    if (!title) return
    await createCard({
      title,
      board_list_id: list.id,
      position: list.cards?.length || 0,
    })
    await onUpdate()
  }

  const removeList = async () => {
    await deleteList(boardId, list.id)
    await onUpdate()
  }

  return (
    <section className="list-column">
      <div className="list-header">
        <h3>{list.name}</h3>
        <button type="button" onClick={removeList}>Delete</button>
      </div>
      {(list.cards || []).map((card) => (
        <CardItem
          key={card.id}
          card={card}
          boardId={boardId}
          boardLists={boardLists}
          onUpdate={onUpdate}
        />
      ))}
      <button type="button" onClick={addCard}>Add Card</button>
    </section>
  )
}

export default ListColumn
