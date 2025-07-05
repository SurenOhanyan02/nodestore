import { Prisma } from '@prisma/client'
import { USER_ROLES } from '../../constants/constants.js'
import { ErrorService } from '../../services/error-service.js'
import { prisma } from '../../services/prisma.js'
import bcrypt from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'
import { handleDatabaseError } from '../../helpers/handleDatabaseErrors.js'

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
    if (existUser.role !== USER_ROLES.user) {
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

export const activateUser = async (activationLink) => {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            activationLink: true,
            isActivated: true
        },
        where: {
            activationLink
        }
    })
    if (!user) {
        throw ErrorService.BadRequestError()
    }
    if (user.isActivated) {
        throw ErrorService.BadRequestError('User already activated')
    }
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            isActivated: true
        }
    })
    return true
}

export const setResetLink = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true
            }
        })
        if (user) {
            const resetLink = uuidV4()
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    resetLink
                }
            })
            return true
        }
        throw ErrorService.BadRequestError('User not found')
    } catch (error) {
        console.log(error.message);

        if (error instanceof ErrorService) {
            throw error
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            throw ErrorService.BadRequestError('Invalid input format')
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                throw ErrorService.BadRequestError('Something went wrong')
            }
            if (error.code === 'P2002') {
                throw ErrorService.BadRequestError('Something went wrong')
            }
        }

        throw ErrorService.BadRequestError(error.message || 'Unexpected error occurred')
    }
}

export const validateResetLink = async (resetLink = '') => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                resetLink
            },
            select: {
                id: true
            }
        })

        if (!user) {
            return false
        }
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                resetLink: null
            }
        })
        return user
    } catch (error) {
        handleDatabaseError(error, { resetLink, userId: user?.id, operation: 'validateResetLink' });
    }

}

export const resetPassword = async (userId, password) => {

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: +userId
            }

        })
        if (user) {
            const hash = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: hash
                }
            })
            return true
        }
        return false
    } catch (error) {
        handleDatabaseError(error, { userId, operation: 'resetPassword' });
    }
}