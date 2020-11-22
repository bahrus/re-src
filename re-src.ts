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
    const splitHash = location.hash.split(delimiter).map(s => {
        return s.endsWith('&') ? s.substr(0, s.length - 1) : s
    });
    splitHash.forEach(hash => {
        const splitEq = hash.split('=');
        if(splitEq.length === 2){
            const splitColon = splitEq[1].split(':');
            const key = splitColon[0];
            const val = splitColon[1];
            switch(splitEq[0]){
                case 're-src':{
                        const link = h.querySelector(`a[target="${key}"][href="${val}"]`) as HTMLAnchorElement;
                        if(link === null) return;
                        link.click();
                        updateHistory(link as HTMLAnchorElement, location.hash);
                    }
                    break;
                case 're-src-grp':{
                    //debugger;
                    const iframe = (h.getRootNode() as DocumentFragment).querySelector(`iframe[name="${val}"]`) as HTMLIFrameElement;
                    if(iframe !== null){
                        iframe.dataset.selected = '';
                    }
                }
                break;
            }
        }
        if(splitEq.length === 2 && splitEq[0] === 're-src'){
            
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

export function updateHash(key: string, val: string, target: HTMLAnchorElement, group: string | undefined){
    let hash = location.hash;
    if(hash.startsWith('#')) hash = hash.substr(1);
    const splitHash = hash.split(delimiter);
    let hashChanged = false;
    let foundKey = false;
    let foundGroupKey = false;
    splitHash.forEach((hash, idx) => {
        const splitEqOuter = hash.split('=');
        if(splitEqOuter.length === 2){
            const splitColon = splitEqOuter[1].split(':');
            switch(splitEqOuter[0]){
                case 're-src':{
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
                break;
                case 're-src-grp':{
                    if(splitColon.length === 2 && splitColon[0] === group){
                        foundGroupKey = true;
                        debugger;
                        if(splitColon[1] !== key){
                            hashChanged = true;
                            splitColon[1] = key;
                            splitEqOuter[1] = splitColon.join(':');
                            const newHash = splitEqOuter.join('=');
                            splitHash[idx] = newHash;
                        }
                    }
                }
                break;

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
    if(group !== undefined && !foundGroupKey){
        if(newHash === undefined) newHash = '#';
        const separator = newHash.length > 1 ? '&' : '#';
        newHash = newHash + `${separator}${delimiter}re-src-grp=${group}:${target.target}`;
    }
    if(newHash !== undefined){
        setTimeout(() =>{
            updateHistory(target, newHash!);
            
        }, 100);
        
    }
}

export class ReSrc extends XtalDecor {
    static is = 're-src';

    ifWantsToBe = 'persistable';
    actions = [];
    upgrade = 'nav';
    _lastTimeStamp = 0;

    capture = {
        click: ({self}: any, e: Event) => {
            if(e.timeStamp === this._lastTimeStamp) return;
            this._lastTimeStamp = e.timeStamp;
            const target = e.target as HTMLAnchorElement;
            if(target.localName !== 'a' || !target.target) return;
            let root = this.getRootNode() as HTMLElement;
            const iframe = root.querySelector(`iframe[name="${target.target}"]`)
            if(iframe !== null){
                updateHash(target.target, target.getAttribute('href')!, target, self.group);
            }
        }
    }

    init = (h: HTMLElement) => {
        initIFrames(h);
    };
}
define(ReSrc);