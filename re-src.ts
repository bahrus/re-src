import {XtalDecor, PropAction, propActions} from 'xtal-decor/xtal-decor.js';
import {define, AttributeProps} from 'xtal-element/XtalElement.js';

export function updateHash(key: string, val: string){
    const splitHash = location.hash.split(':~:');
    let hashChanged = false;
    let foundKey = false;
    splitHash.forEach((hash, idx) => {
        const splitEq = hash.split('=');
        if(splitEq.length === 2 && splitEq[0] === key){
            foundKey = true;
            if(splitEq[1] !== val){
                hashChanged = true;
                splitEq[1] = val;
                const newHash = splitEq.join('=');
                splitHash[idx] = newHash;
            } 
        }
    });
    if(hashChanged){
        location.hash = splitHash.join(':~:');
    }else if(!foundKey){
        location.hash += `:~:${key}=${val}`;
    }
}

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
                updateHash(target.target, target.getAttribute('href')!);
            }
        }
    }

    init = (h: HTMLElement) => {};
}
define(ReSrc);