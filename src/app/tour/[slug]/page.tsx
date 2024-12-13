import Header from "@/components/Header";
import SingleTourPage from "@/components/pages/SingleTourPage";
import { ImagesSlider } from "@/components/ui/images-slider";
import { getTour } from "@/lib/data";
import { CalendarCheck, UserRound } from "lucide-react";
import Image from "next/image";

const SingleTour = async ({ params }: { params: { slug: string } }) => {
    const { slug } = await params;
    const tour = await getTour(slug);

    const sampleTour = {
        _id: "tour123",
        name: "Magical Northern Thailand Adventure",
        destination: "Thailand",
        days: 7,
        tourId: "TH-2024-001",
        price: 1299,
        details: `Embark on an unforgettable 7-day journey through Northern Thailand's most enchanting destinations. From the ancient temples of Chiang Mai to the serene hills of Chiang Rai, immerse yourself in Thai culture, cuisine, and natural beauty.
      
      This carefully crafted tour combines cultural experiences, adventure activities, and relaxation. Visit traditional hill tribe villages, learn authentic Thai cooking, explore stunning temples, and enjoy the famous Thai hospitality.
      
      You'll stay in carefully selected accommodations that blend comfort with local charm, enjoy authentic Thai cuisine, and travel in comfortable, air-conditioned vehicles. Our experienced local guides will share their deep knowledge of Thai culture and ensure you experience the real Thailand.
      
      Perfect for both first-time visitors and those looking to explore Thailand more deeply, this tour offers a perfect balance of guided activities and free time to explore on your own.`,
        images: [
          "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800",
          "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800",
        //   "https://images.unsplash.com/photo-1564567542538-3979220a5d8e?w=800",
          "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800",
          "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800"
        ],
        highlights: [
          "Explore the ancient temples of Chiang Mai",
          "Traditional cooking class with local chefs",
          "Visit to ethical elephant sanctuary",
          "Hill tribe village cultural exchange",
          "Night market food tour experience",
          "Sunrise temple visit with monks",
          "Traditional Thai massage session",
          "White Temple of Chiang Rai tour"
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Chiang Mai & Welcome Dinner",
            description: "Begin your Thai adventure in the cultural capital of the north. After airport pickup and hotel check-in, enjoy a traditional Thai welcome dinner and cultural performance.",
            activities: [
              "Airport transfer to hotel",
              "Hotel check-in and freshen up",
              "Welcome briefing with your guide",
              "Traditional Thai dinner and cultural show"
            ]
          },
          {
            day: 2,
            title: "Temple Tour & Cooking Class",
            description: "Explore Chiang Mai's most sacred temples in the morning, followed by a hands-on cooking class where you'll learn to make authentic Thai dishes.",
            activities: [
              "Visit to Wat Phra Singh",
              "Explore Wat Chedi Luang",
              "Local market tour",
              "Thai cooking class and dinner"
            ]
          },
          {
            day: 3,
            title: "Elephant Sanctuary & Night Market",
            description: "Spend a meaningful day at an ethical elephant sanctuary, followed by an evening exploring the famous night bazaar.",
            activities: [
              "Full day at elephant sanctuary",
              "Ethical elephant interaction",
              "Thai lunch at sanctuary",
              "Evening night market tour"
            ]
          },
          {
            day: 4,
            title: "Hill Tribe Village & Mountain Temple",
            description: "Journey into the hills to visit authentic hill tribe villages and the sacred mountain temple of Doi Suthep.",
            activities: [
              "Hill tribe village visit",
              "Traditional craft workshop",
              "Doi Suthep temple tour",
              "Sunset viewing at temple"
            ]
          },
          {
            day: 5,
            title: "Chiang Rai Day Trip",
            description: "Take a scenic drive to Chiang Rai to visit the stunning White Temple and other local attractions.",
            activities: [
              "White Temple visit",
              "Black House museum",
              "Local lunch experience",
              "Blue Temple visit"
            ]
          },
          {
            day: 6,
            title: "Wellness Day & Cultural Show",
            description: "Enjoy a day of relaxation with traditional Thai massage and spa treatments, ending with a cultural performance.",
            activities: [
              "Traditional Thai massage",
              "Spa treatments",
              "Free time for shopping",
              "Farewell dinner and show"
            ]
          },
          {
            day: 7,
            title: "Departure Day",
            description: "Final morning in Chiang Mai with optional activities before your departure.",
            activities: [
              "Optional morning alms giving",
              "Free time for last-minute shopping",
              "Airport transfer",
              "Departure assistance"
            ]
          }
        ],
        included: [
          "6 nights hotel accommodation",
          "Daily breakfast and selected meals",
          "All entrance fees",
          "English-speaking guide",
          "Air-conditioned transportation",
          "Airport transfers",
          "Cooking class",
          "Elephant sanctuary visit",
          "Thai massage session"
        ],
        notIncluded: [
          "International flights",
          "Travel insurance",
          "Personal expenses",
          "Optional activities",
          "Drinks during meals"
        ],
        departure: "Every Monday",
        maxGroupSize: 12,
        minAge: 8,
        difficulty: "Moderate",
        rating: 4.9,
        reviewCount: 127
      };
      

    return (
        <div className="w-full h-full">
            <SingleTourPage tourAsString={JSON.stringify(tour)} />
        </div>
    )
}

export default SingleTour