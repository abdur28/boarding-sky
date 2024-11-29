import Button from "./Button"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

const ContactForm = () => {
    return (
        <form className="w-full h-full">
            <Card className="w-full max-w-4xl mx-auto flex flex-col gap-5 justify-center items-center px-5 py-10">
                <div className="w-full mb-5">
                    <h2 className="text-2xl font-semibold">Get In Touch</h2>
                </div>
                <div className="flex flex-col w-full md:flex-row space-y-2 md:space-y-0 md:space-x-2 ">
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="name">Full Name</Label>
                        <Input required type="text" id="name" placeholder="John Doe"/>
                    </div>
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="example@email.com"/>
                    </div>
                </div>
                <div className="flex flex-col w-full md:flex-row space-y-2 md:space-y-0 md:space-x-2 ">
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input type="text" id="phone" placeholder="+1 (555) 555-5555"/>
                    </div>
                    <div className="flex flex-col space-y-2 w-full">
                        <Label htmlFor="subject">Subject</Label>
                        <Input type="text" id="subject" placeholder="I want to book a flight"/>
                    </div>
                </div>
                <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="message">Message</Label>
                    <Input type="text" id="message" placeholder="Hello, I want to book a flight from New York to Los Angeles"/>
                </div>
                <div className="flex justify-end w-full mt-5">
                    <Button name="Send Message" />
                </div>
            </Card>
        </form>
    )
}

export default ContactForm