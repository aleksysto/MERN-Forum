import React, { useEffect, useRef } from 'react'
import CategoryListItem from './CategoryListItem'
const categoryList: Array<string> = ['category', 'test', 'category3', 'category4', 'category5']
export default function CategoryList(): JSX.Element {

    return (
        <>
            <div>
                <ul>
                    {categoryList.map((category: string, index: number) => {
                        return (
                            <CategoryListItem category={category} index={index}/>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}