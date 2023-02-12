
import * as _ from "lodash";

import logger from './logger';
import {nForMDealLookup, priceDealLookup} from "./mockData";
import {knapsack} from "./cost-optimiser/discounter";
import {Product} from "./product";


/**
 * Abstract class describing the interface common to all Deal types
 */
class AbstractDeal {
    apply(billItems) {};

    static load(customerId) { return []; }
}


/**
 * PriceDeal  - reduce the price of a product to a constant price
 */
export class PriceDeal extends AbstractDeal {

    constructor(customerId, productCode, price, triggerSize) {
        super();
        this.customerId = customerId;
        this.productCode = productCode;
        this.price = price;
        this.triggerSize = triggerSize || 0;
    }

    apply(billItems) {
        for ( const item of billItems ) {
            item.setDiscount("PriceDeal", 'price discount deal', Math.max(item.price - this.price, 0));
        }
    };

    static load(customerId) {
        let deals = priceDealLookup[customerId] || [];
        return deals.map(dealData => new this(...dealData));
    }
}

/**
 * A NForMDeal allows the consumer to buy N items of a product for the price of only M items.
 */
export class NForMDeal extends AbstractDeal {
    constructor(customerId, productCode, purchaseSize, costSize) {
        super();
        this.customerId = customerId;
        this.productCode = productCode;
        this.purchaseSize = purchaseSize;
        this.costSize = costSize;
        this.description = `${this.purchaseSize} for ${this.costSize} deal`;
    }

    apply(billItems) {
        while (billItems.length >= this.purchaseSize) {
            let batch = billItems.splice(0, this.purchaseSize);
            // Leave the price of the first M items alone, then discount the
            // remaining (N-M) to zero cost.
            batch.forEach(
                (item, idx) => {
                    if ( idx >= this.costSize ) {
                        item.setDiscount("NForMDeal", this.description, item.total());
                    }
                }
            );
        }
    };

    static load(customerId) {
        let deals = nForMDealLookup[customerId] || [];
        return deals.map(dealData => new this(...dealData));
    }

    effectivePrice(price) {
        return (this.costSize / this.purchaseSize) * price;
    }

    static findBestAllocationPlan(deals, numItems, stdPrice, discountPrice) {

        // Trim down the problem space - avoid searching against pointless deals.
        deals = deals.filter(deal => (deal.effectivePrice(stdPrice) < discountPrice));
        if (deals.length === 0) {
            return [];
        }

        let knapsackItems = deals.map(deal => ({
            weight: deal.purchaseSize,
            cost: deal.effectivePrice(stdPrice) * deal.costSize,
            deal: deal,
        }));

        knapsackItems = _.sortBy(knapsackItems, 'weight').reverse();
        // Add a single item purchase option for the algorithm
        knapsackItems.push({weight: 1, cost: discountPrice, deal: null});

        let plan = knapsack(knapsackItems, numItems);

        let allocations = plan.map(x => ({
            deal: x.item.deal,
            allocation: x.allocation,
        }));

        return allocations;
    }
}


export class PricingRules {
    constructor(priceDeals, nForMDeals) {
        this.priceDeals = priceDeals;
        this.nForMDeals = nForMDeals;
    }

    apply(bill) {
        for (const item of bill.items) {
            item.price = Product.load(item.productCode).price;
            item.discount = null;
        }

        let productGroups = _.groupBy(bill.items, 'productCode');

        for (const [productCode, productItems] of Object.entries(productGroups)) {
            this._applyProductDeals(productCode, productItems);
        }
    }

    _applyProductDeals(productCode, productItems) {

        // determine pricing to apply

        const stdPrice = Product.load(productCode).price;

        let {priceDeal, nForMDeals} = this._resolveProductDeals(productCode, stdPrice, productItems.length);
        if ((!priceDeal) && (nForMDeals.length === 0)) {
            return; // No deals to apply
        }

        let price = priceDeal ? priceDeal.price : stdPrice;


        // apply all the deals

        const remainingProductItems = [...productItems];

        let nForMAllocationPlan = NForMDeal.findBestAllocationPlan(nForMDeals, productItems.length, stdPrice, price);
        logger.debug('_applyProductDeals - nForMAllocationPlan for %d %s = %j, rules = %j', productItems.length, productCode, nForMAllocationPlan, {priceDeal, nForMDeals});
        for (const {deal, allocation} of nForMAllocationPlan) {
            if (deal) {
                let dealItems = remainingProductItems.splice(0, allocation * deal.purchaseSize);
                deal.apply(dealItems);
            }
        }

        if (priceDeal) {
            priceDeal.apply(remainingProductItems);
        }
    }

    _resolveProductDeals(productCode, productPrice, numItems) {
        let priceDeal = null;
        let pricingDeals = this.priceDeals.filter(
            deal =>
                (deal.productCode === productCode) &&
                (deal.price < productPrice) &&
                (deal.triggerSize <= numItems)
        );
        if (pricingDeals.length) {
            priceDeal = _.minBy(pricingDeals, 'price');
        }

        let nForMDeals = this.nForMDeals.filter(
            deal => (deal.productCode === productCode) && (deal.effectivePrice(productPrice) < productPrice)
        );

        return {priceDeal, nForMDeals};
    }

    static load(customerId) {
        return new this(PriceDeal.load(customerId), NForMDeal.load(customerId));
    }
}
