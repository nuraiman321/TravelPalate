

export const endpoint = {
    foodPlaceEndpoint: "https://travelpalatenew-production.up.railway.app/items/foodPlace",
    imageEndpoint: "https://travelpalatenew-production.up.railway.app/assets",
    stateEndpoint: "https://jian.sh/malaysia-api/state/v1/all.json"
};

export const generateImageUrl = (id: string):string  => {
    if (typeof id === 'string' && id.length > 0) {
        // Assuming id is a valid non-empty string
        return `${endpoint.imageEndpoint}/${id}`;
    } else {
        throw new Error('Invalid or empty id provided');
    }
};