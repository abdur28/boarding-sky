import Header from "@/components/Header";
import { ImagesSlider } from "@/components/ui/images-slider";
import { blogs } from "@/lib/data";
import { CalendarCheck, UserRound } from "lucide-react";

const SingleBlog = async ({ params }: { params: { slug: string } }) => {
    const { slug } = await params;
    const blog = blogs.find((blog) => JSON.stringify(blog.id) === slug);

    const images = [
        "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ];

    return (
        <div className="w-full h-full ">
            <Header title={'Blog'} />
            <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16 mb-10">
                {/* IMG */}
                <div className="w-full lg:w-1/2 lg:sticky top-20 h-max flex justify-center items-center">
                    <ImagesSlider className="h-[25rem] rounded-lg" images={images} overlay={false}></ImagesSlider>
                </div>
                {/* TEXTS */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    <div className="flex flex-row gap-2 w-full items-center">
                        <UserRound className="w-7 h-7 text-second" />
                        <span className="text-second">Author:</span>
                        <span>{blog?.author}</span>
                        <span className="ml-2">|</span>
                        <CalendarCheck className="w-7 h-7 ml-2 text-second" />
                        <span className="text-second">Published:</span>
                        <span>{blog?.date}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-semibold">{blog?.title}</h1>
                        <p className="text-lg text-muted-foreground">{blog?.description}</p>
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt nihil rem amet ad nesciunt adipisci ut voluptatibus voluptatem autem nobis, dolorem, odit asperiores iure libero ea. Atque corporis exercitationem eos? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia perspiciatis, dolorum vero aspernatur iusto voluptatum ipsam quis cum, debitis ab eum harum. Doloremque ullam minima similique, delectus alias odit nam! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sunt, quidem eaque provident eligendi expedita eum. Similique beatae aliquam at, laborum nemo provident sequi! Vitae provident dolores similique autem eligendi accusamus? lor
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla quo minima modi quas aut? Aliquid amet necessitatibus odit neque! Dolores a ducimus nobis dignissimos pariatur rem molestiae deserunt eaque sed?Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt odit, laudantium quod totam rem eius veritatis id accusantium molestias quia. Iste, nesciunt deleniti necessitatibus ullam praesentium dolor cum dolorem ex. lorem Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores aliquam ipsum temporibus voluptatum, incidunt nam totam sequi minima quisquam, deserunt delectus quasi dolores maxime eaque suscipit magni in vitae ab. 
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quisquam minima ducimus praesentium voluptas eligendi dolor? Dignissimos nihil repellendus alias! Dignissimos eos obcaecati blanditiis cupiditate rem in dolores mollitia ab?
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo id in, laudantium nemo eveniet ex, illo et nisi modi ad impedit quae beatae nostrum autem? Voluptas facilis laboriosam numquam inventore. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat natus, omnis aspernatur beatae vel architecto dicta ullam? Officiis excepturi soluta, earum voluptatem tempore saepe, explicabo labore, maxime numquam aliquam laborum.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SingleBlog