import { blogs, getBlogs } from "@/lib/data";
import BlogList from "@/components/BlogList";
import Header from "@/components/Header";
import { getInfo } from "@/lib/data";

const Blog = async ({searchParams}: {searchParams?: any}) => {
    const params = await searchParams
    const page = parseInt(params?.page) || 1;
    const info = await getInfo();
    const blogs = await getBlogs();
    return (
        <div className="w-full h-full bg-fourth pb-10">
            <Header title="Blog" />
            <div className="w-full h-full flex justify-center items-center px-5">
                <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
                    <div className="w-full h-full flex flex-col gap-5 justify-center">
                        <h1 className="text-4xl font-semibold">Latest Blog</h1>
                        <p className="text-lg text-muted-foreground">{info?.blogPageText}</p>
                    </div>
                    <BlogList page={page} blogsAsString={JSON.stringify(blogs || [])}/>
                </div>
            </div>
        </div>
    )
}

export default Blog