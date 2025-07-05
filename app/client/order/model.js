import { handleDatabaseError } from "../../helpers/handleDatabaseErrors.js";
import { prisma } from '../../services/prisma.js'
export const create = async ({ userId, total, cartItems, phone, address, cartId }) => {
    try {
        const result = await prisma.order.create({
            data: {
                userId,
                total,
                phone,
                address,
                items: {
                    create: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        title: item.title,
                        priceAtTime: item.price,
                    }))
                }
            }
        });
        if (result) {
            await prisma.cartItem.deleteMany({
                where: {
                    cartId: +cartId
                }
            })
            return true
        }
        return false

    } catch (error) {
        handleDatabaseError(error, { userId, total, cartItems, operation: 'Create Order' });
    }
}



export const remove = async (id) => {
    try {
        const orderId = parseInt(id)
        
       
        
     
        const deletedItems = await prisma.orderItem.deleteMany({
            where: { 
                orderId: orderId 
            }
        })
        
        console.log('Deleted order items:', deletedItems.count)
        
 
        const deletedOrder = await prisma.order.delete({
            where: { 
                id: orderId 
            }
        })
        
        console.log('Deleted order:', deletedOrder)
        
        return {
            success: true,
            deletedItems: deletedItems.count,
            deletedOrder: deletedOrder
        }
        
    } catch (error) {
        console.error('Model remove error:', error)
        throw new Error(`Չհաջողվեց ջնջել order-ը: ${error.message}`)
    }
}


export const findAll = async (userId = null) => {
    try {
        const whereCondition = userId ? { userId: parseInt(userId) } : {}
        
        const orders = await prisma.order.findMany({
            where: whereCondition,
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        
        return orders
    } catch (error) {
        console.error('Model findAll error:', error)
        throw error
    }
}

export const updateStatus = async (id, status) => {
    try {
        const updatedOrder = await prisma.order.update({
            where: { 
                id: parseInt(id) 
            },
            data: { 
                status 
            }
        })
        
        return updatedOrder
    } catch (error) {
        console.error('Model updateStatus error:', error)
        throw error
    }
}
