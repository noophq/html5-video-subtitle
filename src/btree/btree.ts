import { BTreeEntry } from "lib/btree/entry";
import { BTreeNode } from "lib/btree/node";

export class BTree<K, V> {
    // Define order of a B-tree
    // max children per B-tree node = order-1
    private order: number;
    private root: BTreeNode<K, V>; // Root of the B-Tree
    private height: number; // Height of the B-Tree
    private size: number; // Size of B-Tree
    private keys: number[]; // An array of keys
    private children: Array<BTreeNode<K, V>>; // An array of child pointers

    // Empty B-Tree
    constructor(order: number = 4) {
        this.order = order;
        this.height = 0;
        this.size = 0;
        this.root = new BTreeNode<K, V>();
    }

    public isEmpty(): boolean {
        return this.size === 0;
    }

    public find(key: K): V[] {
        const entry = this.findEntry(this.root, key, this.height);

        if (entry == null) {
            return null;
        }

        return entry.values;
    }

    public findInRange(minKey: K, maxKey: K): V[] {
        const entries = this.findEntriesInRange(
            this.root,
            minKey,
            maxKey,
            this.height,
        );
        const values: V[] = [];

        for (const entry of entries) {
            values.push(...entry.values);
        }

        return values;
    }

    public put(key: K, value: V) {
        // Search for key
        const entry = this.findEntry(this.root, key, this.height);

        if (entry != null) {
            // Add new value to entry
            entry.values.push(value);
            return;
        }

        const node = this.insert(this.root, key, value, this.height);
        this.size++;

        if (node == null) {
            // No new node has been inserted
            return;
        }

        // New node has been inserted in root node
        const newRoot = new BTreeNode<K, V>();
        newRoot.children.push(
            new BTreeEntry<K, V>(this.root.children[0].key, null, this.root),
        );
        newRoot.children.push(
            new BTreeEntry<K, V>(node.children[0].key, null, node),
        );
        this.root = newRoot;
        this.height++;
    }

    private findEntriesInRange(
        node: BTreeNode<K, V>,
        minKey: K,
        maxKey: K,
        height: number,
    ): Array<BTreeEntry<K, V>> {
        const entries: Array<BTreeEntry<K, V>> = [];

        if (height === 0) {
            // External node (leaf)
            for (const child of node.children) {
                if (child.key >= minKey && child.key <= maxKey) {
                    entries.push(child);
                }
            }
        } else {
            // Internal node
            for (let i = 0; i < node.children.length; i++) {
                if (
                    (node.children.length === (i + 1)) ||
                    (minKey < node.children[i + 1].key)
                ) {
                    entries.push(...
                        this.findEntriesInRange(
                            node.children[i].next,
                            minKey,
                            maxKey,
                            height - 1,
                        ),
                    );
                }
            }
        }

        return entries;
    }

    private findEntry(
        node: BTreeNode<K, V>,
        key: K,
        height: number,
    ): BTreeEntry<K, V> {
        if (height === 0) {
            // External node (leaf)
            for (const child of node.children) {
                if (key === child.key) {
                    return child;
                }
            }
        } else {
            // Internal node
            for (let i = 0; i < node.children.length; i++) {
                if (
                    (node.children.length === (i + 1)) ||
                    (key < node.children[i + 1].key)
                ) {
                    return this.findEntry(
                        node.children[i].next,
                        key,
                        height - 1,
                    );
                }
            }
        }

        return null;
    }

    private insert(
        node: BTreeNode<K, V>,
        key: K,
        value: V,
        height: number,
    ): BTreeNode<K, V> {
        let insertIndex: number = 0;
        const newEntry = new BTreeEntry<K, V>(key, [value], null);

        if (height === 0) {
            // External node (leaf)
            for (let i = 0; i < node.children.length; i++) {
                insertIndex = i;

                if (key < node.children[i].key) {
                    break;
                }
            }
        } else {
            // Internal node
            for (let i = 0; i < node.children.length; i++) {
                if (
                    (node.children.length === (i + 1)) ||
                    (key < node.children[i + 1].key)
                ) {
                    insertIndex = i + 1;
                    const newNode = this.insert(
                        node.children[i].next,
                        key,
                        value,
                        height - 1,
                    );

                    if (newNode == null) {
                        return null;
                    }

                    newEntry.key = newNode.children[0].key;
                    newEntry.next = newNode;
                    break;
                }
            }
        }

        node.children.splice(insertIndex + 1, 0, newEntry);

        if (node.children.length < this.order) {
            return null;
        } else {
            // Node is too long so split it in 2 nodes
            return this.split(node);
        }
    }

    // split node in half
    private split(node: BTreeNode<K, V>): BTreeNode<K, V> {
        const newNode = new BTreeNode<K, V>();
        newNode.children = node.children.slice(
            this.order / 2,
            this.order,
        );
        node.children = node.children.slice(
            0,
            this.order / 2,
        );

        return newNode;
    }

    // private compare(k1: K, k2: K, op: Operator): boolean {
    //     // Equals
    //     if (op === Operator.EQ) {
    //         return k1 === k2;
    //     }

    //     // Greater
    //     if (op === Operator.EQ) {
    //         return k1 === k2;
    //     }

    //     // Greater or equals
    //     if (op === Operator.EQ) {
    //         return k1 === k2;
    //     }

    //     //
    //     if (op === Operator.EQ) {
    //         return k1 === k2;
    //     }

    //     if (op === Operator.EQ) {
    //         return k1 === k2;
    //     }

    //     return false;
    // }
}
