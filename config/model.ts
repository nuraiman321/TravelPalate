// interfaces.ts
export interface FoodPlaceItem {
    category: string;
    city: string;
    date_created: string;
    date_updated: string;
    display: boolean;
    facebook_reference: string | null;
    id: string;
    image: string;
    instagram_reference: string | null;
    name: string;
    state: string;
    status: string;
    tiktok_reference: string | null;
    website_link : string | null
  };

  export interface StateItem{
    state: string;
  }
  