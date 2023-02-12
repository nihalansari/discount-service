
import {productLookup} from "./mockData";


export class Product {

    constructor(code, name, description, price) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.price = price;
    }

    static load(code) {
        const data = productLookup[code];
        if (! data) {
            throw new Error('NRF: product not found');
        }
        return new this(...data);
    }
}

