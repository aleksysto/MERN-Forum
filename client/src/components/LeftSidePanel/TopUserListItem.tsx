import React from 'react'
import { TopUserListItemProps } from '../interfaces/User';
import DateCreator from '../DateCreator/DateCreator';
import { Link } from 'react-router-dom';

export default function TopUserListItem({ user, index }: TopUserListItemProps): JSX.Element {
    return (
        <>
            <li>
                <div className="TopUser">
                    <div className="TopUserImgName">
                        <Link to={{ pathname: `/` }}>
                            <div>
                                <img
                                    src={`http://localhost:4000/api/getImage/${user.profilePicture}`}
                                    alt=""
                                />
                            </div>
                            <div>
                                {user.login}
                            </div>
                        </Link>
                    </div>
                    <div>
                        {user.combinedActivity} entries
                    </div>
                    <div>
                        Of which: {user.posts} posts and {user.comments} comments
                    </div>
                    <div>
                        Member since: <DateCreator date={user.entryDate} />
                    </div>
                </div>
            </li>
        </>
    )
}