import {Invoice as Bill} from "./invoice";

export class CheckOut {

    constructor(pricingRules) {
        this.pricingRules = pricingRules;
        this.items = [];
    }
    add(productCode) {
        this.items.push(productCode);
    }

    total() {
        const Invoice = new Bill(this.items);
        this.pricingRules.apply(Invoice);
        return Invoice.total();
    }
}