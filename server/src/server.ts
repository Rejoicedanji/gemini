import app from './app.js'
import { config } from './config/env.js'

const PORT = config.port

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 Gemini AI Server is running                       ║
║                                                        ║
║   Local:    http://localhost:${PORT}                     ║
║   API:      http://localhost:${PORT}/api/v1              ║
║                                                        ║
║   Environment: ${config.nodeEnv}                            ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...')
  process.exit(0)
})