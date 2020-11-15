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
            updateHistory(link, location.hash);
        }
    });
}
export function updateHistory(target, newHash) {
    const historyCopy = history.state === null ? {} : { ...history.state };
    if (historyCopy.reSrc === undefined)
        historyCopy.reSrc = {};
    const reSrc = historyCopy.reSrc;
    const newObj = { ...target.dataset };
    newObj.textContent = target.textContent;
    reSrc[target.target] = newObj;
    history.replaceState(historyCopy, '', newHash);
}
export function updateHash(key, val, target) {
    let hash = location.hash;
    if (hash.startsWith('#'))
        hash = hash.substr(1);
    const splitHash = hash.split(delimiter);
    let hashChanged = false;
    let foundKey = false;
    splitHash.forEach((hash, idx) => {
        const splitEqOuter = hash.split('=');
        if (splitEqOuter.length === 2 && splitEqOuter[0] === 're-src') {
            const splitColon = splitEqOuter[1].split(':');
            if (splitColon.length === 2 && splitColon[0] === key) {
                foundKey = true;
                if (splitColon[1] !== val) {
                    hashChanged = true;
                    splitColon[1] = val;
                    splitEqOuter[1] = splitColon.join(':');
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
            updateHistory(target, newHash);
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
                    updateHash(target.target, target.getAttribute('href'), target);
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
