import React, { useState } from 'react'

const useArray = (init) => {
    const [array, setArray] = useState(init);
    return [
        array,
        setArray,
        v => {
            setValue( previus => [...previus, v] )
        },
        () => setValue( [] ),
        index => {
            setValue(
                previus => previus.filter( (value , i) => i === index )
            )
        },
        val => {
            setValue(
                previus => previus.filter( (value , i) => value === val )
            )
        },
    ]
}

export default useArray

//wrong