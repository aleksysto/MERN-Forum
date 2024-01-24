import React, { useState } from 'react'

export default function SortSelection({ setOrder }: { setOrder: (value: string) => void }) {
    const [select, setSelect] = useState<string>('-')
    function handleOrderChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        e.preventDefault()
        setOrder(e.target.value)
        setSelect(e.target.value)
    }
    return (
        <select value={select} onChange={handleOrderChange}>
            <option value="">-</option>
            <option value="authorDesc" >Author &uarr;</option>
            <option value="authorAsc">Author &darr; </option>
            <option value="dateDesc" >Date &uarr;</option>
            <option value="dateAsc" >Date &darr;</option>
        </select>
    )
}