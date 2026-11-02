import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  code: string
  statusCode: number

  constructor(message: string, code: string = 'INTERNAL_ERROR', statusCode: number = 500) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err)

  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    })
  }

  // Handle Supabase errors
  if (err.message?.includes('PGRST')) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Invalid request data'
      }
    })
  }

  // Default error response
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message
    }
  })
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  })
}