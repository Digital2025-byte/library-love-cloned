import Link from 'next/link'
import React from 'react'

const ContactCard = ({ contact }) => {
    if (!contact) return null

    const { title, description, company, department, email, phone } = contact

    return (
        <div className='mt-8 rounded-xl bg-gradient-to-br from-[#F5F8FB] via-[#F8FAF9] to-[#FBF8F3] p-6 md:p-8 border border-gray-100'>
            <h3 className='text-xl md:text-lg font-medium text-primary-1 mb-3'>
                {title}
            </h3>
            <p className='text-[#364153] mb-4'>
                {description}
            </p>
            <div className='space-y-1 text-[#364153] mb-4'>
                <p className='font-bold text-[#364153]'>{company}</p>
                <p>{department}</p>
                <p>
                    Email:{' '}
                    <Link className=' hover:underline text-primary-1' href={`mailto:${email}`}>
                        {email}
                    </Link>
                </p>
                <p>
                    Phone:{' '}
                    <Link className=' hover:underline text-primary-1' href={`tel:${phone}`}>
                        {phone}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default ContactCard

