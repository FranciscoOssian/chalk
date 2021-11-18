const myDebug = (fileName, args) => {
    console.log('\n')
    console.log('\x1b[41m%s\x1b[0m\x1b[44m%s\x1b[0m', 'Called in: ', fileName)
    args.map(arg =>
        console.log(arg)
    )
    console.log('\x1b[41m%s\x1b[0m', 'end call')
}

export default myDebug