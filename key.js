import dotenv from 'dotenv'
dotenv.config();

export const MONGOURL = process.env.MONGOURL
export const PORT = process.env.PORT || 3000