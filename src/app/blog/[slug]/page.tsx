import Header from "@/components/Header";
import { ImagesSlider } from "@/components/ui/images-slider";
import { getBlog } from "@/lib/data";
import { CalendarCheck, UserRound } from "lucide-react";
import Image from "next/image";

const SingleBlog = async ({ params }: { params: Promise<any> }) => {
    const { slug } = await params;
    const blog = await getBlog(slug);

    return (
        <div className="w-full h-full ">
            <Header title={'Blog'} />
            <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16 mb-10">
                {/* IMG */}
                {blog?.images && blog?.images.length > 0 && blog?.images ? (
                    <div className="w-full lg:w-1/2 lg:sticky top-20 h-max flex justify-center items-center">
                        <ImagesSlider className="h-[25rem] rounded-lg" images={blog?.images} overlay={false}></ImagesSlider>
                    </div>
                ):(
                    <div className="w-full lg:w-1/2 lg:sticky top-20 h-max flex justify-center items-center">
                        <Image
                        src={'/placeholder-image.png'}
                        alt="placeholder"
                        width={500}
                        height={500}
                        className="h-[25rem] rounded-lg object-cover"
                        />
                    </div>
                )}
                {/* TEXTS */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    <div className="flex flex-row gap-2 w-full items-center">
                        <UserRound className="w-7 h-7 text-second" />
                        <span className="text-second">Author:</span>
                        <span>{blog?.author}</span>
                        <span className="ml-2">|</span>
                        <CalendarCheck className="w-7 h-7 ml-2 text-second" />
                        <span className="text-second">Published:</span>
                        <span>{blog?.publishDate}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-semibold">{blog?.title}</h1>
                        <p className="text-lg text-muted-foreground">{blog?.description}</p>
                    </div>
                    <p>
                        {blog?.content}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SingleBlog