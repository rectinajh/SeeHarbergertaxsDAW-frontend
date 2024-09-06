import blockies from 'ethereum-blockies';
import { useEnsAvatar } from 'wagmi'
import { normalize } from 'viem/ens'
// import { Image } from 'antd';
import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';
import useDomAlready from '@/hooks/useDomAlready';
import React from 'react';

const Avatar = React.forwardRef(({ address, className }: { address: string, className?: string }, _) => {

    const { documentMouned } = useDomAlready()

    const result = useEnsAvatar({
        name: normalize(address),
    })
    const imgSrc = useMemo(() => {
        if (address && documentMouned) {
            blockies.create({ seed: address.toLowerCase() }).toDataURL()
            return blockies.create({ seed: address.toLowerCase() }).toDataURL()
        } else {
            return ""
        }
    }, [address, documentMouned])
    return <>
        <Image width={10} height={10} className={`rounded-full ${className}`} src={result.data || imgSrc || '/icons/avatarerr.svg'} alt={'avar'}></Image>
    </>
})

Avatar.displayName = "Avatar"
export default Avatar