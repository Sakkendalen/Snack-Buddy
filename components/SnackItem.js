/**
 * Object that is used to save snacks to AsyncStorage.
 * Object holds information of name, Cost, Category and key of itself.
 */
export class SnackItem {
    constructor(name, cost, categ, key) {
        this.name = name
        this.cost = cost
        this.categ = categ
        this.key = key
    }
  }