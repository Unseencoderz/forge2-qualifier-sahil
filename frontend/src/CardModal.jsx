import { useEffect, useState } from 'react'
import {
  assignMember,
  attachTag,
  createMember,
  createTag,
  detachTag,
  getMembers,
  getTags,
  moveCard,
  unassignMember,
  updateCard,
} from './api'

function CardModal({ card, boardId, boardLists, onClose, onUpdate }) {
  const [form, setForm] = useState({
    title: card.title || '',
    description: card.description || '',
    due_date: card.due_date || '',
  })
  const [tags, setTags] = useState([])
  const [members, setMembers] = useState([])
  const [tagForm, setTagForm] = useState({ name: '', color: '#6366f1' })
  const [memberForm, setMemberForm] = useState({ name: '', email: '' })

  const loadOptions = async () => {
    const [tagResponse, memberResponse] = await Promise.all([getTags(), getMembers(boardId)])
    setTags(tagResponse.data)
    setMembers(memberResponse.data)
  }

  useEffect(() => {
    loadOptions()
  }, [boardId])

  const save = async () => {
    await updateCard(card.id, form)
    await onUpdate()
    onClose()
  }

  const createAndAttachTag = async () => {
    if (!tagForm.name.trim()) return
    const { data } = await createTag(tagForm)
    await attachTag(card.id, data.id)
    setTagForm({ name: '', color: '#6366f1' })
    await loadOptions()
    await onUpdate()
  }

  const createAndAssignMember = async () => {
    if (!memberForm.name.trim() || !memberForm.email.trim()) return
    const { data } = await createMember({ ...memberForm, board_id: boardId })
    await assignMember(card.id, data.id)
    setMemberForm({ name: '', email: '' })
    await loadOptions()
    await onUpdate()
  }

  const changeList = async (boardListId) => {
    await moveCard(card.id, { board_list_id: Number(boardListId), position: card.position || 0 })
    await onUpdate()
  }

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-label={`Edit card: ${card.title}`}>

        {/* Header */}
        <div className="modal-header">
          <h2>✏️ Edit Card</h2>
          <button type="button" id="modal-close-btn" className="btn-icon" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Title */}
        <div className="modal-field">
          <label htmlFor="card-title-input">Title</label>
          <input
            id="card-title-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Card title"
          />
        </div>

        {/* Description */}
        <div className="modal-field">
          <label htmlFor="card-description-input">Description</label>
          <textarea
            id="card-description-input"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Add a description…"
          />
        </div>

        {/* Due Date */}
        <div className="modal-field">
          <label htmlFor="card-due-date-input">Due Date</label>
          <input
            id="card-due-date-input"
            type="date"
            value={form.due_date || ''}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
        </div>

        {/* Move to List */}
        <div className="modal-field">
          <label htmlFor="card-list-select">Move to List</label>
          <select
            id="card-list-select"
            value={card.board_list_id}
            onChange={(e) => changeList(e.target.value)}
          >
            {boardLists.map((list) => (
              <option key={list.id} value={list.id}>{list.name}</option>
            ))}
          </select>
        </div>

        {/* ── Tags Section ── */}
        <div className="modal-section">
          <p className="modal-section-title">🏷 Tags</p>

          {/* Attached tags */}
          {card.tags?.length > 0 && (
            <div className="chips-row">
              {card.tags.map((tag) => (
                <button
                  type="button"
                  key={tag.id}
                  id={`detach-tag-${tag.id}`}
                  className="chip"
                  onClick={async () => { await detachTag(card.id, tag.id); await onUpdate() }}
                  title="Click to remove"
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: tag.color,
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  {tag.name}
                  <span className="chip-remove">✕</span>
                </button>
              ))}
            </div>
          )}

          {/* Attach existing tag */}
          <select
            id="attach-tag-select"
            defaultValue=""
            onChange={async (e) => {
              if (e.target.value) {
                await attachTag(card.id, e.target.value)
                e.target.value = ''
                await onUpdate()
              }
            }}
          >
            <option value="">Attach existing tag…</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>

          {/* Create new tag */}
          <div className="inline-row">
            <input
              id="new-tag-name-input"
              placeholder="New tag name"
              value={tagForm.name}
              onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && createAndAttachTag()}
            />
            <input
              id="new-tag-color-input"
              type="color"
              value={tagForm.color}
              onChange={(e) => setTagForm({ ...tagForm, color: e.target.value })}
              style={{ width: 40, height: 38, padding: 4 }}
            />
            <button type="button" id="create-tag-btn" className="btn-primary" onClick={createAndAttachTag}>
              + Tag
            </button>
          </div>
        </div>

        {/* ── Members Section ── */}
        <div className="modal-section">
          <p className="modal-section-title">👤 Members</p>

          {/* Assigned members */}
          {card.members?.length > 0 && (
            <div className="chips-row">
              {card.members.map((member) => (
                <button
                  type="button"
                  key={member.id}
                  id={`unassign-member-${member.id}`}
                  className="chip member-chip"
                  onClick={async () => { await unassignMember(card.id, member.id); await onUpdate() }}
                  title="Click to remove"
                >
                  {member.name}
                  <span className="chip-remove">✕</span>
                </button>
              ))}
            </div>
          )}

          {/* Assign existing member */}
          <select
            id="assign-member-select"
            defaultValue=""
            onChange={async (e) => {
              if (e.target.value) {
                await assignMember(card.id, e.target.value)
                e.target.value = ''
                await onUpdate()
              }
            }}
          >
            <option value="">Assign existing member…</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>

          {/* Create new member */}
          <div className="inline-row">
            <input
              id="new-member-name-input"
              placeholder="Name"
              value={memberForm.name}
              onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
            />
            <input
              id="new-member-email-input"
              placeholder="Email"
              value={memberForm.email}
              onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && createAndAssignMember()}
            />
            <button type="button" id="create-member-btn" className="btn-primary" onClick={createAndAssignMember} style={{ flexShrink: 0 }}>
              + Member
            </button>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="modal-actions">
          <button type="button" id="modal-cancel-btn" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" id="modal-save-btn" className="btn-primary" onClick={save}>
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardModal
