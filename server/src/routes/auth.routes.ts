import { Router } from 'express'
import { createSupabaseClient } from '../config/supabase.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

// Get current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const supabase = createSupabaseClient(req.headers.authorization!.split(' ')[1])
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found'
        }
      })
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.user_metadata?.display_name || profile?.display_name,
          avatarUrl: user.user_metadata?.avatar_url || profile?.avatar_url,
          role: profile?.role || 'user'
        }
      }
    })
  } catch (error) {
    next(error)
  }
})

// Logout (client-side mostly, but can invalidate server-side if needed)
router.post('/logout', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader) {
      const supabase = createSupabaseClient(authHeader.split(' ')[1])
      await supabase.auth.signOut()
    }
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    next(error)
  }
})

export default router