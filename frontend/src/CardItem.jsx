import { useState } from 'react'
import CardModal from './CardModal'

function CardItem({ card, boardId, boardLists, onUpdate }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <article
        className={`card-item ${card.is_overdue ? 'overdue-card' : ''}`}
        onClick={() => setOpen(true)}
      >
        <strong>{card.title}</strong>
        {card.due_date && card.is_overdue && <div className="overdue-text">OVERDUE</div>}
        {card.tags?.length > 0 && (
          <div className="tag-row">
            {card.tags.map((tag) => (
              <span className="tag-badge" style={{ backgroundColor: tag.color }} key={tag.id}>
                {tag.name}
              </span>
            ))}
          </div>
        )}
        {card.members?.length > 0 && (
          <small>{card.members.map((member) => member.name).join(', ')}</small>
        )}
      </article>
      {open && (
        <CardModal
          card={card}
          boardId={boardId}
          boardLists={boardLists}
          onClose={() => setOpen(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}

export default CardItem
