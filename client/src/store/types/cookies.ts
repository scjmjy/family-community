export default class Cookies {
    // private cookies = new Map<string, string>()
    static getCookie (key: string) {
        return Cookies.getCookiesMap().get(key)
    }

    static getCookiesMap () {
        const cookies = new Map<string, string>()
        const all = document.cookie
        const list = all.split('; ')
        for (const cookie of list) {
            if (!cookie.includes('=')) continue
            const p = cookie.indexOf('=')
            const name = cookie.substring(0, p).trim()
            let value = cookie.substring(p + 1).trim()
            value = decodeURIComponent(value)
            cookies.set(name, value)
        }
        return cookies
    }
}
