import React, { DetailedHTMLProps, HTMLAttributes } from 'react'

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    step: 1 | 2 | 3
}
const Steps = React.forwardRef<unknown, Props>(({ step }, _ref) => {
    return (
        <div className='pt-8'>
            <svg className="hidden md:block mx-auto " width="368" viewBox="0 0 368 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="4" rx="2" fill="#726DF9" />
                <rect x="124" width="120" height="4" rx="2" fill={step === 1 ? "#F2F2F2" : "#726DF9"} />
                <rect x="248" width="120" height="4" rx="2" fill={step === 3 ? "#726DF9" : "#F2F2F2"} />
            </svg>
            <svg className=' md:hidden mx-auto ' width="220" height="4" viewBox="0 0 220 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="70.6667" height="4" rx="2" fill="#726DF9" />
                <rect x="74.668" width="70.6667" height="4" rx="2" fill={step === 1 ? "#F2F2F2" : "#726DF9"} />
                <rect x="149.332" width="70.6667" height="4" rx="2" fill={step === 3 ? "#726DF9" : "#F2F2F2"} />
            </svg>
        </div>
    )
})
Steps.displayName = 'Steps'
export default Steps