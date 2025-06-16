
import { CarReviewProps } from "@/types/car";

// For mock reviews since we don't have a car_reviews table yet
export const generateMockReviews = (carId: string): CarReviewProps[] => {
  return [
    {
      id: "rev1",
      car_id: carId,
      user_id: "user1",
      rating: 5,
      comment: "Great car! Very comfortable and fuel efficient.",
      created_at: new Date().toISOString(),
      user: {
        username: "carEnthusiast",
        avatar_url: null
      }
    },
    {
      id: "rev2",
      car_id: carId,
      user_id: "user2",
      rating: 4,
      comment: "Good car overall, but the cargo space is a bit limited.",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        username: "autoReviewer",
        avatar_url: null
      }
    }
  ];
};
