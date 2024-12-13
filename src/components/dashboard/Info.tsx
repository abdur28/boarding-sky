'use client'

import { useState, useTransition, useEffect } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Plus, Minus, Loader2 } from "lucide-react"
import { updateInfo } from '@/lib/action'
import UploadImage from '../UploadImage'
import { useDashboard } from '@/hooks/useDashboard';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// Define initial form state to prevent undefined values
const initialFormState = {
    email: '',
    phone: '',
    address: '',
    heroText: '',
    heroDescription: '',
    footerText: '',
    flightPageText: '',
    hotelPageText: '',
    carPageText: '',
    tourPageText: '',
    blogPageText: '', 
    aboutText: '',
    aboutDescription: '',
    historyText: '',
    historySubText: '',
    historyDescription: '',
    globeText: '',
    globeDescription: '',
    goalsText: '',
    goalsDescription: '',
    goalsCustomers: '',
    goalsClientSatisfaction: '',
    reviewsText: '',
    reviews: [{ name: '', role: '', review: '' }],
    links: [
        { name: 'Instagram', link: '' },
        { name: 'Facebook', link: '' },
        { name: 'Twitter', link: '' },
        { name: 'YouTube', link: '' },
        { name: 'Thread', link: '' },
        { name: 'Tiktok', link: '' },
    ],
    heroImage: '/placeholder-image.png',
    aboutImage: '/placeholder-image.png',
    goalsImage: '/placeholder-image.png',
    historyImages: ['/placeholder-image.png', '/placeholder-image.png', '/placeholder-image.png', '/placeholder-image.png'],
}

const Info = () => {
    const { info, getInfo, isLoading } = useDashboard()
    const [isPending, startTransition] = useTransition()
    const { deleteImages } = useDashboard()
    const [state, setState] = useState('')
    const [formData, setFormData] = useState(initialFormState)

    useEffect(() => {
        getInfo()
    }, [])

    useEffect(() => {
        if (info) {
            // Merge info with initial state to ensure all fields are defined
            setFormData(prevState => ({
                ...initialFormState,
                ...info,
                // Ensure arrays are properly initialized
                reviews: info.reviews?.length ? info.reviews : initialFormState.reviews,
                links: info.links?.length ? info.links : initialFormState.links,
                historyImages: info.historyImages?.length ? info.historyImages : initialFormState.historyImages,
            }))
        }
    }, [info])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: type === 'number' ? (value === '' ? '' : Number(value)) : value
        }))
    }

    const handleLinkChange = (index: number, field: 'link', value: string) => {
        setFormData(prev => {
            const newLinks = [...prev.links]
            newLinks[index] = { ...newLinks[index], [field]: value }
            return { ...prev, links: newLinks }
        })
    }

    const handleReviewChange = (index: number, field: 'name' | 'role' | 'review', value: string) => {
        setFormData(prev => {
            const newReviews = [...prev.reviews]
            newReviews[index] = { ...newReviews[index], [field]: value }
            return { ...prev, reviews: newReviews }
        })
    }

    const handleImageUpload = (image: string, field: string, index?: number) => {
        if (typeof index === 'number') {
            setFormData(prev => {
                const newHistoryImages = [...prev.historyImages]
                if (prev.historyImages[index] !== '/placeholder-image.png') {
                    deleteImages([prev.historyImages[index]])
                }
                newHistoryImages[index] = image
                return { ...prev, historyImages: newHistoryImages }
            })
        } else {
            setFormData((prev: any) => {
                if (prev[field] !== '/placeholder-image.png') {
                    deleteImages([prev[field]])
                }
                return { ...prev, [field]: image }
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const formDataToSend = new FormData()
        
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                formDataToSend.append(key, JSON.stringify(value))
            } else {
                formDataToSend.append(key, value?.toString() || '')
            }
        })

        startTransition(async () => {
            try {
                const response = await updateInfo(formDataToSend)
                setState(response.success ? 'success' : 'error')
            } catch (error) {
                console.error('Failed to update info:', error)
                setState('error')
            }
        })
    }

    const addReview = () => {
        setFormData(prev => ({
            ...prev,
            reviews: [...prev.reviews, { name: '', role: '', review: '' }]
        }))
    }

    const removeReview = (index: number) => {
        setFormData(prev => ({
            ...prev,
            reviews: prev.reviews.filter((_: any, i: number) => i !== index)
        }))
    }

    const LoadingState = () => (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Getting all information...</p>
        </div>
    )

    return (
        <div className="w-full h-full">
            {isLoading ? <LoadingState /> : (
                <div className="flex flex-col h-full w-full">
                    <div className="sticky top-0 z-50 w-full bg-white border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="container flex h-16 items-center justify-between">
                            <h1 className="text-2xl font-semibold">General Information</h1>
                            <Button 
                                onClick={handleSubmit} 
                                disabled={isPending}
                                className="w-24"
                            >
                                {isPending ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>
                    <Dialog open={!!state} onOpenChange={() => setState('')}>
                        <DialogContent onClose={() => setState('')}>
                            <DialogHeader>
                                <DialogTitle>{state === 'success' ? 'Successfully saved' : 'Something went wrong'}</DialogTitle>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setState('')}>
                                        {state === 'success' ? 'Close' : 'Try again later'}
                                    </Button>
                                </DialogFooter>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        {/* Basic Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    type="email" 
                                    id="email" 
                                    value={formData.email} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input 
                                    type="tel" 
                                    id="phone" 
                                    value={formData.phone} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input 
                                    type="text" 
                                    id="address" 
                                    value={formData.address} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                        </div>

                        {/* Hero Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <Label htmlFor="heroText">Hero Text</Label>
                                <Input 
                                    type="text" 
                                    id="heroText" 
                                    value={formData.heroText} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div>
                                <Label htmlFor="heroDescription">Hero Description</Label>
                                <Input 
                                    type="text" 
                                    id="heroDescription" 
                                    value={formData.heroDescription} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div>
                                <UploadImage
                                    uploadedImages={[formData.heroImage]}
                                    setUploadedImage={(image: any) => handleImageUpload(image, 'heroImage')}
                                    multiple={false}
                                    maxFiles={1}
                                />
                            </div>
                        </div>

                        {/* Page Texts Section */}
                        {['footer', 'flight', 'hotel', 'car', 'tour', 'blog'].map((page) => (
                            <div key={page} className="grid grid-cols-1">
                                <div>
                                    <Label htmlFor={`${page}PageText`}>
                                        {page.charAt(0).toUpperCase() + page.slice(1)} Page Text
                                    </Label>
                                    <Input 
                                        type="text" 
                                        id={`${page}PageText`} 
                                        value={formData[`${page}PageText` as keyof typeof formData] as string || '' } 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </div>
                        ))}

                        {/* About Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-medium">About</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <Label htmlFor="aboutText">About Text</Label>
                                    <Input 
                                        type="text" 
                                        id="aboutText" 
                                        value={formData.aboutText} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="aboutDescription">About Description</Label>
                                    <Input 
                                        type="text" 
                                        id="aboutDescription" 
                                        value={formData.aboutDescription} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div>
                                    <UploadImage
                                        uploadedImages={[formData.aboutImage]}
                                        setUploadedImage={(image: any) => handleImageUpload(image, 'aboutImage')}
                                        multiple={false}
                                        maxFiles={1}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* History Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <Label htmlFor="historyText">History Text</Label>
                                <Input 
                                    type="text" 
                                    id="historyText" 
                                    value={formData.historyText} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div>
                                <Label htmlFor="historySubText">History SubText</Label>
                                <Input 
                                    type="text" 
                                    id="historySubText" 
                                    value={formData.historySubText} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div>
                                <Label htmlFor="historyDescription">History Description</Label>
                                <Input 
                                    type="text" 
                                    id="historyDescription" 
                                    value={formData.historyDescription} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.historyImages.map((image, index) => (
                                <div key={index}>
                                    <UploadImage
                                        uploadedImages={[image]}
                                        setUploadedImage={(newImage: any) => handleImageUpload(newImage, 'historyImages', index)}
                                        multiple={false}
                                        maxFiles={1}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Links Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-medium">Links</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 border rounded-lg">
                                {formData.links.map((link, index) => (
                                    <div key={index} className="p-2">
                                        <Label htmlFor={`link-${link.name.toLowerCase()}`}>{link.name}</Label>
                                        <Input
                                            id={`link-${link.name.toLowerCase()}`}
                                            value={link.link}
                                            onChange={(e) => handleLinkChange(index, 'link', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Globe Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-medium">Globe</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <Label htmlFor="globeText">Globe Text</Label>
                                    <Input 
                                        type="text" 
                                        id="globeText" 
                                        value={formData.globeText} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div>
                                <Label htmlFor="globeDescription">Globe Description</Label>
                                    <Input 
                                        type="text" 
                                        id="globeDescription" 
                                        value={formData.globeDescription} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Goals Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-medium">Goals</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <Label htmlFor="goalsText">Goals Text</Label>
                                    <Input 
                                        type="text" 
                                        id="goalsText" 
                                        value={formData.goalsText} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="goalsDescription">Goals Description</Label>
                                    <Input 
                                        type="text" 
                                        id="goalsDescription" 
                                        value={formData.goalsDescription} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <Label htmlFor="goalsCustomers">Goals Customers</Label>
                                    <Input 
                                        type="number" 
                                        id="goalsCustomers" 
                                        value={formData.goalsCustomers} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="goalsClientSatisfaction">Goals Client Satisfaction (%)</Label>
                                    <Input 
                                        type="number" 
                                        id="goalsClientSatisfaction" 
                                        value={formData.goalsClientSatisfaction} 
                                        onChange={handleInputChange}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div>
                                    <UploadImage
                                        uploadedImages={[formData.goalsImage]}
                                        setUploadedImage={(image: any) => handleImageUpload(image, 'goalsImage')}
                                        multiple={false}
                                        maxFiles={1}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Reviews Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-medium">Reviews</h2>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={addReview}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" /> Add Review
                                </Button>
                            </div>
                            {formData.reviews.map((review, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeReview(index)}
                                        className="absolute -right-1 -top-1 text-destructive"
                                        disabled={formData.reviews.length === 1}
                                    >
                                        <Minus className="h-8 w-8" />
                                    </Button>
                                    <div>
                                        <Label htmlFor={`review-name-${index}`}>Name</Label>
                                        <Input
                                            id={`review-name-${index}`}
                                            value={review.name}
                                            onChange={(e) => handleReviewChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`review-role-${index}`}>Role</Label>
                                        <Input
                                            id={`review-role-${index}`}
                                            value={review.role}
                                            onChange={(e) => handleReviewChange(index, 'role', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`review-text-${index}`}>Review</Label>
                                        <Input
                                            id={`review-text-${index}`}
                                            value={review.review}
                                            onChange={(e) => handleReviewChange(index, 'review', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Info
