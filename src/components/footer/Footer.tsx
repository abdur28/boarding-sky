import Image from 'next/image';
import Link from 'next/link';
import Button from '../Button';
import { getInfo } from '../../lib/data';

export default async function FooterSection(){
    const info = await getInfo() 

    return (
        <footer className="border-b h-full w-full bg-fourth pt-10">
            <div className="md:px-20 h-full w-full px-10">
                <div className="flex gap-12 flex-col md:flex-row ">
                    <div className="flex flex-col lg:w-1/5 w-full">
                        <div className='flex h-full w-full flex-col  items-start '>
                            <Link href="/" aria-label="go home" className="block size-fit">
                                <Image 
                                src="/logo_name.png" 
                                alt="logo" 
                                width={120}
                                height={120}
                                className=''
                                />
                            </Link>
                            <p className="mt-6 text-sm text-body text-black/70">
                            {info?.footerPageText} 
                            </p>
                        </div>
                    </div>

                    <div className="flex lg:w-[55%] md:w-[40%] justify-between md:justify-end w-full gap-16">
                        <div className="space-y-4 text-sm">
                            <span className="text-title font-medium text-lg">Booking</span>
                            <Link href="/flight" className="text-body block hover:text-title">
                                <span>Book Flight</span>
                            </Link>
                            <Link href="/hotel" className="text-body block hover:text-title">
                                <span>Hotel Services</span>
                            </Link>
                            <Link href="/car" className="text-body block hover:text-title">
                                <span>Transportation</span>
                            </Link>
                        </div>
                        <div className="space-y-4 text-sm">
                            <span className="text-title font-medium text-lg">Company</span>
                            <Link href="/about" className="text-body block hover:text-title">
                                <span>About</span>
                            </Link>
                            <Link href="/blog" className="text-body block hover:text-title">
                                <span>Blog</span>
                            </Link>
                            <Link href="/contact" className="text-body block hover:text-title">
                                <span>Contact</span>
                            </Link>
                            <Link href="/contact" className="text-body block hover:text-title">
                                <span>Help</span>
                            </Link>
                        </div>
                        <div className="space-y-4 text-sm">
                            <span className="text-title font-medium text-lg">Legal</span>
                            <Link href="/terms-and-conditions" className="text-body block hover:text-title">
                                <span>Terms</span>
                            </Link>
                            <Link href="/privacy-policy" className="text-body block hover:text-title">
                                <span>Privacy</span>
                            </Link>
                            <Link href="/privacy-policy#cookies" className="text-body block hover:text-title">
                                <span>Cookies</span>
                            </Link>
                            <Link href="/privacy-policy#security" className="text-body block hover:text-title">
                                <span>Security</span>
                            </Link>
                        </div>
                    </div>
                    <div className='flex lg:w-2/5 md:justify-end w-full'>
                        <div className="flex flex-col gap-10">
                            <div className="space-y-4 text-sm">
                                <span className="text-title font-medium text-lg">Contact Us</span>
                                <div className='flex items-center gap-2'>
                                    <Image src="/location.png" alt="location" width={25} height={25} />
                                    <span className="text-body block hover:text-title">{info?.address}</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Image src="/phone-call.png" alt="email" width={25} height={25} />
                                    <span className="text-body block hover:text-title">{info?.phone}</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Image src="/email.png" alt="email" width={25} height={25} />
                                    <span className="text-body block hover:text-title">{info?.email}</span>
                                </div>
                            </div>
                            <form className='flex flex-col w-full h-full gap-2'>
                                <span className="text-title font-medium">Subscribe to our newsletter</span>
                                <div className='flex gap-2 w-full h-max'>
                                    <input type="email" placeholder="Your email" className="text-sm px-4 py-2 border rounded-lg w-full" />
                                    <Button name="Subscribe" />
                                </div>
                            </form>
                        </div>
                    </div>
                    
                </div>
                <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
                    <span className="text-caption order-last block text-center text-sm md:order-first">© 2024 Boarding Sky, All rights reserved</span>
                    <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
                        <a href={`https://twitter.com/${info?.links.find((link: any) => link.name === 'Twitter')?.link}`} target="_blank" aria-label="X/Twitter" className="text-body block hover:text-title hover:scale-110">
                            <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"></path></svg>
                        </a>
                        <a href={`https://www.linkedin.com/company/${info?.links.find((link: any) => link.name === 'LinkedIn')?.link}`} target="_blank" aria-label="LinkedIn" className="text-body block hover:text-title hover:scale-110">
                            <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
                                ><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"></path>
                            </svg>
                        </a>
                        <a href={`https://www.facebook.com/${info?.links.find((link: any) => link.name === 'Facebook')?.link}`} target="_blank" aria-label="Facebook" className="text-body block hover:text-title hover:scale-110">
                            <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"></path></svg>
                        </a>
                        <a href={`https://www.threads.com/${info?.links.find((link: any) => link.name === 'Thread')?.link}`} target="_blank" aria-label="Threads" className="text-body block hover:text-title hover:scale-110">
                            <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.25 8.505c-1.577-5.867-7-5.5-7-5.5s-7.5-.5-7.5 8.995s7.5 8.996 7.5 8.996s4.458.296 6.5-3.918c.667-1.858.5-5.573-6-5.573c0 0-3 0-3 2.5c0 .976 1 2 2.5 2s3.171-1.027 3.5-3c1-6-4.5-6.5-6-4" color="currentColor"></path></svg>
                        </a>
                        <a href={`https://www.instagram.com/${info?.links.find((link: any) => link.name === 'Instagram')?.link}`} target="_blank" aria-label="Instagram" className="text-body block hover:text-title hover:scale-110">
                            <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
                                ><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                                ></path>
                            </svg>
                        </a>
                        <a href={`https://www.tiktok.com/@${info?.links.find((link: any) => link.name === 'Tiktok')?.link}`} target="_blank" aria-label="TikTok" className="text-body block hover:text-title  hover:scale-110">
                            <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}