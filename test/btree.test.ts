import { BTree } from "lib/btree/btree";

// Initialize a B-Tree for testing
const btree = new BTree<number, number>();
btree.put(1, 2);
btree.put(2, 3);
btree.put(3, 4);
btree.put(4, 5);
btree.put(4, 6);

test("btree.find", () => {
    expect(btree.find(1)).toEqual([2]);
    expect(btree.find(2)).toEqual([3]);
    expect(btree.find(3)).toEqual([4]);
    expect(btree.find(4)).toEqual([5, 6]);
    expect(btree.find(5)).toEqual(null);
});

test("btree.findInRange", () => {
    expect(btree.findInRange(0, 2)).toEqual([2, 3]);
    expect(btree.findInRange(3, 5)).toEqual([4, 5, 6]);
    expect(btree.findInRange(0, 5)).toEqual([2, 3, 4, 5, 6]);
    expect(btree.findInRange(5, 6)).toEqual([]);
});
