import React from 'react'
interface DeleteButtonProps {
    deleting: boolean
    setDeleting: React.Dispatch<React.SetStateAction<boolean>>
    confirm: boolean
    setConfirm: React.Dispatch<React.SetStateAction<boolean>>
    handleDelete: () => void
}
export default function DeleteButton({ deleting, setDeleting, confirm, setConfirm, handleDelete }: DeleteButtonProps): JSX.Element {
    return (
        <>
            {
                !deleting ?
                    (
                        <button onClick={() => setDeleting(true)}>
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
                                                    handleDelete()
                                                }}>
                                                    Confirm
                                                </button>
                                                <button onClick={() => setDeleting(false)}>
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