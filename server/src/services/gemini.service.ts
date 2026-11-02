import { GoogleGenAI } from '@google/genai'
import { config } from '../config/env.js'

const client = new GoogleGenAI({ apiKey: config.gemini.apiKey })

export interface MessageAttachment {
  fileName: string
  fileType: string
  data: string // base64 encoded
}

export interface GenerateResponse {
  text: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

export async function generateContent(
  prompt: string,
  history: Array<{ role: string; content: string }> = [],
  attachments: MessageAttachment[] = []
): Promise<GenerateResponse> {
  if (!config.gemini.apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const model = config.gemini.model

  try {
    // Build contents with history and attachments
    const contents: Array<{ role: string; parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> }> = []

    // Add conversation history
    for (const msg of history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })
    }

    // Add current message with attachments
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = []

    // Add text content
    if (prompt) {
      parts.push({ text: prompt })
    }

    // Add image attachments
    for (const attachment of attachments) {
      if (attachment.fileType.startsWith('image/')) {
        parts.push({
          inlineData: {
            mimeType: attachment.fileType,
            data: attachment.data.split(',')[1] // Remove data:image/...;base64, prefix
          }
        })
      }
    }

    contents.push({
      role: 'user',
      parts
    })

    const response = await client.models.generateContent({
      model,
      contents: contents
    })

    const text = response.text

    if (!text) {
      throw new Error('No response generated from AI')
    }

    return {
      text,
      usage: {
        inputTokens: 0, // Gemini API doesn't return token counts in this SDK yet
        outputTokens: 0
      }
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    throw error
  }
}

export async function generateStream(
  prompt: string,
  history: Array<{ role: string; content: string }> = [],
  attachments: MessageAttachment[] = []
): Promise<AsyncIterable<string>> {
  if (!config.gemini.apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const model = config.gemini.model

  try {
    // Build contents
    const contents: Array<{ role: string; parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> }> = []

    for (const msg of history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })
    }

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = []

    if (prompt) {
      parts.push({ text: prompt })
    }

    for (const attachment of attachments) {
      if (attachment.fileType.startsWith('image/')) {
        parts.push({
          inlineData: {
            mimeType: attachment.fileType,
            data: attachment.data.split(',')[1]
          }
        })
      }
    }

    contents.push({
      role: 'user',
      parts
    })

    const response = await client.models.generateContentStream({
      model,
      contents: contents
    })

    const stream = response.stream

    if (!stream) {
      throw new Error('No stream generated from AI')
    }

    return stream
  } catch (error) {
    console.error('Gemini streaming error:', error)
    throw error
  }
}