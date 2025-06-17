
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  recommendations?: {
    type: 'cars' | 'parts';
    items: any[];
    title: string;
  };
}
