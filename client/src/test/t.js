function create () {
    const p = new Promise((resolve, reject) => {
        let count = 1
        let tid = 0
        tid = setInterval(() => {
            if (count === 1) {
                clearInterval(tid)
                reject(new Error('timeout'))
            } else {
                resolve(count++)
            }
        }, 2000)
        // throw new Error('I am a error')
    })
    return p
}

(async () => {
    const result = await create().then(r => console.log(`fullfilled ${r}`)).catch(err => console.log('#########' + err.message))
    console.log('~~' + result)
})()
