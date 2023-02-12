
import {customerLookup} from "./mockData";


export class Customer {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static load(id) {
        const data = customerLookup[id];
        if (! data) {
            throw new Error('NRF: Not found customer');
        }
        return new this(...data);
    }
}
