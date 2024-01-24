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
                <input type={inputType} onChange={handleInput} placeholder="Search..." />
                <select value={type} onChange={handleTypeChange}>
                    <option value="keywords">-</option>
                    <option value="author">Author</option>
                    <option value="title" >Title</option>
                    <option value="content" >Content</option>
                    <option value="date" >Date</option>
                </select>
                <select value={category} onChange={handleCategoryChange}>
                    <option value="">-</option>
                    <option value="">-Main categories-</option>
                    <option value="Category 1">Category 1</option>
                    <option value="Category 2" >Category 2</option>
                    <option value="Category 3" >Category 3</option>
                    <option value="Category 4" >Category 4</option>
                    <option value="Category 5" >Category 5</option>
                    <option value="">-Side categories-</option>
                    <option value="Side category 1">Side category 1</option>
                    <option value="Side category 2">Side category 2</option>
                    <option value="Side category 3">Side category 3</option>
                    <option value="Side category 4">Side category 4</option>
                    <option value="">-Off topic categories-</option>
                    <option value="Off topic category 1">Off topic category 1</option>
                    <option value="Off topic category 2">Off topic category 2</option>
                    <option value="Off topic category 3">Off topic category 3</option>
                </select>
                <Link to={{ pathname: '/search', search: search }}><input type="submit" value="Search" id="SearchButton" /></Link>
            </form>
        </>
    )
}