import {XtalDecor, PropAction, propActions} from 'xtal-decor/xtal-decor.js';
import {define, AttributeProps} from 'xtal-element/XtalElement.js';

const delimiter = ':-:';

export function initIFrames(h: HTMLElement){
    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', e => {
            initIFrames2(h);
        });
        return;
    }
    initIFrames2(h);
}

export function initIFrames2(h: HTMLElement){
    const splitHash = location.hash.split(delimiter);
    splitHash.forEach(hash => {
        const splitEq = hash.split('=');
        if(splitEq.length === 2 && splitEq[0] === 're-src'){
            const splitColon = splitEq[1].split(':');
            const targetName = splitColon[0];
            const href = splitColon[1];
            const link = h.querySelector(`a[target="${targetName}"][href="${href}"]`);
            if(link === null) return;
            if(splitColon.length === 2){
                const iframe = (h.getRootNode() as HTMLElement).querySelector(`iframe[name="${targetName}"]`) as HTMLIFrameElement;
                if(iframe == null) return;
                iframe.src = href;
            }
            updateHistory(link as HTMLAnchorElement, location.hash);
        }
    })
}

export function updateHistory(target: HTMLAnchorElement, newHash: string){
    const historyCopy = history.state === null ? {} :  {...history.state};
    if(historyCopy.reSrc === undefined) historyCopy.reSrc = {};
    const reSrc = historyCopy.reSrc;
    const newObj = {...target.dataset} as any;
    newObj.textContent = target.textContent!;
    reSrc[target.target!] = newObj;
    history.replaceState(historyCopy, '', newHash);
}

export function updateHash(key: string, val: string, target: HTMLAnchorElement){
    let hash = location.hash;
    if(hash.startsWith('#')) hash = hash.substr(1);
    const splitHash = hash.split(delimiter);
    let hashChanged = false;
    let foundKey = false;
    splitHash.forEach((hash, idx) => {
        const splitEqOuter = hash.split('=');
        if(splitEqOuter.length === 2 && splitEqOuter[0] === 're-src'){
            const splitColon = splitEqOuter[1].split(':');
            if(splitColon.length === 2 && splitColon[0] === key){
                foundKey = true;
                if(splitColon[1] !== val){
                    hashChanged = true;
                    splitColon[1] = val;
                    splitEqOuter[1] = splitColon.join(':');
                    const newHash = splitEqOuter.join('=');
                    splitHash[idx] = newHash;
                } 
            }
        }
        
    });
    let newHash: string | undefined = undefined;
    if(hashChanged){
        newHash = '#' + splitHash.join(delimiter);
    }else if(!foundKey){
        const separator = location.hash.length > 1 ? '&' : '#';
        newHash = location.hash + `${separator}${delimiter}re-src=${key}:${val}`;
    }
    if(newHash !== undefined){
        setTimeout(() =>{
            updateHistory(target, newHash!);
            
        }, 100)
        
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
                updateHash(target.target, target.getAttribute('href')!, target);
            }
        }
    }

    init = (h: HTMLElement) => {
        initIFrames(h);
    };
}
define(ReSrc);