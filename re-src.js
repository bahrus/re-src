import { XtalDecor } from 'xtal-decor/xtal-decor.js';
import { define } from 'xtal-element/XtalElement.js';
export function updateHash(key, val) {
    const splitHash = location.hash.split(':~:');
    let hashChanged = false;
    let foundKey = false;
    splitHash.forEach((hash, idx) => {
        const splitEq = hash.split('=');
        if (splitEq.length === 2 && splitEq[0] === key) {
            foundKey = true;
            if (splitEq[1] !== val) {
                hashChanged = true;
                splitEq[1] = val;
                const newHash = splitEq.join('=');
                splitHash[idx] = newHash;
            }
        }
    });
    let newHash = undefined;
    if (hashChanged) {
        newHash = splitHash.join(':~:');
    }
    else if (!foundKey) {
        newHash = location.hash + `:~:${key}=${val}`;
    }
    if (newHash !== undefined) {
        setTimeout(() => {
            history.replaceState(history.state, '', '#' + newHash);
        }, 100);
    }
}
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
                    updateHash(target.target, target.getAttribute('href'));
                }
            }
        };
        this.init = (h) => { };
    }
}
ReSrc.is = 're-src';
define(ReSrc);
