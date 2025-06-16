
import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const obfuscateEmail = (email: string) => {
  return email.replace('@', ' [at] ').replace('.', ' [dot] ');
};

export const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Get in Touch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start space-x-4">
            <Mail className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground" title="torqueup.contact@gmail.com">
                {obfuscateEmail('torqueup.contact@gmail.com')}
              </p>
              <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Phone className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-muted-foreground">+213 788 95 56 52</p>
              <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-muted-foreground">
                123 Auto Parts Street<br />
                Automotive District<br />
                Algiers, Algeria
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why Choose Us?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Quality Parts</h4>
            <p className="text-sm text-muted-foreground">Genuine and high-quality automotive parts from trusted suppliers</p>
          </div>
          <div>
            <h4 className="font-semibold">Expert Support</h4>
            <p className="text-sm text-muted-foreground">Our team of automotive experts is here to help you find the right parts</p>
          </div>
          <div>
            <h4 className="font-semibold">Fast Delivery</h4>
            <p className="text-sm text-muted-foreground">Quick and reliable delivery across Algeria</p>
          </div>
          <div>
            <h4 className="font-semibold">Competitive Prices</h4>
            <p className="text-sm text-muted-foreground">Best prices in the market with regular promotions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
