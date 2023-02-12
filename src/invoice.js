import * as _ from "lodash";


export class Discount {
    constructor(type, description, amount) {
        this.type = type;
        this.description = description;
        this.amount = amount;
    }
}


/**
 * A InvoiceItem is a single line item 
 */
export class InvoiceItem {
    constructor(productCode) {
        this.productCode = productCode;
        this.price = null;
        this.discount = null
    }

    setDiscount(type, description, amount) {
        this.discount = new Discount(type, description, amount);
    }

    total() {
        if ( this.price === null ) {
            throw new Error('Pricing missing from Invoice item');
        }
        return this.price - (this.discount ? this.discount.amount : 0);
    }
}


/**
 * A Invoice represents the line-by-line cost of a series of products
 */
export class Invoice {
    constructor(items) {
        this.items = items.map(x => new InvoiceItem(x));
    }

    total() {
        return _.sumBy(this.items, item => item.total());
    }

}