import { useState } from 'react'
import CardModal from './CardModal'

function CardItem({ card, boardId, boardLists, onUpdate }) {
  const [open, setOpen] = useState(false)

  // Generate initials avatar colour from name
  const memberInitial = (name) => name ? name[0].toUpperCase() : '?'

  return (
    <>
      <article
        id={`card-${card.id}`}
        className={`card-item${card.is_overdue ? ' overdue-card' : ''}`}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
        aria-label={`Open card: ${card.title}`}
      >
        {/* Tags on top */}
        {card.tags?.length > 0 && (
          <div className="tag-row" style={{ marginBottom: 8, marginTop: 0 }}>
            {card.tags.map((tag) => (
              <span
                className="tag-badge"
                style={{ backgroundColor: tag.color }}
                key={tag.id}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <p className="card-title">{card.title}</p>

        <div className="card-footer">
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {card.due_date && (
              <span className={`due-date-chip${card.is_overdue ? ' overdue-badge' : ''}`}
                style={card.is_overdue ? {
                  color: 'var(--accent-danger)',
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.2)',
                } : {}}
              >
                {card.is_overdue ? '⚠ ' : '📅 '}
                {card.is_overdue ? 'OVERDUE' : new Date(card.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>

          {card.members?.length > 0 && (
            <div className="card-members">
              {card.members.slice(0, 3).map((member) => (
                <div
                  key={member.id}
                  className="member-avatar"
                  title={member.name}
                  style={{ marginLeft: -4 }}
                >
                  {memberInitial(member.name)}
                </div>
              ))}
              {card.members.length > 3 && (
                <div className="member-avatar" style={{ marginLeft: -4, fontSize: 9 }}>
                  +{card.members.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
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
