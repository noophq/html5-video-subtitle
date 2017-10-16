import { BTreeNode } from "lib/btree/node";

export class BTreeEntry<K, V> {
    public key: K; // Key used for sort
    public values: V[]; // A same key can contain many values
    public next: BTreeNode<K, V>;     // helper field to iterate over array entries

    constructor(key: K, values: V[], next: BTreeNode<K, V>) {
        this.key  = key;
        this.values = values;
        this.next = next;
    }
}
