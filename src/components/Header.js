import React from 'react'

const Header = ({ title, pageTitle }) => {
    return (
        <div className='bg-primary-subtle text-success-emphasis'>
            <div className="container-fluid">
                <div className='d-flex'>
                    <div className='flex-grow-1 p-2'>
                        <h1 className="mt-2">ScoreZone</h1>
                    </div>
                    <div className='p-2'>
                        <ol className="breadcrumb mt-4">
                            <li className="breadcrumb-item active">{title}</li>
                            <li className="breadcrumb-item active">{pageTitle}</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header