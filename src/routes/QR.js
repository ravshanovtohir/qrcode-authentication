import qr from '../controller/qr.js'
import { Router } from 'express'

const router = Router()

router.post('/api/v1/auth/qr/generate', qr.QR_GENERATE)
router.post('/api/v1/auth/qr/scan', qr.QR_SCAN)

export default router