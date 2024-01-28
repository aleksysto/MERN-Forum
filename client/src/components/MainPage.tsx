import React from 'react';
import CategoryList from './CategoryList/CategoryList';
import RandomPost from './RandomPost/RandomPost';
export default function MainPage(): JSX.Element {

    return (
        <>
            <RandomPost />
            <CategoryList />
        </>
    )
}