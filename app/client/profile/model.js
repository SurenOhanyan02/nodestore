import { ErrorService } from '../../services/error-service.js'
import { prisma } from '../../services/prisma.js'
import bcrypt from 'bcrypt'
export const update = async ({ id, first_name, last_name, email, password }) => {
    const hash = await bcrypt.hash(password, 10)
    const response = await prisma.user.update({
        where: {
            id: +id
        },
        data: {
            first_name,
            last_name,
            email,
            ...(password && { password: hash })
        }
    })
    if (!response) {
        throw ErrorService.BadRequestError()
    }
    return true
}