import { Request, Response, Router } from 'express'
import getDecodedJwt from '../middleware/getDecodedJwt'

const router = Router()

// middleware
router.use(getDecodedJwt())

router.get('/', (req: Request, res: Response, next) => {
  res.send('The GraphQL route.')
})

export default router
