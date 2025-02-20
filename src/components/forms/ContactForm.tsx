'use client'

import { useState, useTransition } from "react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Loader2 } from "lucide-react"
import { sendMail } from "@/lib/action"


const ContactForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })

    const handleChange = (name: string, value: string) => {
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });
        startTransition(async () => {
            try {
                await sendMail(formData);
                setForm({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                })
            } catch (error) {
                console.error('Failed to submit form:', error);
            } finally {
                setIsLoading(false);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="w-full h-full">
            <Card className="w-full max-w-4xl mx-auto flex flex-col gap-5 justify-center items-center px-5 py-10">
                <div className="w-full mb-5">
                    <h2 className="text-2xl font-semibold">Get In Touch</h2>
                </div>
                <div className="flex flex-col w-full md:flex-row space-y-2 md:space-y-0 md:space-x-2 ">
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="name">Full Name</Label>
                        <Input required type="text" id="name" value={form.name} 
                        onChange={(e) => handleChange('name', e.target.value)} placeholder="John Doe"/>
                    </div>
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" required id="email" 
                        value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="example@email.com"/>
                    </div>
                </div>
                <div className="flex flex-col w-full md:flex-row space-y-2 md:space-y-0 md:space-x-2 ">
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input type="text" 
                        value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                        id="phone" placeholder="+1 (555) 555-5555"/>
                    </div>
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="subject">Subject</Label>
                        <Input type="text" id="subject" required
                        value={form.subject} onChange={(e) => handleChange('subject', e.target.value)} 
                        placeholder="I want to book a flight"/>
                    </div>
                </div>
                <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="message">Message</Label>
                    <Input type="text" id="message" required
                    value={form.message} onChange={(e) => handleChange('message', e.target.value)} 
                    placeholder="Hello, I want to book a flight from New York to Los Angeles"/>
                </div>
                <div className="flex justify-end w-full mt-5">
                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto"> 
                        {isLoading && (
                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isLoading ? 'Sending...' : 'Submit'}
                    </Button>
                </div>
            </Card>
        </form>
    )
}

export default ContactForm