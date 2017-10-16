import { BTreeEntry } from "lib/btree/entry";

export class BTreeNode<K, V> {
    public children: Array<BTreeEntry<K, V>>; // Array of children

    // create a node
    constructor() {
        this.children = [];
    }
}
