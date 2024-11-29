import ContactForm from "@/components/ContactForm";
import Header from "@/components/Header";

export default function Contact() {
    return (
        <div className="w-full h-full bg-fourth pb-10">
            <Header title="Contact Us" />
            <div className="w-full h-full flex justify-center items-center px-5">
                <ContactForm />
            </div>
        </div>
    )
}