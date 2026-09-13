import React from 'react'

const Chip = ({ children, className = '' }) => {
    return (
        <span className={`inline-block px-4 py-2 bg-[#054e721f]   rounded-full text-sm font-medium ${className}`}>
            <span className='text-primary-1 text-xs md:text-sm font-bold'>Effective Date: </span>
            <span className='text-primary-1 text-xs md:text-sm font-regular'>{children}</span>
        </span>
    )
}

export default Chip

