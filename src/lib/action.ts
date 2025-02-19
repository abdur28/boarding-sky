'use server'

import { auth } from "@clerk/nextjs/server";
import client from "./mongodb";
import mongoose from "mongoose";
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from "next/cache";
import { randomInt, randomUUID } from "crypto";

async function getCollection(collectionName: string) {
  const mongoClient = await client;
  const db = mongoClient.db("boarding-sky");
  return db.collection(collectionName);
}

export async function updateInfo(formData: FormData) {
  try {
    const collection = await getCollection("info");
    const data = Object.fromEntries(formData.entries());

    // console.log(data);
    // Convert arrays from JSON strings back to arrays
    if (typeof data.reviews === 'string') {
      data.reviews = JSON.parse(data.reviews);
    }
    if (typeof data.links === 'string') {
      data.links = JSON.parse(data.links);
    }
    if (typeof data.historyImages === 'string') {
      data.historyImages = JSON.parse(data.historyImages);
    }

    // Exclude the _id from data
    const { _id, ...updateData } = data;
    // console.log(updateData);

    // Upsert info document (update if exists, create if doesn't)
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId("67582606bed60f1aff95788e") }, // Use a fixed _id for the single info document
      { $set: updateData },
      { upsert: true }
    );

    return { success: true };
  } catch (error) {
    console.error('Failed to update info:', error);
    return { success: false, error };
  }
}

export async function updateUser(formData: FormData) {
  try {
    const collection = await getCollection("users");
    const data = Object.fromEntries(formData.entries());

    const { _id, ...updateData } = data;
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(_id as string) },
      { $set: updateData }
    );

    return { success: true };
  } catch (error) {
    console.error('Failed to update user:', error);
    return { success: false, error };
  }
}

export async function deleteUser(formData: FormData) {
  try {
    const collection = await getCollection("users");
    const data = Object.fromEntries(formData.entries());
    const clerkId = formData.get('clerkId') as string;

    if (clerkId) {
      try {
        const client = await clerkClient()
        await client.users.deleteUser(clerkId);
      } catch (clerkError) {
        console.error('Failed to delete user from Clerk:', clerkError);
        return { success: false, error: clerkError };
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to delete user:', error);
    return { success: false, error };
  }
}

export async function updateFlightOffers(formData: FormData) {
  try {
    const collection = await getCollection("flightOffers");
    const data = Object.fromEntries(formData.entries());
    const formatedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (typeof value === 'string') {
          try {
            return [key, JSON.parse(value)];
          } catch (error) {
            return [key, value];
          }
        }
        return [key, value];
      })
    );
    const action = formData.get('action');

    if (action === 'delete') {
      const id = formData.get('id');
      await collection.deleteOne({ id: id as string });
    } else if (formatedData.id) {
      const offerId = formData.get('id');
      const { _id, ...updateData } = formatedData;
      console.log(updateData);
      await collection.updateOne(
        { id: offerId as string },
        { $set: updateData }
      );
    } else {
      const id = randomUUID().replace(/-/g, '');
      formatedData.id = id;
      await collection.insertOne(formatedData);
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to update flight offer:', error);
    return { success: false, error };
  }
}

export async function updateAirlines(formData: FormData) {
  try {
    const collection = await getCollection("airlines");
    const data = Object.fromEntries(formData.entries());
    const action = formData.get('action');

    if (action === 'delete') {
      await collection.deleteOne({ _id: new mongoose.Types.ObjectId(data._id as string) });
    } else if (data._id) {
      const { _id, ...updateData } = data;
      await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(_id as string) },
        { $set: updateData }
      );
    } else {
      await collection.insertOne(data);
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to update airline:', error);
    return { success: false, error };
  }
}

export async function updateCars(formData: FormData) {
  try {
    const collection = await getCollection("cars");
    const data = Object.fromEntries(formData.entries());
    const action = formData.get('action');

    if (action === 'delete') {
      await collection.deleteOne({ _id: new mongoose.Types.ObjectId(data._id as string) });
    } else if (data._id) {
      const { _id, ...updateData } = data;
      await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(_id as string) },
        { $set: updateData }
      );
    } else {
      await collection.insertOne(data);
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to update car:', error);
    return { success: false, error };
  }
}

export async function updateHotels(formData: FormData) {
  try {
    const collection = await getCollection("hotels");
    const data = Object.fromEntries(formData.entries());
    const action = formData.get('action');
    const images = JSON.parse(formData.get('images') as string);

    data.images = images;

    if (action === 'delete') {
      await collection.deleteOne({ _id: new mongoose.Types.ObjectId(data._id as string) });
    } else if (data._id) {
      const { _id, ...updateData } = data;
      await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(_id as string) },
        { $set: updateData }
      );
    } else {
      await collection.insertOne(data);
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to update hotel:', error);
    return { success: false, error };
  }
}

export async function updateBlogs(formData: any) {
  try {
    const collection = await getCollection("blogs");
    const data = Object.fromEntries(formData.entries());
    const action = formData.get('action');
    const images = JSON.parse(formData.get('images') as string);
    data.images = images;

    // Convert published to boolean
    if (data.published) {
      data.published = data.published === 'true';
    }

    if (action === 'delete') {
      await collection.deleteOne({ _id: new mongoose.Types.ObjectId(data._id as string) });
    } else if (data._id) {
      const { _id, ...updateData } = data;
      await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(_id as string) },
        { $set: updateData }
      );
    } else {
      await collection.insertOne(data);
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to update blog:', error);
    return { success: false, error };
  }
}

export async function updateTours(formData: FormData) {
  try {
    const collection = await getCollection("tours");
    const data = Object.fromEntries(formData.entries());
    const action = formData.get('action');

    // Parse all JSON fields
    const jsonFields = ['images', 'highlights', 'itinerary', 'included', 'notIncluded'];
    jsonFields.forEach(field => {
      const value = formData.get(field);
      if (value) {
        data[field] = JSON.parse(value as string);
      }
    });

    if (action === 'delete') {
      await collection.deleteOne({ 
        _id: new mongoose.Types.ObjectId(data._id as string) 
      });
    } else if (data._id) {
      const { _id, ...updateData } = data;
      await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(_id as string) },
        { $set: updateData }
      );
    } else {
      await collection.insertOne(data);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update tour:', error);
    return { success: false, error };
  }
}

export async function updateFlightDeals(formData: FormData) {
  try {
    const collection = await getCollection("flightDeals");
    const data = Object.fromEntries(formData.entries());
    const action = formData.get('action');

    if (action === 'delete') {
      await collection.deleteOne({ _id: new mongoose.Types.ObjectId(data._id as string) });
    } else if (data._id) {
      const { _id, ...updateData } = data;
      await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(_id as string) },
        { $set: updateData }
      );
    } else {
      await collection.insertOne(data);
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to update flight deal:', error);
    return { success: false, error };
  }
}

export async function updateDestinations(formData: FormData) {
  try {
    const collection = await getCollection("destination");
    const data = Object.fromEntries(formData.entries());
    const action = formData.get('action');

    if (action === 'delete') {
      await collection.deleteOne({ _id: new mongoose.Types.ObjectId(data._id as string) });
    } else if (data._id) {
      const { _id, ...updateData } = data;
      await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(_id as string) },
        { $set: updateData }
      );
    } else {
      await collection.insertOne(data);
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to update destination:', error);
    return { success: false, error };
  }
}
