import { USER_ROLES } from '../../constants/constants.js'
import { ErrorService } from '../../services/error-service.js'
import { prisma } from '../../services/prisma.js'
import bcrypt from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'

export const register = async ({ first_name, last_name, email, password }) => {
    if (!first_name || !last_name || !email || !password) {
        throw ErrorService.BadRequestError('Please write all inputs')
    }

    const existUser = await prisma.user.findFirst({
        where: {
            email,
        },
        select: {
            id: true
        }
    })

    if (existUser) {
        throw ErrorService.BadRequestError('User already exist')
    }
    const hash = await bcrypt.hash(password, 10)
    const activationLink = uuidV4();
    const newUser = await prisma.user.create({
        data: {
            first_name,
            last_name,
            email,
            password: hash,
            activationLink
        },
        select: {
            id: true
        }
    })

    if (!newUser) {
        throw ErrorService.BadRequestError()
    }

    const user_cart = await prisma.cart.create({
        data: {
            userId: newUser.id
        }
    })

    if (!user_cart) {
        throw ErrorService.BadRequestError()
    }

    return true
}

export const login = async ({ email, password }) => {
    const existUser = await prisma.user.findFirst({
        where: {
            email
        }
    })
    if (!existUser) {
        throw ErrorService.UnauthorizedError('Invalid email or password')
    }
    if (!existUser.isActivated) {
        throw ErrorService.UnauthorizedError('User not activated')
    }
    if (existUser.role !== USER_ROLES.admin) {
        throw ErrorService.UnauthorizedError('Permission denied')
    }
    const checkPass = await bcrypt.compare(password, existUser.password)

    if (!checkPass) {
        throw ErrorService.UnauthorizedError('Invalid email or password')
    }
    return {
        data: {
            id: existUser.id,
            first_name: existUser.first_name,
            last_name: existUser.last_name,
            email: existUser.email,
            role: existUser.role
        }
    }
}