import React from 'react';

export default function Tooltip({ text, children, position = 'top' }) {
  const positionClasses = 
    position === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' :
    position === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' :
    position === 'right' ? 'left-full ml-2 top-1/2 -translate-y-1/2' :
    'bottom-full mb-2 left-1/2 -translate-x-1/2'; // default top

  const arrowClasses = 
    position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 border-x-transparent border-t-transparent' :
    position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 border-y-transparent border-r-transparent' :
    position === 'right' ? 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 border-y-transparent border-l-transparent' :
    'top-full left-1/2 -translate-x-1/2 border-t-slate-900 border-x-transparent border-b-transparent';

  return (
    <div className="relative group inline-block w-full">
      {children}
      
      {/* Floating Tooltip Box */}
      <div className={`absolute z-50 ${positionClasses} hidden group-hover:block w-56 p-2.5 bg-slate-900 text-white text-[11px] font-sans font-normal leading-tight rounded-md shadow-xl border border-slate-700 pointer-events-none transition-all duration-200`}>
        {text}
        {/* Tooltip Arrow */}
        <div className={`absolute w-0 h-0 border-4 ${arrowClasses}`} />
      </div>
    </div>
  );
}
