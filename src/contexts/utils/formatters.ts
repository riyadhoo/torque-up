
import { Language } from '../types/language';

export const createFormatPrice = (language: Language, t: (key: string) => string) => {
  return (price: number): string => {
    const currency = t('common.currency');
    if (language === 'ar') {
      return `${price.toLocaleString()} ${currency}`;
    }
    return `${price.toLocaleString()} ${currency}`;
  };
};
