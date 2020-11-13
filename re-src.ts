import {XtalDecor, PropAction, propActions} from 'xtal-decor/xtal-decor.js';
import {define, AttributeProps} from 'xtal-element/XtalElement.js';

export class ReSrc extends XtalDecor {
    static is = 're-src';

    ifWantsToBe = 'persistable';
    actions = [];
    upgrade = 'nav';
    _lastTimeStamp = 0;

    capture = {
        click: ({self}: XtalDecor, e: Event) => {
            if(e.timeStamp === this._lastTimeStamp) return;
            const target = e.target as HTMLAnchorElement;
            if(target.localName !== 'a' || !target.target) return;
            let root = this.getRootNode() as HTMLElement;
            const iframe = root.querySelector(`iframe[name="${target.target}"]`)
            if(iframe !== null){
                debugger;
            }
        }
    }

    init = (h: HTMLElement) => {
        debugger;
    };
}
define(ReSrc);