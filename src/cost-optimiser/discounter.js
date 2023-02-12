import * as _ from "lodash";


/*
        DISCOUNTER module- sits at the core of discount calculations
        It involves 2 steps:
        1) Knapsack algorithm to optimize a purchase with an eye on best possible discount 
        for the customer.
        (More information about the algo: https://algorithm-visualizer.org/dynamic-programming/knapsack-problem)
        2) Greedy Algorithm to recursively traverse a tree to find the minimum cost method to obtain optimum weight.

*/


 function greedyTraverse(items, optimumWeight, totalCost, allocations, result) {

    items = items.filter(item => item.weight <= optimumWeight);

    if (items.length === 0) {
        // no more solutions to be found => prune branch
        return;
    }

    if (items.length === 1) {
        // A single leaf
        let item = items[0];
        if (optimumWeight % item.weight === 0) {
            let allocation = optimumWeight / item.weight;
            totalCost += allocation * item.cost;
            if ( (result.cost === null) || (totalCost < result.cost) ) {
                result.cost = totalCost;
                result.allocations = [...allocations, {item, allocation}];
            }
        }
        return;
    }

    let item = items[0];
    let newAllocations, newTotalCost, newoptimumWeight;

    for (let allocation = Math.floor(optimumWeight / item.weight); allocation >= 0; allocation--) {

        if ( allocation > 0 ) {
            newAllocations = [...allocations, {item, allocation}];
            newTotalCost = totalCost + (allocation * item.cost);
            newoptimumWeight = optimumWeight - (allocation * item.weight);
        } else {
            // skip this item
            newAllocations = allocations;
            newTotalCost = totalCost;
            newoptimumWeight = optimumWeight;
        }

        if (newoptimumWeight === 0) {
            if ( (result.cost === null) || (newTotalCost < result.cost) ) {
                result.cost = newTotalCost;
                result.allocations = newAllocations;
            }
            return;
        }

        if ( (result.cost !== null) && (newTotalCost > result.cost) ) {
            return;
        }

        greedyTraverse(
            items.slice(1),
            newoptimumWeight,
            newTotalCost,
            newAllocations,
            result
        );
    }
}



export function knapsack(items, optimumWeight) {
    let result = {
        cost: null,
        allocations: [],
    };

    items = items.filter(item => (item.weight <= optimumWeight));
    if (items.length === 0) {
        return [];
    }

    items = _.sortBy(items, item => item.cost / item.weight);

    greedyTraverse(items, optimumWeight, 0, [], result);
    return result.allocations;
}

