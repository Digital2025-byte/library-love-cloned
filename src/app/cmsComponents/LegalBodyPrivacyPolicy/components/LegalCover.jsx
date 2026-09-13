import React from 'react'
import Image from 'next/image'
import pattern from "@/assets/legal/pattern.webp";

const LegalCover = ({ title, description }) => {
    return (
        <div className='relative w-full h-96 bg-gradient-to-b from-[#054E72] to-[#00253C] overflow-hidden'>
            {/* Pattern overlay on the right side */}
            <div className='hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 opacity-50'>
                <Image
                    src={pattern}
                    alt='Pattern'
                    fill
                    className='object-cover object-right'
                />
            </div>
            
            {/* Content overlay */}
            <div className='absolute inset-0 flex flex-col items-center justify-center text-white z-10'>
                <h1 className='text-4xl md:text-6xl font-semibold mb-4 text-center'>
                    {title}
                </h1>
                <p className='text-lg md:text-lg text-center max-w-4xl px-4'>
                    {description}
                </p>
            </div>
        </div>
    )
}

export default LegalCover