import { XtalDecor } from 'xtal-decor/xtal-decor.js';
import { define } from 'xtal-element/XtalElement.js';
const delimiter = ':-:';
export function initIFrames(h) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', e => {
            initIFrames2(h);
        });
        return;
    }
    initIFrames2(h);
}
export function initIFrames2(h) {
    const splitHash = location.hash.split(delimiter);
    splitHash.forEach(hash => {
        const splitEq = hash.split('=');
        if (splitEq.length === 2 && splitEq[0] === 're-src') {
            const splitColon = splitEq[1].split(':');
            const targetName = splitColon[0];
            const href = splitColon[1];
            const link = h.querySelector(`a[target="${targetName}"][href="${href}"]`);
            if (link === null)
                return;
            if (splitColon.length === 2) {
                const iframe = h.getRootNode().querySelector(`iframe[name="${targetName}"]`);
                if (iframe == null)
                    return;
                iframe.src = href;
            }
        }
    });
}
export function updateHash(key, val) {
    let hash = location.hash;
    if (hash.startsWith('#'))
        hash = hash.substr(1);
    const splitHash = hash.split(delimiter);
    let hashChanged = false;
    let foundKey = false;
    splitHash.forEach((hash, idx) => {
        const splitEqOuter = hash.split('=');
        if (splitEqOuter.length === 2 && splitEqOuter[0] === 're-src') {
            const splitEq = splitEqOuter[1].split(':');
            if (splitEq.length === 2 && splitEq[0] === key) {
                foundKey = true;
                if (splitEq[1] !== val) {
                    hashChanged = true;
                    splitEq[1] = val;
                    splitEqOuter[1] = splitEq.join(':');
                    const newHash = splitEqOuter.join('=');
                    splitHash[idx] = newHash;
                }
            }
        }
    });
    let newHash = undefined;
    if (hashChanged) {
        newHash = '#' + splitHash.join(delimiter);
    }
    else if (!foundKey) {
        const separator = location.hash.length > 1 ? '&' : '#';
        newHash = location.hash + `${separator}${delimiter}re-src=${key}:${val}`;
    }
    if (newHash !== undefined) {
        setTimeout(() => {
            history.replaceState(history.state, '', newHash);
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
        this.init = (h) => {
            initIFrames(h);
        };
    }
}
ReSrc.is = 're-src';
define(ReSrc);
