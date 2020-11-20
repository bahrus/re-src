import { XtalDecor } from 'xtal-decor/xtal-decor.js';
import { define } from 'xtal-element/XtalElement.js';
var alreadyLoaded = new WeakMap();
export class TargetCaching extends XtalDecor {
    constructor() {
        super(...arguments);
        this.on = {
            click: ({ self }, e) => {
                if (e.timeStamp === this._lastTimestamp)
                    return;
                this._lastTimestamp = e.timeStamp;
                if (alreadyLoaded.has(e.target)) {
                    e.preventDefault();
                }
                else {
                    alreadyLoaded.set(e.target, true);
                }
                const hyper = e.target;
                if (hyper.target) {
                    const linkTarget = hyper.getRootNode().querySelector(`[name="${hyper.target}"]`);
                    if (linkTarget !== null) {
                        linkTarget.dataset.selected = '';
                    }
                }
            }
        };
        this.init = (h) => { };
        this.actions = [];
        this.upgrade = 'a';
        this.ifWantsToBe = 'target-caching';
        this._lastTimestamp = -1;
    }
}
TargetCaching.is = 'target-caching';
define(TargetCaching);
