'use client';
import React from 'react';

const THEMES = {
    info: { bg: 'bg-[#EAF2F6]', bar: 'bg-[#0B4572]', fg: 'text-[#0B4572]' },
    success: { bg: 'bg-green-50', bar: 'bg-green-700', fg: 'text-green-800' },
    warning: { bg: 'bg-amber-50', bar: 'bg-amber-700', fg: 'text-amber-800' },
    error: { bg: 'bg-red-50', bar: 'bg-red-700', fg: 'text-red-800' },
    secondary: { bg: 'bg-[#baa98121]', bar: 'bg-[#baa981]', fg: 'text-[#364153]' },
};



const Alert = ({
    message = 'Please notice that Extra baggage is non-refundable once purchased.',
    variant = 'secondary',
    className = '',
}) => {
    const theme = THEMES[variant] ?? THEMES.info;

    return (
        <div className={` relative overflow-hidden rounded-lg   ${theme.bg} ${theme.fg} ${className}`}>
            {/* left accent */}
            <div className={`absolute left-0 top-0 h-full w-[5px] ${theme.bar}`} />

            {/* content */}
            <div className="px-0 py-4 ">
                <div className="flex items-center lg:items-center gap-1 ">
                    {/* icon chip */}
                    <div
                        className={`   rounded-full ml-2 `}
                        aria-hidden="true"
                    >
                        {/* Use non-fill so we don't render a second inner circle */}
                        {/* <Info size={isMob ? 24 : 22} weight="fill" className="text-primary-1 leading-none" /> */}
                    </div>

                    <p className="text-sm sm:text-base font-regular leading-snug">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Alert;
