import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import client from '@/lib/mongodb'

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Get event data
  const { id } = evt.data;
  const eventType = evt.type;

  // Add user to database
  if (eventType === 'user.created') {
    try {
      const mongoClient = await client;
      const db = mongoClient.db("boarding-sky");
      const email = evt.data.email_addresses[0].email_address
      const user = {
        clerkId: id,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        userName: evt.data.username,
        profilePicture: evt.data.image_url,
        email: email,
        role: 'user',
      }
      await db.collection("users").insertOne(user)
    } catch (err) {
      console.error('Database error:', err)
      return new Response('Failed to add user to database', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    try {
      const mongoClient = await client;
      const db = mongoClient.db("boarding-sky");
      await db.collection("users").updateOne(
        { clerkId: id },
        {
          $set: {
            firstName: evt.data.first_name,
            lastName: evt.data.last_name,
            userName: evt.data.username,
            profilePicture: evt.data.image_url,
            email: evt.data.email_addresses[0].email_address
          }
        }
      )
    } catch (err) {
      console.error('Database error:', err)
      return new Response('Failed to update user in database', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    try {
      const mongoClient = await client;
      const db = mongoClient.db("boarding-sky");
      await db.collection("users").deleteOne({ clerkId: id })
    } catch (err) {
      console.error('Database error:', err)
      return new Response('Failed to delete user from database', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
}