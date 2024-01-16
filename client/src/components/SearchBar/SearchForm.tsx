import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function SearchForm() {
    const [type, setType] = useState<string>('')
    const [category, setCategory] = useState<string>('')
    const [inputType, setInputType] = useState<string>('')
    const [input, setInput] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        (e.target.value === "date") ? setInputType("date") : setInputType("text")
        setType(e.target.value)
    }
    function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        setCategory(e.target.value)
    }
    function handleInput(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault()
        setInput(e.target.value)
    }
    function handleSearchChange(): void {
        switch (type) {
            case "author":
                setSearch(`?field=${type}&q=${input}&category=${category}`)
                break
            case "title":
                setSearch(`?field=${type}&q=${input}&category=${category}`)
                break
            case "content":
                setSearch(`?field=${type}&q=${input}&category=${category}`)
                break
            case "date":
                setSearch(`?field=${type}&q=${input}&category=${category}`)
                break
            default:
                setSearch(`?keywords=${input}&category=${category}`)
        }
    }
    useEffect(() => {
        handleSearchChange()
    })
    return (
        <>
            <form>
                <input type={inputType} onChange={handleInput} />
                <select value={type} onChange={handleTypeChange}>
                    <option value="keywords">-</option>
                    <option value="author">Author</option>
                    <option value="title" >Title</option>
                    <option value="content" >Content</option>
                    <option value="date" >Date</option>
                </select>
                <select value={category} onChange={handleCategoryChange}>
                    <option value="">-</option>
                    <option value="category">Category</option>
                    <option value="test">Test</option>
                    <option value="category2" >Category2</option>
                    <option value="category3" >Category3</option>
                    <option value="category4" >Category4</option>
                </select>
                <Link to={{ pathname: '/search', search: search }}><input type="submit" value="Search" /></Link>
            </form>
        </>
    )
}