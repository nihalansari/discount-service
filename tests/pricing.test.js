
import * as _ from 'lodash';

import {NForMDeal, PriceDeal} from "../src/Pricing";
import {Bill, BillItem} from "../src/Invoice";


describe("Pricing Tests", function() {

    describe("Price Deal Tests", function() {

        test("Load Deal", function () {
            const deals = PriceDeal.load(6);
            expect(deals).toEqual([
                {
                    customerId: 6,
                    productCode: 'test1',
                    price: 150,
                    triggerSize: 0,
                },
                {
                    customerId: 6,
                    productCode: 'test1',
                    price: 200,
                    triggerSize: 0,
                },
            ]);
        });

        test("Missing Deal", function () {
            const deals = PriceDeal.load(-1);
            expect(deals).toEqual([]);
        });

    });

    describe("NForM Deal Tests", function() {

        test("Load Deal", function () {
            let deals = NForMDeal.load(6);

            expect(deals).toEqual([
                {
                    customerId: 6,
                    productCode: 'test1',
                    purchaseSize: 2,
                    costSize: 1,
                    description: `2 for 1 deal`,
                },
                {
                    customerId: 6,
                    productCode: 'test2',
                    purchaseSize: 5,
                    costSize: 2,
                    description: `5 for 2 deal`,
                },
            ]);
        });

        test("Missing Deal", function () {
            let deals = NForMDeal.load(-1);
            expect(deals).toEqual([]);
        });
    });

});