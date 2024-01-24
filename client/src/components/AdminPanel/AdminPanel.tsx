import React, { useState } from 'react'
import CurrentList from './CurrentList'
export default function AdminPanel(): JSX.Element {
    const [select, setSelect] = useState<string>('reported')
    function handleSelect(e: React.ChangeEvent<HTMLSelectElement>): void {
        e.preventDefault()
        setSelect(e.target.value)
    }
    return (
        <>
            <div className="AdminPanel">
                <div>
                    <select value={select} onChange={handleSelect}>
                        <option value="posts" >Posts</option>
                        <option value="comments" >Comments </option>
                        <option value="users" >Users</option>
                        <option value="reported" >Reported</option>
                    </select>
                </div>
                <div>
                    <CurrentList select={select} />
                </div>
            </div>
        </>
    )
}