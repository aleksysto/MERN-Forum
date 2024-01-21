import React, { useEffect, useRef } from 'react'
import CategoryListItem from './CategoryListItem'

//, 'category3', 'category4', 'category5'
const mainCategoryList: Array<string> = ['category1', 'test', 'category2', 'category3', 'category4', 'category5']
const sideCategoryList: Array<string> = ['sideCategory1', 'sideCategory2', 'sideCategory3', 'sideCategory4']
const offTopicCategoryList: Array<string> = ['offTopicCategory1', 'offTopicCategory2', 'offTopicCategory3']
export default function CategoryList(): JSX.Element {

    return (
        <>
            <div className="CategoryList">
                <ul>
                    <li className="CategoryHeader">Main categories</li>
                    {mainCategoryList.map((category: string, index: number) => {
                        return (
                            <CategoryListItem category={category} index={index} key={index} />
                        )
                    })}
                </ul>
                <ul>
                    <li className="CategoryHeader">Side categories</li>
                    {sideCategoryList.map((category: string, index: number) => {
                        return (
                            <CategoryListItem category={category} index={index} key={index} />
                        )
                    })}
                </ul>
                <ul>
                    <li className="CategoryHeader">Off topic categories</li>
                    {offTopicCategoryList.map((category: string, index: number) => {
                        return (
                            <CategoryListItem category={category} index={index} key={index} />
                        )
                    })}
                </ul>
            </div>
        </>
    )
}