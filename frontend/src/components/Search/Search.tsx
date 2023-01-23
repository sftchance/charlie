import { useEffect, useState } from "react"

import "./Search.css"

const Search = ({ placeholder = "Wallet address...", icon = "🔍" }) => {
    const [search, setSearch] = useState("");

    const validSearch = search.length === 42 && search.startsWith("0x")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const input = e.currentTarget.querySelector("input") as HTMLInputElement
        const value = input.value

        if (value.length === 42 && value.startsWith("0x")) {
            window.location.href = `/account/${value}`
        }

        setSearch("")
    }

    return (
        <div className="search">
            <form onSubmit={handleSearch}>
                <div className={`status ${search.length === 0 ? "empty" : validSearch ? "valid" : "invalid"}`}></div>
                <input type="text" placeholder={placeholder} value={search} onChange={handleChange} />
                <button type="submit">
                    <span className="icon">{icon}</span>
                </button>
            </form>
        </div>
    )
}

export { Search }