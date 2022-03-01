import axios from "axios";

/**
 * スケール変更
 */
export function changeScale() {
    const base = {
        width: 1920,
        height: 1080
    };
    const scale = {
        width: window.innerWidth / base.width,
        height: window.innerHeight / base.height,
    };
    const currentScale = (scale.width < scale.height)
        ? scale.width
        : scale.height;
    const target = document.body;
    target.style.transform = 'scale(' + currentScale + ')';
    target.setAttribute('data-scale', String(currentScale))
    const style = document.createElement('style');
    style.id = 'changeScale';
    style.innerHTML = `
    html { width: auto; height: 100%; }
    body { transform-origin: 0 0; overflow: hidden; }
    #app .loading-mask { right: 0; bottom: 0; width: 100%; height: 100%; }
    `;
    document.body.appendChild(style);
}

// PHPなどのsleepと同じ。UI表示調整用
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function checkVersion() {
    const intervalTime = 1800000; // 30min
    let version: undefined | string;
    setInterval(async ()=> {
        try {
            const url = '/api/version';
            const result = (await axios.get<{ version: string; }>(url, { timeout: 60000 })).data;
            if (version === undefined) {
                version = result.version;
            }
            if (version !== result.version) {
                location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    }, intervalTime);
}
