import React from 'react'
interface DeleteButtonProps {
    action: boolean
    setAction: React.Dispatch<React.SetStateAction<boolean>>
    confirm: boolean
    setConfirm: React.Dispatch<React.SetStateAction<boolean>>
    handleAction: () => void
}
export default function DeleteButton({ action, setAction, confirm, setConfirm, handleAction }: DeleteButtonProps): JSX.Element {
    return (
        <>
            {
                !action ?
                    (
                        <button onClick={() => setAction(true)}>
                            Delete
                        </button>
                    ) : (
                        <>
                            <div>
                                {
                                    !confirm ?
                                        (
                                            <>
                                                <div>
                                                    Are you sure?
                                                </div>
                                                <button onClick={() => {
                                                    setConfirm(true)
                                                    handleAction()
                                                }}>
                                                    Confirm
                                                </button>
                                                <button onClick={() => setAction(false)}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    Deleting...
                                                </div>
                                            </>
                                        )
                                }
                            </div>
                        </>
                    )
            }
        </>
    )
}