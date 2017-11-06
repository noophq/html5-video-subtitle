/*
 *  This file is part of the NOOP organization .
 *
 *  (c) Cyrille Lebeaupin <clebeaupin@noop.fr>
 *
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 */

import { BTreeEntry } from "lib/btree/entry";

export class BTreeNode<K, V> {
    public children: Array<BTreeEntry<K, V>>; // Array of children

    // create a node
    constructor() {
        this.children = [];
    }
}
