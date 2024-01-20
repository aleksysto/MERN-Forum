import React from 'react'
import { Link } from 'react-router-dom'

export default function AccountButton() {
    return (
        <>
            <Link to={{ pathname: '/account' }}>
                <button>
                    Account
                </button>
            </Link>
        </>
    )
}