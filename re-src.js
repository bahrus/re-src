import { XtalDecor } from 'xtal-decor/xtal-decor.js';
import { define } from 'xtal-element/XtalElement.js';
export class ReSrc extends XtalDecor {
    constructor() {
        super(...arguments);
        this.ifWantsToBe = 'persistable';
        this.actions = [];
        this.upgrade = 'nav';
        this._lastTimeStamp = 0;
        this.capture = {
            click: ({ self }, e) => {
                if (e.timeStamp === this._lastTimeStamp)
                    return;
                const target = e.target;
                if (target.localName !== 'a' || !target.target)
                    return;
                let root = this.getRootNode();
                const iframe = root.querySelector(`iframe[name="${target.target}"]`);
                if (iframe !== null) {
                    debugger;
                }
            }
        };
        this.init = (h) => {
            debugger;
        };
    }
}
ReSrc.is = 're-src';
define(ReSrc);
