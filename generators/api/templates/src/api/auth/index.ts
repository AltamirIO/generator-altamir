import { Request, Response, Router } from 'express'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'
import { isAuthenticated, tokenExpirationPeriod } from '../../config/passport'
import User from '../graphql/user/User.model'
import requiredFields from '../middleware/requiredFields'

const router = Router()

/**
 * /auth/login
 * Log an existing user in and return a valid, signed JWT.
 */
router.post('/login',
  requiredFields(['email', 'password']),
  passport.authenticate('local', { session: false }),
  (req: any, res: Response) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.TOKEN_SECRET,
      { expiresIn: tokenExpirationPeriod },
    )

    res.set({
      Authorization : `Bearer ${token}`,
    })

    return res.json({ token })
  },
)

/**
 * /auth/register
 * Create a new user with:
 *  email: req.body.email
 *  password: req.body.password
 */
router.post('/register', requiredFields(['email', 'password']), (req: Request, res: Response) => {
  User.create({
    email: req.body.email,
    password: req.body.password,
  })
  .then((user) => res.json({
    _id: user._id,
    email: user.email,
  }))
  .catch((err) => res.send(err))
})

/**
 * /auth/refresh
 * Return a refreshed, valid, signed JWT.
 * https://stackoverflow.com/a/26834685
 */
router.post('/refresh', isAuthenticated, (req: any, res: Response) => {
  const token = jwt.sign(
    { id: req.user._id },
    process.env.TOKEN_SECRET,
    { expiresIn: tokenExpirationPeriod },
  )

  res.set({
    Authorization : `Bearer ${token}`,
  })

  return res.json({ token })
})

export default router
