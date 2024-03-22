
export const endpoint = {
    url:"https://travelpalatenew-production.up.railway.app",
    foodPlaceEndpoint: "https://travelpalatenew-production.up.railway.app/items/foodPlace",
    imageEndpoint: "https://travelpalatenew-production.up.railway.app/assets",
    stateEndpoint: "https://travelpalatenew-production.up.railway.app/items/state",
    tikTokEndpoint: "https://www.tiktok.com/oembed?url="
};

export const collection = {
    foodPlace: "foodPlace",
    state: "state",
    travelPlace: "travelPlace",
    diningCatagory: "diningCategory",
    accommodationType: "accommodation_type",
    natureDestination: "nature_destination"
}

export const generateImageUrl = (id: string):string  => {
    if (typeof id === 'string' && id.length > 0) {
        // Assuming id is a valid non-empty string
        return `${endpoint.imageEndpoint}/${id}`;
    } else {
        throw new Error('Invalid or empty id provided');
    }
};
interface Data{
    version: string;
    type: string;
    title: string;
    thumbnail_url: string;
}
export const generateTiktokThumbnail = async (ttUrl: string ):Promise<string> => {
    try {
      const response = await fetch(`${endpoint.tikTokEndpoint}${ttUrl}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data :Data = await response.json();
      console.log(data.thumbnail_url, "RES"); 
    //   return await response.json();
    return data?.thumbnail_url;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };