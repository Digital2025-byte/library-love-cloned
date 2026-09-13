import React from 'react';

const CardInfo = ({ title, description, className }) => {
    if (!title && !description) return null;

    const shouldApplyClassName = title === 'Changes to Terms';

    return (
        <div className={`rounded-[14px] border border-[#F3F4F6] bg-gradient-to-br from-[#F9FAFB]  to-[#FFFF] p-5 md:p-6 ${shouldApplyClassName ? className : ''}`}>
            {title && (
                <h3 className="text-primary-1 text-lg font-medium mb-2">
                    {title}
                </h3>
            )}
            {description && (
                <p className="text-[#364153] text-base md:text-base leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
};

export default CardInfo;

