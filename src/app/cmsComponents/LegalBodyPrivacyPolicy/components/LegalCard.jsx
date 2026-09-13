import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import React from 'react'
import Link from 'next/link'
// import { Shield, Cookie, FileText, ArrowRight } from '@phosphor-icons/react'

const LegalCard = ({ title, description, icon: Icon, link }) => {
    return (
        <div className='bg-primary-1 rounded-2xl p-6 md:p-8 flex flex-col h-full'>
            {/* Icon */}
            <div className='mb-4'>
                <div className='w-14 h-14 md:w-18 md:h-18  bg-white rounded-2xl flex items-center justify-center'>
                    <Icon size={44}  className='text-primary-1 ' />
                </div>
            </div>
            
            {/* Title */}
            <h3 className='text-xl md:text-2xl font-semibold mb-3 text-primary-2'>
                {title}
            </h3>
            
            {/* Description */}
            <p className='text-[var(--bg-50)] mb-6 flex-grow'>
                {description}
            </p>
            
            {/* Read more link */}
            <Link 
                href={link} 
                className='text-white flex items-center gap-2 hover:gap-3 transition-all group mt-auto'
            >
                <span>Read more</span>
                <ArrowRight size={20} className='group-hover:translate-x-1 transition-transform' />
            </Link>
        </div>
    )
}

export default LegalCard

