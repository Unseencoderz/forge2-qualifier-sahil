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
  const [tagForm, setTagForm] = useState({ name: '', color: '#e53e3e' })
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
    setTagForm({ name: '', color: '#e53e3e' })
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

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <label>
          Title
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </label>
        <label>
          Due date
          <input
            type="date"
            value={form.due_date || ''}
            onChange={(event) => setForm({ ...form, due_date: event.target.value })}
          />
        </label>

        <section>
          <h3>Tags</h3>
          {card.tags?.map((tag) => (
            <button type="button" key={tag.id} onClick={async () => { await detachTag(card.id, tag.id); await onUpdate() }}>
              {tag.name} x
            </button>
          ))}
          <select defaultValue="" onChange={async (event) => { if (event.target.value) { await attachTag(card.id, event.target.value); await onUpdate() } }}>
            <option value="">Attach tag</option>
            {tags.map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
          </select>
          <div className="create-row">
            <input placeholder="Tag" value={tagForm.name} onChange={(event) => setTagForm({ ...tagForm, name: event.target.value })} />
            <input type="color" value={tagForm.color} onChange={(event) => setTagForm({ ...tagForm, color: event.target.value })} />
            <button type="button" onClick={createAndAttachTag}>Create</button>
          </div>
        </section>

        <section>
          <h3>Members</h3>
          {card.members?.map((member) => (
            <button type="button" key={member.id} onClick={async () => { await unassignMember(card.id, member.id); await onUpdate() }}>
              {member.name} x
            </button>
          ))}
          <select defaultValue="" onChange={async (event) => { if (event.target.value) { await assignMember(card.id, event.target.value); await onUpdate() } }}>
            <option value="">Assign member</option>
            {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
          <div className="create-row">
            <input placeholder="Name" value={memberForm.name} onChange={(event) => setMemberForm({ ...memberForm, name: event.target.value })} />
            <input placeholder="Email" value={memberForm.email} onChange={(event) => setMemberForm({ ...memberForm, email: event.target.value })} />
            <button type="button" onClick={createAndAssignMember}>Create</button>
          </div>
        </section>

        <label>
          Move card
          <select value={card.board_list_id} onChange={(event) => changeList(event.target.value)}>
            {boardLists.map((list) => <option key={list.id} value={list.id}>{list.name}</option>)}
          </select>
        </label>
        <div className="modal-actions">
          <button type="button" onClick={save}>Save</button>
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default CardModal
