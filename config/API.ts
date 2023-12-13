
export const endpoint = {
    url:"https://travelpalatenew-production.up.railway.app",
    foodPlaceEndpoint: "https://travelpalatenew-production.up.railway.app/items/foodPlace",
    imageEndpoint: "https://travelpalatenew-production.up.railway.app/assets",
    stateEndpoint: "https://travelpalatenew-production.up.railway.app/items/state"
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