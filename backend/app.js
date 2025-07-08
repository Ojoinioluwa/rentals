// utils/geocode.ts
import axios from 'axios';

export const getCoordinatesFromLocation = async (location) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: location,
                format: 'json',
                addressdetails: 1,
                limit: 1,
            },
            headers: {
                'Accept-Language': 'en',
                'User-Agent': 'expo-app-rental/1.0 (your-email@example.com)',
            },
        });

        if (response.data && response.data.length > 0) {
            const place = response.data[0];
            return {
                latitude: parseFloat(place.lat),
                longitude: parseFloat(place.lon),
                display_name: place.display_name,
            };
        } else {
            return null; // No results found
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
};


