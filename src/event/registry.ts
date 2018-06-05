/*
 *  This file is part of the NOOP organization .
 *
 *  (c) Cyrille Lebeaupin <clebeaupin@noop.fr>
 *
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 */

export interface EventListener {
    target: any;
    eventType: string;
    listener: any;
}

export class EventRegistry {
    private eventListeners: EventListener[];

    constructor() {
        this.eventListeners = [];
    }

    public register(target: any, eventType: string, listener: any) {
        this.eventListeners.push({
            target,
            eventType,
            listener,
        });
        target.addEventListener(eventType, listener);
    }

    public unregister(eventType: string) {
        this.eventListeners.forEach((eventListener) => {
            if (eventListener.eventType !== eventType) {
                return;
            }

            eventListener.target.removeEventListener(
                eventListener.eventType,
                eventListener.listener,
            );
        });
        this.eventListeners.filter((eventListener) => {
            return (eventListener.eventType !== eventType);
        });
    }

    public unregisterAll() {
        this.eventListeners.forEach((eventListener) => {
            eventListener.target.removeEventListener(
                eventListener.eventType,
                eventListener.listener,
            );
        });
        this.eventListeners = [];
    }
}
