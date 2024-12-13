import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import client from "./mongodb";
import mongoose from "mongoose";
import { unstable_noStore as noStore } from "next/cache";

export const getUser = async () => {
    noStore();
    const { userId } =await auth();
    // console.log(userId)
    const mongoClient = await client;
    const db = mongoClient.db("boarding-sky");
    const user = await db.collection("users").findOne({ clerkId: userId });
    return user
};

export const getInfo = async () => {
    noStore();
    const mongoClient = await client;
    const db = mongoClient.db("boarding-sky");
    const collection = await db.collection("info");
    const info = await collection.findOne({});
    return info
};

export const getBlogs = async () => {
    noStore();
    const mongoClient = await client;
    const db = mongoClient.db("boarding-sky");
    const collection = await db.collection("blogs");
    const blogs = await collection.find({ published: true }).toArray();
    return blogs
};

export const getBlog = async (id: string) => {
    noStore();
    const mongoClient = await client;
    const db = mongoClient.db("boarding-sky");
    const collection = await db.collection("blogs");
    const blog = await collection.findOne({ _id: new mongoose.Types.ObjectId(id) })
    return blog
}

export const getDestinations = async () => {
    noStore();
    const mongoClient = await client;
    const db = mongoClient.db("boarding-sky");
    const collection = await db.collection("destination");
    const blogs = await collection.find({}).toArray();
    return blogs
};

export const getFlightDeals = async () => {
    noStore();
    const mongoClient = await client;
    const db = mongoClient.db("boarding-sky");
    const collection = await db.collection("flightDeals");
    const blogs = await collection.find({}).toArray();
    return blogs
};

export const getTours = async () => {
    noStore();
    const mongoClient = await client;
    const db = mongoClient.db("boarding-sky");
    const collection = await db.collection("tours");
    const tours = await collection.find({}).toArray();
    return tours
};

export const getTour = async (id: string) => {
    noStore();
    const mongoClient = await client;
    const db = mongoClient.db("boarding-sky");
    const collection = await db.collection("tours");
    const blog = await collection.findOne({ _id: new mongoose.Types.ObjectId(id) })
    return blog
}

export const blogs = [
    {
        id: 1,
        author: "John Doe",
        date: "Dec 1, 2024",
        title: "Blog Post 1",
        description: "This is the content of blog post 1.",
        image: "https://images.unsplash.com/photo-1731069945702-53e476208ad8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/"
    },
    {
        id: 2,
        author: "Jane Doe",
        date: "Dec 2, 2024",
        title: "Blog Post 2",
        description: "This is the content of blog post 2.",
        image: "https://images.unsplash.com/photo-1727640851526-9dd11cc6bd07?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/"
    },
    {
        id: 3,
        author: "Bob Smith",
        date: "Dec 3, 2024",
        title: "Blog Post 3",
        description: "This is the content of blog post 3.",
        image: "https://images.unsplash.com/photo-1731512883997-bbd3d801e1a9?q=80&w=1533&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/"
    },
    {
        id: 4,
        author: "John Doe",
        date: "Dec 1, 2024",
        title: "Blog Post 1",
        description: "This is the content of blog post 1.",
        image: "https://images.unsplash.com/photo-1731069945702-53e476208ad8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/"
    },
    {
        id: 5,
        author: "Jane Doe",
        date: "Dec 2, 2024",
        title: "Blog Post 2",
        description: "This is the content of blog post 2.",
        image: "https://images.unsplash.com/photo-1727640851526-9dd11cc6bd07?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/"
    },
    {
        id: 6,
        author: "Bob Smith",
        date: "Dec 3, 2024",
        title: "Blog Post 3",
        description: "This is the content of blog post 3.",
        image: "https://images.unsplash.com/photo-1731512883997-bbd3d801e1a9?q=80&w=1533&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/"
    },
    {
        id: 7,
        author: "John Doe",
        date: "Dec 1, 2024",
        title: "Blog Post 1",
        description: "This is the content of blog post 1.",
        image: "https://images.unsplash.com/photo-1731069945702-53e476208ad8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/"
    },
    {
        id: 8,
        author: "Jane Doe",
        date: "Dec 2, 2024",
        title: "Blog Post 2",
        description: "This is the content of blog post 2.",
        image: "https://images.unsplash.com/photo-1727640851526-9dd11cc6bd07?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/"
    },
    {
        id: 9,
        author: "Bob Smith",
        date: "Dec 3, 2024",
        title: "Blog Post 3",
        description: "This is the content of blog post 3.",
        image: "https://images.unsplash.com/photo-1731512883997-bbd3d801e1a9?q=80&w=1533&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/"
    },
]