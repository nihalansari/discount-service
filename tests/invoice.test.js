
import {InvoiceItem, Invoice} from "../src/Invoice";
import {Discount} from "../src/Pricing";


describe("Invoice Tests", function() {

    describe("InvoiceItem Tests", function() {
        test("Total without any discount", function () {
            const item = new InvoiceItem('standard');
            item.price = 123.123;
            expect(item.total()).toEqual(123.123);
        });

        test("Discounted Total", function () {
            const item = new InvoiceItem('standard');
            item.price = 123.123;
            item.setDiscount('TEST', 'TEST', 100.123);
            expect(item.total()).toEqual(23);
        });

        test("Missing Pricing", function () {
            const item = new InvoiceItem('standard');
            expect(() => item.total()).toThrow();
        });

    });

    describe("Invoice Tests", function() {
        test("Total without any discount", function () {
            const bill = new Invoice(['standard', 'standard']);
            bill.items[0].price = 123.123;
            bill.items[1].price = 123.123;
            expect(bill.total()).toEqual(246.246);
        });

        test("Discounted Total", function () {
            const bill = new Invoice(['standard', 'standard']);
            bill.items[0].price = 123.123;
            bill.items[0].setDiscount('TEST', 'TEST', 100.123);
            bill.items[1].price = 123.123;
            expect(bill.total()).toEqual(146.123);
        });

        test("Missing Pricing", function () {
            const bill = new Invoice(['standard', 'standard']);
            expect(() => bill.total()).toThrow();
        });
    });

});