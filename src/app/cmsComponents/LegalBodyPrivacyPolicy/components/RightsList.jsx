import React from 'react'
import { Check, CheckFat } from '@phosphor-icons/react/dist/ssr'

const RightsList = ({ title, description, items }) => {
    return (
        <div className='mb-8'>
            {title && (
                <h2 className='text-2xl md:text-2xl font-semibold text-primary-1 mb-4'>
                    {title}
                </h2>
            )}
            {description && (
                <p className='text-[#364153] mb-6'>
                    {description}
                </p>
            )}
            {items && items.length > 0 && (
                <div className='space-y-4'>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className='bg-[#F9FAFB] rounded-[14px] p-4 md:p-6 flex items-start gap-4 '
                        >
                            <div className='w-10 h-10 rounded-full bg-[#054e721f] flex items-center justify-center flex-shrink-0'>
                                <Check weight='bold'  size={20}  className='text-primary-1' />
                            </div>
                            <p className='text-[#364153] text-base md:text-base leading-relaxed pt-1.5'>
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RightsList

