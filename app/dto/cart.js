export class CartDTO {
    id;
    productId
    title;
    price;
    quantity;
    image;

    constructor(model) {
        this.id = model.id
        this.productId = model.product?.id
        this.quantity = model.quantity
        this.price = model.product?.price
        this.title = model.product?.title
        this.image = model.product?.image
    }
}