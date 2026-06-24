import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

export const getBoards = () => api.get('/boards')
export const createBoard = (data) => api.post('/boards', data)
export const deleteBoard = (id) => api.delete(`/boards/${id}`)
export const getBoard = (id) => api.get(`/boards/${id}`)

export const getLists = (boardId) => api.get(`/boards/${boardId}/lists`)
export const createList = (boardId, data) => api.post(`/boards/${boardId}/lists`, data)
export const updateList = (boardId, id, data) => api.put(`/boards/${boardId}/lists/${id}`, data)
export const deleteList = (boardId, id) => api.delete(`/boards/${boardId}/lists/${id}`)

export const getCards = (boardListId) => api.get('/cards', { params: { board_list_id: boardListId } })
export const createCard = (data) => api.post('/cards', data)
export const updateCard = (id, data) => api.put(`/cards/${id}`, data)
export const deleteCard = (id) => api.delete(`/cards/${id}`)
export const moveCard = (id, data) => api.put(`/cards/${id}/move`, data)

export const getTags = () => api.get('/tags')
export const createTag = (data) => api.post('/tags', data)
export const getMembers = (boardId) => api.get('/members', { params: { board_id: boardId } })
export const createMember = (data) => api.post('/members', data)

export const attachTag = (cardId, tagId) => api.post(`/cards/${cardId}/tags/${tagId}`)
export const detachTag = (cardId, tagId) => api.delete(`/cards/${cardId}/tags/${tagId}`)
export const assignMember = (cardId, memberId) => api.post(`/cards/${cardId}/members/${memberId}`)
export const unassignMember = (cardId, memberId) => api.delete(`/cards/${cardId}/members/${memberId}`)
