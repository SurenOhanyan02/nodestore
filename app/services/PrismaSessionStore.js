import session from "express-session";
import { prisma } from './prisma.js'

export class PrismaSessionStore extends session.Store {
    constructor() {
        super()
    }

    async get(sid, callback) {
        try {
            const record = await prisma.session.findUnique({
                where: { sid }
            })
            if (!record) return callback(null, null)
            const session = JSON.parse(record.data)
            return callback(null, session)
        } catch (error) {
            return callback(error)
        }
    }

    async set(sid, sessionData, callback) {
        try {
            const data = JSON.stringify(sessionData);
            const expiresAt = new Date(sessionData.cookie.expires || Date.now() + 8640000) // fallback: 1 day
            const userId = sessionData.user?.id || null;
            await prisma.session.upsert({
                where: { sid },
                update: { data, expiresAt, userId },
                create: { sid, data, expiresAt, userId }
            })

            callback(null)
        } catch (error) {
            callback(error)
        }
    }

    async destroy(sid, callback) {
        try {
            await prisma.session.delete({ where: { sid } });
            callback(null)
        } catch (error) {
            callback(err)
        }
    }

    async clear(callback) {
        try {
            await prisma.session.delete()
            callback(null)
        } catch (error) {
            callback(error)
        }
    }

    async length(callback) {
        try {
            const count = await prisma.session.count()
            callback(null, count)
        } catch (error) {
            callback(error)
        }
    }
}