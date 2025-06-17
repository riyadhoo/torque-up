
import { Star } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  image: string;
}

const Testimonial = ({ quote, author, role, rating, image }: TestimonialProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
      
      <blockquote className="text-gray-700 dark:text-gray-300 mb-6">
        "{quote}"
      </blockquote>
      
      <div className="flex items-center">
        <img 
          src={image} 
          alt={author} 
          className="w-12 h-12 rounded-full object-cover mr-4" 
        />
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials: TestimonialProps[] = [
    {
      quote: "I found exactly the engine parts I needed for my '68 Mustang restoration. The seller was knowledgeable and shipping was fast.",
      author: "Michael Johnson",
      role: "Classic Car Enthusiast",
      rating: 5,
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      quote: "Car Whisperer helped me sell my collection of BMW parts quickly. The process was smooth and I got a fair price.",
      author: "Sarah Williams",
      role: "Parts Reseller",
      rating: 4,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      quote: "As a mechanic, I rely on quality parts with detailed specifications. This marketplace has become my go-to source.",
      author: "David Rodriguez",
      role: "Professional Mechanic",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    }
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold mb-3">What Our Community Says</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of satisfied car enthusiasts who have found the perfect parts for their vehicles
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
