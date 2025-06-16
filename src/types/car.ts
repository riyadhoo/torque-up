
export interface CarProps {
  id: string;
  make: string;
  model: string;
  production_start_year: number;
  production_end_year: number;
  price: number;
  image_url: string | null;
  location: string | null;
  mileage?: number | null;
  created_at: string;
  updated_at: string;
  body_style: string;
  seating_capacity: number;
  engine_type: string;
  transmission_type: string;
  drivetrain: string;
  fuel_consumption: string;
  cargo_capacity: string;
  dimensions: string;
  category: string | null;
}

export interface CarDetailProps extends CarProps {
  reviews?: CarReviewProps[];
}

export interface CarReviewProps {
  id: string;
  car_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    username: string;
    avatar_url: string | null;
  };
}
