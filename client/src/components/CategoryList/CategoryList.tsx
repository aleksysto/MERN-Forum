import React from 'react'
import CategoryListItem from './CategoryListItem'

const mainCategoryList: Array<string> = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 5']
const sideCategoryList: Array<string> = ['Side category 1', 'Side category 2', 'Side category 3', 'Side category 4']
const offTopicCategoryList: Array<string> = ['Off topic category 1', 'Off topic category 2', 'Off topic category 3']
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