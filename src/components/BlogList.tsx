import { blogs } from "@/lib/data";
import { BlogCard } from "./BlogCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

const BlogList = ({page}: {page: number}) => {
    const maxPerPage = 6;
    const numPages = Math.ceil(blogs.length / maxPerPage);
    const currentBlogs = blogs.slice((page - 1) * maxPerPage, page * maxPerPage);

    if (currentBlogs.length === 0) {
        return notFound();
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
            <div className="w-full h-full flex flex-col gap-5 justify-center">
                <h1 className="text-4xl font-semibold">Latest Blog</h1>
                <p className="text-lg text-muted-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste nisi voluptatibus, iure facilis similique in assumenda dignissimos dolorem culpa, neque soluta, illo impedit totam! Minus nisi esse dicta excepturi? Adipisci?</p>
            </div>
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentBlogs.map((blog) => (
                    <BlogCard key={blog.id} {...blog} />
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
        </div>
    );
};

export default BlogList;