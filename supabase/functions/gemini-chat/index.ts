
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, cars, context } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Initialize Supabase client for fetching parts
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const systemPrompt = `You are a friendly automotive expert who helps people with their car needs. Your goal is to understand what they need through conversation and provide appropriate help.

CONVERSATION STYLE:
- Keep responses short (2-4 sentences max)
- Be warm and conversational
- Use simple, everyday language
- Listen to what the user actually needs before offering specific help

APPROACH:
1. FIRST - Understand what the user needs:
   - Are they looking for car recommendations?
   - Do they have a car problem to diagnose?
   - Are they looking for specific parts?
   - Do they need general automotive advice?

2. ONLY provide recommendations or diagnostics AFTER understanding their specific need

3. If they want car recommendations, ask about:
   - Their main use case (city driving, family trips, etc.)
   - Their budget range
   - Size preferences
   - Any brand preferences

4. If they have car problems, ask about:
   - What symptoms they're experiencing
   - When the problem occurs
   - Any recent changes or maintenance

CAR RECOMMENDATION PROCESS (only after they ask for car recommendations):
When someone explicitly asks for car recommendations, follow this structured approach:

1. Ask about their PRIMARY NEED:
   "What will you mainly use this car for?
   A) Daily commuting in the city
   B) Family trips and errands  
   C) Weekend adventures/off-road
   D) Business/professional use"

2. Ask about BUDGET:
   "What's your budget range?
   A) Under 1,000,000 DA
   B) 1,000,000 - 2,000,000 DA
   C) 2,000,000 - 3,000,000 DA
   D) Above 3,000,000 DA"

3. Ask about SIZE PREFERENCE:
   "What size car works best for you?
   A) Compact (easy parking, fuel efficient)
   B) Medium (balanced space and efficiency)
   C) Large (maximum space and comfort)
   D) SUV (high seating, versatility)"

4. FINAL RECOMMENDATION - After getting answers, provide recommendations with [RECOMMEND_CARS]

DIAGNOSTIC APPROACH (only for car problems):
- Ask ONE specific clarifying question about symptoms
- Provide brief diagnosis with 2-3 possibilities
- Include [RECOMMEND_PARTS:part_type] when suggesting parts

BRAND PREFERENCE HANDLING:
- If user mentions a specific brand, prioritize that brand in recommendations
- If no cars from preferred brand are available, acknowledge this and suggest alternatives

IMPORTANT: 
- Only use [RECOMMEND_CARS] when you have enough information to make car recommendations
- Only use [RECOMMEND_PARTS:part_type] when diagnosing car problems
- Don't automatically offer recommendations - wait for the user to express their specific need

Available cars in inventory: ${JSON.stringify(cars.slice(0, 15))}

Remember: Listen first, understand their need, then provide appropriate help!`;

    // Include conversation context
    const contextMessages = context?.previousMessages || [];
    const conversationContext = contextMessages.length > 0 
      ? `Previous conversation: ${contextMessages.map(m => `${m.isUser ? 'User' : 'Assistant'}: ${m.text}`).join('\n')}`
      : '';

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\n${conversationContext}\n\nUser message: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, response.statusText, errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    let recommendations = null;

    console.log('AI Response before processing:', aiResponse);

    // Check for car recommendations
    if (aiResponse.includes('[RECOMMEND_CARS]')) {
      console.log('Car recommendations detected, processing...');
      aiResponse = aiResponse.replace('[RECOMMEND_CARS]', '').trim();
      
      // Enhanced car filtering based on conversation context
      const userMessages = contextMessages.filter(m => m.isUser).map(m => m.text.toLowerCase());
      const currentMessage = message.toLowerCase();
      const allUserText = [...userMessages, currentMessage].join(' ');
      
      console.log('All user text for filtering:', allUserText);
      
      let filteredCars = [...cars];
      
      // Enhanced brand filtering - check for specific car makes
      const carBrands = ['volkswagen', 'toyota', 'honda', 'bmw', 'mercedes', 'audi', 'ford', 'chevrolet', 'nissan', 'hyundai', 'kia', 'mazda', 'subaru', 'lexus', 'infiniti', 'acura', 'volvo', 'jaguar', 'land rover', 'porsche', 'ferrari', 'lamborghini', 'bentley', 'rolls royce', 'maserati', 'alfa romeo', 'fiat', 'jeep', 'dodge', 'chrysler', 'cadillac', 'lincoln', 'buick', 'gmc', 'ram', 'tesla', 'peugeot', 'citroen', 'renault', 'dacia', 'skoda', 'seat'];
      
      for (const brand of carBrands) {
        if (allUserText.includes(brand)) {
          const brandFilteredCars = filteredCars.filter(car => 
            car.make.toLowerCase().includes(brand) || car.make.toLowerCase() === brand
          );
          if (brandFilteredCars.length > 0) {
            filteredCars = brandFilteredCars;
            console.log(`Filtered by brand: ${brand}, found ${filteredCars.length} cars`);
            break;
          }
        }
      }
      
      // Budget filtering (only if no specific brand preference dominated the filtering)
      if (allUserText.includes('under 1,000,000') || allUserText.includes('budget a') || allUserText.includes('cheap')) {
        filteredCars = filteredCars.filter(car => car.price < 15000);
      } else if (allUserText.includes('1,000,000') && allUserText.includes('2,000,000')) {
        filteredCars = filteredCars.filter(car => car.price >= 15000 && car.price < 25000);
      } else if (allUserText.includes('2,000,000') && allUserText.includes('3,000,000')) {
        filteredCars = filteredCars.filter(car => car.price >= 25000 && car.price < 35000);
      } else if (allUserText.includes('above 3,000,000') || allUserText.includes('expensive') || allUserText.includes('luxury')) {
        filteredCars = filteredCars.filter(car => car.price >= 35000);
      }
      
      // Usage-based filtering
      if (allUserText.includes('city') || allUserText.includes('commut')) {
        filteredCars = filteredCars.filter(car => 
          car.body_style?.toLowerCase().includes('sedan') || 
          car.body_style?.toLowerCase().includes('hatch') ||
          car.fuel_consumption?.toLowerCase().includes('efficient')
        );
      } else if (allUserText.includes('family') || allUserText.includes('trip')) {
        filteredCars = filteredCars.filter(car => 
          car.seating_capacity >= 5 ||
          car.body_style?.toLowerCase().includes('suv') ||
          car.body_style?.toLowerCase().includes('sedan')
        );
      } else if (allUserText.includes('adventure') || allUserText.includes('off-road')) {
        filteredCars = filteredCars.filter(car => 
          car.body_style?.toLowerCase().includes('suv') ||
          car.drivetrain?.toLowerCase().includes('awd') ||
          car.drivetrain?.toLowerCase().includes('4wd')
        );
      } else if (allUserText.includes('business') || allUserText.includes('professional')) {
        filteredCars = filteredCars.filter(car => 
          car.body_style?.toLowerCase().includes('sedan') ||
          car.category?.toLowerCase().includes('luxury')
        );
      }
      
      // Size preference filtering
      if (allUserText.includes('compact')) {
        filteredCars = filteredCars.filter(car => 
          car.body_style?.toLowerCase().includes('hatch') ||
          car.body_style?.toLowerCase().includes('compact')
        );
      } else if (allUserText.includes('large') || allUserText.includes('suv')) {
        filteredCars = filteredCars.filter(car => 
          car.body_style?.toLowerCase().includes('suv') ||
          car.seating_capacity >= 7
        );
      }
      
      // If no cars match the criteria, provide feedback
      if (filteredCars.length === 0) {
        console.log('No cars found after filtering, using fallback');
        // Check if user mentioned a specific brand that we don't have
        for (const brand of carBrands) {
          if (allUserText.includes(brand)) {
            aiResponse += ` Unfortunately, we don't have any ${brand.charAt(0).toUpperCase() + brand.slice(1)} vehicles in our current inventory. Would you like me to suggest similar cars from other brands?`;
            break;
          }
        }
        filteredCars = cars.slice(0, 4);
      } else {
        filteredCars = filteredCars.slice(0, 4);
      }
      
      console.log('Final filtered cars:', filteredCars.length);
      
      recommendations = {
        type: 'cars',
        items: filteredCars,
        title: 'Perfect Cars for You'
      };
    }

    // Check for parts recommendations
    const partsMatch = aiResponse.match(/\[RECOMMEND_PARTS:([^\]]+)\]/);
    if (partsMatch) {
      const partType = partsMatch[1];
      aiResponse = aiResponse.replace(partsMatch[0], '').trim();
      
      // Extract car make/model from previous messages to filter parts
      const userMessages = contextMessages.filter(m => m.isUser).map(m => m.text.toLowerCase());
      const currentMessage = message.toLowerCase();
      const allUserText = [...userMessages, currentMessage].join(' ');
      
      // Fetch parts from database
      let query = supabase
        .from('approved_parts')
        .select('id, title, price, condition, image_url, compatible_cars, seller_id')
        .ilike('title', `%${partType}%`)
        .limit(4);

      const { data: partsData, error: partsError } = await query;
      
      if (!partsError && partsData) {
        // Get profiles for sellers
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username');
        
        const formattedParts = partsData.map((part) => {
          const sellerProfile = profilesData?.find((profile) => profile.id === part.seller_id);
          return {
            id: part.id,
            title: part.title,
            price: part.price,
            condition: part.condition,
            image_url: part.image_url,
            compatible_cars: part.compatible_cars,
            seller: {
              username: sellerProfile?.username || "Unknown seller",
            }
          };
        });

        recommendations = {
          type: 'parts',
          items: formattedParts,
          title: `${partType.charAt(0).toUpperCase() + partType.slice(1)} Parts for Your Car`
        };
      }
    }

    console.log('Final recommendations:', recommendations);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      recommendations: recommendations 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
