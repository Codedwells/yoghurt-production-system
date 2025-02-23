import 'dotenv/config'

export const Config = {
  SERVER_PORT: process.env.PORT || 8001,
  JWT_SECRET: process.env.JWT_SECRET as string,
  MONGO_URI: process.env.MONGO_URI as string,
  NODE_ENV: process.env.NODE_ENV as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  RESEND_KEY: process.env.RESEND_KEY as string,
}
