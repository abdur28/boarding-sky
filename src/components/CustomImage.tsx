'use client'

import { CldImage } from "next-cloudinary"

const CustomImage = ({ src, alt, ...props }: any) => {
    return(
        <CldImage
        src={src}
        alt={alt}
        {...props}
        />
    )
}

export default CustomImage