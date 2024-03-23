import { TiktokData } from "@/config/model";
export const endpoint = {
  url: "https://travelpalatenew-production.up.railway.app",
  foodPlaceEndpoint:
    "https://travelpalatenew-production.up.railway.app/items/foodPlace",
  imageEndpoint: "https://travelpalatenew-production.up.railway.app/assets",
  stateEndpoint:
    "https://travelpalatenew-production.up.railway.app/items/state",
  tikTokEndpoint: "https://www.tiktok.com/oembed?url=",
};

export const collection = {
  foodPlace: "foodPlace",
  state: "state",
  travelPlace: "travelPlace",
  diningCatagory: "diningCategory",
  accommodationType: "accommodation_type",
  natureDestination: "nature_destination",
};

export const generateImageUrl = (id: string): string => {
  if (typeof id === "string" && id.length > 0) {
    // Assuming id is a valid non-empty string
    return `${endpoint.imageEndpoint}/${id}`;
  } else {
    throw new Error("Invalid or empty id provided");
  }
};

export const generateTiktokThumbnail = async (
  ttUrl: string | null
): Promise<TiktokData | null> => {
  try {
    const response = await fetch(`${endpoint.tikTokEndpoint}${ttUrl}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: TiktokData = await response.json();
    //   return await response.json();
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
