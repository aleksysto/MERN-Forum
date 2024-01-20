import React from 'react'
import { TopUserListItemProps } from '../interfaces/User';
import DateCreator from '../DateCreator/DateCreator';

export default function TopUserListItem({ user, index }: TopUserListItemProps): JSX.Element {
    return (
        <>
            <li>
                <div>
                    <div>
                        <img
                            src={`http://localhost:4000/api/getImage/${user.profilePicture}`}
                            alt="" style={{ width: '50px', height: '50px' }}
                        />
                    </div>
                    <div>
                        {user.login}
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