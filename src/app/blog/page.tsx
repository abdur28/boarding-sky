import BlogList from "@/components/BlogList";
import Header from "@/components/Header";

const Blog = async ({searchParams}: {searchParams?: any}) => {
    const params = await searchParams
    const page = parseInt(params?.page) || 1;
    return (
        <div className="w-full h-full bg-fourth pb-10">
            <Header title="Blog" />
            <div className="w-full h-full flex justify-center items-center px-5">
                <BlogList page={page} />
            </div>
        </div>
    )
}

export default Blog