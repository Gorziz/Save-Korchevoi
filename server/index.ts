import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import winston from 'winston'
import { generateKeyPairSync, createPrivateKey, constants, privateDecrypt } from 'crypto'

dotenv.config()

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/contact.log' }),
  ],
})

const kp = generateKeyPairSync('rsa', { modulusLength: 2048, publicExponent: 0x10001 })
const publicJwk = kp.publicKey.export({ format: 'jwk' }) as Record<string, unknown>
const privatePem = kp.privateKey.export({ format: 'pem', type: 'pkcs1' }) as string
const privateKey = createPrivateKey(privatePem)

app.get('/api/public-key', (_req, res) => {
  res.json({ alg: 'RSA-OAEP-256', key: publicJwk })
})

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(5).max(5000),
  ts: z.number(),
})

app.post('/api/contact', async (req, res) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.ip
  try {
    const { ciphertext } = req.body || {}
    if (!ciphertext || typeof ciphertext !== 'string') {
      logger.warn({ event: 'submit_invalid', ip })
      return res.status(400).json({ ok: false, error: 'invalid_payload' })
    }
    const buffer = Buffer.from(ciphertext, 'base64')
    const decrypted = privateDecrypt({ key: privateKey, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, buffer)
    const payload = JSON.parse(decrypted.toString('utf8'))
    const parsed = schema.safeParse(payload)
    if (!parsed.success) {
      logger.warn({ event: 'validation_failed', ip, issues: parsed.error.flatten() })
      return res.status(400).json({ ok: false, error: 'validation_failed' })
    }

    let transporter: nodemailer.Transporter
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true,
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      })
    } else {
      const testAccount = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      })
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'aleksandr.korchevoj@gmail.com',
      subject: `Повідомлення з форми: ${parsed.data.name}`,
      text: `Ім'я: ${parsed.data.name}\nEmail: ${parsed.data.email}\nЧас: ${new Date(parsed.data.ts).toISOString()}\n\n${parsed.data.message}`,
    })

    const preview = nodemailer.getTestMessageUrl(info)
    logger.info({ event: 'submit_success', ip, messageId: info.messageId, preview })
    res.json({ ok: true, preview })
  } catch (err) {
    const msg = (err as Error).message
    logger.error({ event: 'submit_error', ip, error: msg })
    const status = /validation|invalid/i.test(msg) ? 400 : 500
    res.status(status).json({ ok: false, error: 'send_failed', details: msg })
  }
})

const port = Number(process.env.PORT || 3001)
app.listen(port, () => {
  logger.info({ event: 'server_started', port })
})
