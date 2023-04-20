import auth from '../controller/auth.js'
import { Router } from 'express'

const router = Router()

router.post('/api/v1/auth/register', auth.REGISTER)
router.post('/api/v1/auth/login', auth.LOGIN)

export default router