// interfaces.ts
export interface FoodPlaceItem {
  category: string;
  city: string;
  facebook_reference: string | null;
  id: string;
  image: string;
  instagram_reference: string | null;
  name: string;
  state: string;
  status: string;
  tiktok_reference: string | null;
  website_link: string | null;
  states: States | null;
  diningcategory: DiningCategory | null;
  state4: number | null;
  locationLink: string | null;
}
export interface TravelPlaceItem {
  City: string;
  facebook_reference: string | null;
  id: string;
  image: string;
  instagram_reference: string | null;
  name: string;
  state: string;
  status: string;
  tiktok_reference: string | null;
  website_link: string | null;
  states: States | null;
  accommodationType: AccommodationType | null;
  country: Country | null;
  natureDestination: NatureDestination | null;
  locationLink: string | null;
}

export interface StateItem {
  id: number;
  state: string;
}
export interface DiningCategoryItem {
  category: string;
}

export interface States {
  state: string | null;
  // state: string|null
}
[];

export interface DiningCategory {
  category: string | null;
  // state: string|null
}
[];
export interface AccommodationType {
  accommodationName: string;
}
[];
export interface Country {
  countryName: string ;
}
[];
export interface NatureDestination {
  natureName: string;
}
[];

export interface StuffCardInterface {
  id: number;
  prodcutTitle: string;
  imageId: string;
  price: string;
};
