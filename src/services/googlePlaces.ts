import axios from 'axios';

// Función para obtener detalles de un lugar a partir del place_id
export const getLocationDetailsFromPlaceId = async (placeId: string) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeId,
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });

        const result = response.data.result;

        if (!result) {
            throw new Error('No se encontró el lugar.');
        }

        return {
            address: result.formatted_address,
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
        };
    } catch (error) {
        console.error('Error al obtener los detalles del lugar:', error);
        throw new Error('No se pudo obtener la información del lugar.');
    }
};
