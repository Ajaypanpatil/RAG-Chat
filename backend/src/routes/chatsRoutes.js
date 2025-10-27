import express from 'express'
import db from '../db.js'
import { nanoid } from 'nanoid'

const router = express.Router()

// POST /chats  { name: "My DAA Notes" }
router.post('/', async (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'name is required' })

  const id = nanoid(12)
  const now = new Date().toISOString()
  const chat = { id, name, createdAt: now, updatedAt: now }
  db.data.chats.push(chat)
  await db.write()
  res.json({ chat })
})

// GET /chats  -> list chats
router.get('/', async (_req, res) => {
  const chats = [...db.data.chats].sort((a,b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
  res.json({ chats })
})

// GET /chats/:id/messages
router.get('/:id/messages', async (req, res) => {
  const { id } = req.params
  const messages = db.data.messages.filter(m => m.chatId === id)
  res.json({ messages })
})

export default router
