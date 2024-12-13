import { BlogCard } from "./BlogCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

const BlogList = ({page, blogsAsString}: {page: number, blogsAsString: string}) => {
    const blogs = JSON.parse(blogsAsString)
    const maxPerPage = 6;
    const numPages = Math.ceil(blogs?.length / maxPerPage) || 0;
    const currentBlogs = blogs?.slice((page - 1) * maxPerPage, page * maxPerPage);

    if (currentBlogs?.length === 0) {
        return notFound();
    }

    return (
        <>
            {!currentBlogs?.length && (
            <div className="w-full h-full flex flex-col gap-5 justify-center items-center text-center text-muted-foreground">
                <h1 className="text-3xl font-semibold">No blog found</h1>
            </div>
            )}
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentBlogs?.length > 0 && currentBlogs?.map((blog: any) => (
                    <BlogCard key={blog._id} {...blog} />
                ))}
            </div>
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-full h-full flex justify-center items-center gap-2">
                    {page > 1 && (
                        <Link 
                        href={`/blog?page=${page - 1}`}
                        >
                            <button className="w-10 h-10 hover:scale-125 rounded-full flex justify-center items-center text-second">
                                <ArrowLeft />
                            </button>
                        </Link>
                    )}
                    {[...Array(Math.min(5, numPages))].map((_, index) => {
                        const pageNumber = page > 2  ? page - 2 + index : index + 1;
                        return (
                            <Link
                            href={`/blog?page=${pageNumber}`}
                            key={pageNumber}>
                                <button 
                                className={`w-10 h-10 rounded-full ${pageNumber > numPages ? `hidden` : `flex`} justify-center items-center hover:bg-second hover:text-white text-second border border-second ${page === pageNumber ? "bg-second text-white" : ""}`}
                                >
                                    {pageNumber} 
                                </button>
                            </Link>
                        );
                    })}
                    {page < numPages && (
                        <Link 
                        href={`/blog?page=${page + 1}`}
                        >
                            <button className="w-10 h-10 hover:scale-125 rounded-full flex justify-center items-center text-second ">
                                <ArrowRight />
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default BlogList;