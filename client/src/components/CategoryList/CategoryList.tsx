import React, { useEffect, useRef } from 'react'
import CategoryListItem from './CategoryListItem'

//, 'category3', 'category4', 'category5'
const categoryList: Array<string> = ['category', 'test']
export default function CategoryList(): JSX.Element {

    return (
        <>
            <div>
                <ul>
                    {categoryList.map((category: string, index: number) => {
                        return (
                            <CategoryListItem category={category} index={index} key={index} />
                        )
                    })}
                </ul>
            </div>
        </>
    )
}