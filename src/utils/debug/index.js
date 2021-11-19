const myDebug = (fileName, args) => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log('\n')
    console.log('\x1b[41m%s\x1b[0m\x1b[44m%s\x1b[0m', 'Called in: ', fileName, time)
    args.map(arg =>
        console.log(arg)
    )
    console.log('\x1b[41m%s\x1b[0m', 'end call: ', fileName)
}

export default myDebug