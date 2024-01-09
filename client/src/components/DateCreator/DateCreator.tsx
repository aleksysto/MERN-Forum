import React from 'react'

export default function DateCreator({ date }: { date: Date }): JSX.Element {
    const printDate: string = `${date.toString().split('T')[0]} ${date.toString().split('T')[1].split('.')[0]}`
    return (
        <>
            {printDate}
        </>
    )
}