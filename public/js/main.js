const debounce = (fn, delay = 300) => {
    let timeout
    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn.apply(this, args), delay)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart')
    const cartCountBadge = document.querySelector('.cart-button-badge')
    addToCartButtons.forEach((btn) => {
        const productId = btn.dataset.productId
        btn.addEventListener('click', async () => {
            const response = await fetch('/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: 1 })
            })

            if (response.ok) {
                const cartData = await fetch('/api/cart')
                const cart = await cartData.json()
                cartCountBadge.innerHTML = cart.cartCount
            }
        })
    })

    const deleteCartItemBtn = document.querySelectorAll('.delete-cart-item')
    deleteCartItemBtn.forEach((btn) => {
        const productId = btn.dataset.productId
        btn.addEventListener('click', async () => {
            const response = await fetch(`/api/cart/${productId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })
            window.location.href = '/cart';
        })
    })

    document.querySelectorAll('.product-quantity').forEach((item) => {
        const input = item.querySelector('.quantity-input')
        const plus = item.querySelector('.increment')
        const minus = item.querySelector('.decrement')
        const cartItemId = item.dataset.id

        let quantity = parseInt(input.value)

        const updateQuantity = debounce(async (newQty) => {
            try {
                const response = await fetch(`/api/cart/${cartItemId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity: newQty })
                })
                if (!response.ok) {
                    throw new Error('Failed to update')
                }
                input.value = data.item?.quantity || 0
            } catch (error) {
                console.log(error.message);
            }
            finally {
                window.location.href = '/cart';
            }

        }, 400)

        plus.addEventListener('click', () => {
            quantity += 1
            input.value = quantity
            updateQuantity(quantity)
        })

        minus.addEventListener('click', () => {
            if (quantity <= 1) return
            quantity -= 1
            input.value = quantity
            updateQuantity(quantity)
        })
    })
})