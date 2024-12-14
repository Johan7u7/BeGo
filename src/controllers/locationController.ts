import e, { Request, Response, NextFunction } from 'express';
import { ILocation, ILocationResponse } from '../interfaces/ILocation';
import esquema from '../utils/validateesquema.js';  // Suponiendo que tienes una validación de esquema
import schema from '../config/esquemas/generales.js';
import { HTTP_CODIGOS } from '../config/codigos_http.js';
import locationDao from '../dao/location/index.js';  // Importando el DAO de Location
import { Types } from 'mongoose';
import tokenApi from '../utils/token.js';  // Para validar el token
import Location from '../models/Location.js';
import axios from 'axios';  // Importamos axios para la solicitud HTTP
import dotenv from 'dotenv';

dotenv.config();


interface Respuesta {
    codigo: string;
    mensaje: string;
    errores?: any;
    resultado?: any;
}


const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

// Crear una Location
export const createLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let respuesta: Respuesta = {
        codigo: HTTP_CODIGOS._200.contexto._000.codigo,
        mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
    };

    try {
        // Obtenemos el token de los headers
        const userToken = req.get('idsession') || '';  // Token enviado en el encabezado 'idsession'
        const idUser = req.headers.identificador_usuario as string;  // ID del usuario en los headers

        // Verificamos si se pasaron el token y el identificador de usuario
        if (!userToken || !idUser) {
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._012.codigo,
                mensaje: 'Faltan datos requeridos: idsession o identificador_usuario',
            };
            res.status(400).json(respuesta);
            return;
        }

        // Verificamos el token utilizando el JWT_SECRET
        const decoded = tokenApi.comprobarToken(userToken);

        if (!decoded) {
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._401.contexto._001.codigo,
                mensaje: 'Token inválido o expirado',
            };
            res.status(401).json(respuesta);
            return;
        }

        // Asegurarnos de que el 'user' sea un ObjectId válido
        if (!Types.ObjectId.isValid(idUser)) {
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._012.codigo,
                mensaje: 'ID de usuario no válido.',
            };
            res.status(400).json(respuesta);
            return;
        }

        const { place_id } = req.body;

        // Verificar si el place_id es válido
        if (!place_id) {
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._012.codigo,
                mensaje: 'place_id es requerido.',
            };
            res.status(400).json(respuesta);
            return;
        }

        // Llamada a la API de Google Maps para obtener las coordenadas y dirección del place_id
        const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_MAPS_API_KEY}`;
        const googleMapsResponse = await axios.get(googleMapsUrl);

        if (googleMapsResponse.data.status !== 'OK') {
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._011.codigo,
                mensaje: 'No se pudo obtener la información del lugar desde Google Maps.',
            };
            res.status(400).json(respuesta);
            return;
        }

        // Extraemos la información necesaria de la respuesta
        const { result } = googleMapsResponse.data;
        const address = result.formatted_address;
        const latitude = result.geometry.location.lat;
        const longitude = result.geometry.location.lng;

        // Verificar si la location ya existe con ese place_id
        const existingLocation = await Location.findOne({ place_id });
        if (existingLocation) {
            respuesta = {
                ...respuesta,
                codigo: HTTP_CODIGOS._400.contexto._011.codigo,
                mensaje: 'La location con ese place_id ya existe.',
            };
            res.status(400).json(respuesta);
            return;
        }

        // Crear la nueva location
        const newLocation = new Location({
            user: idUser,
            place_id,
            address,
            latitude,
            longitude,
        });

        await newLocation.save();

        // Responder con la nueva location
        respuesta = {
            ...respuesta,
            codigo: HTTP_CODIGOS._200.contexto._000.codigo,
            mensaje: 'Location creada con éxito',
            resultado: newLocation,
        };
        res.status(201).json(respuesta);
    } catch (error) {
        respuesta = {
            ...respuesta,
            codigo: HTTP_CODIGOS._500.contexto._100.codigo,
            mensaje: HTTP_CODIGOS._500.contexto._100.mensaje,
        };
        res.status(500).json(respuesta);
        next(error);  // Pasamos el error al manejador global de errores
    }
};

// Obtener todas las locations
export const getLocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Buscamos todas las ubicaciones e incluimos los datos del usuario usando populate
        const locations = await Location.find().populate('user', 'name email'); // Asumiendo que 'user' es una referencia a otro documento

        // Respondemos con las ubicaciones encontradas
        res.status(200).json(locations);
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};

// Obtener una location por ID
export const getLocationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const location = await locationDao.select.getLocationById(req.params.id);
        if (!location) {
            res.status(404).json({ message: 'Location not found' });
            return;
        }
        res.status(200).json(location);
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};

export const updateLocation = async (req: Request, res: Response<any>, next: NextFunction): Promise<Response<any>> => {
    try {
        // Obtener el ID de la ubicación registrada desde la URL
        const locationId = req.params.id;

        // Obtener el place_id desde el cuerpo de la solicitud
        const { place_id } = req.body;

        // Validar que se haya enviado un place_id
        if (!place_id) {
            return res.status(400).json({ message: 'El place_id es obligatorio' });
        }

        // Llamar a la API de Maps para obtener los detalles de la ubicación usando el place_id
        const apiResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_MAPS_API_KEY}`);
        const mapData = apiResponse.data;

        // Verificar si se obtuvo la información correctamente
        if (!mapData || mapData.status !== 'OK') {
            return res.status(404).json({ message: 'No se pudo obtener la información del lugar con el place_id proporcionado' });
        }

        // Crear el objeto con la información a actualizar (por ejemplo, address, latitude, longitude)
        const updatedData = {
            address: mapData.result.formatted_address,
            latitude: mapData.result.geometry.location.lat,
            longitude: mapData.result.geometry.location.lng,
        };

        // Buscar y actualizar la ubicación en la base de datos usando el ID de la ubicación registrada
        const updatedLocation = await Location.findByIdAndUpdate(locationId, updatedData, { new: true });

        // Si no se encontró la ubicación con ese ID
        if (!updatedLocation) {
            return res.status(404).json({ message: 'Ubicación no encontrada con el ID proporcionado' });
        }

        // Devolver la ubicación actualizada
        return res.status(200).json(updatedLocation);
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
        // Asegúrate de que si hay un error, la función se maneje correctamente.
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};


// Eliminar una location
export const deleteLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Asegurarnos de que 'identificador_usuario' sea un string y no un array
        const userId = Array.isArray(req.headers['identificador_usuario'])
            ? req.headers['identificador_usuario'][0]  // Tomamos el primer valor si es un array
            : req.headers['identificador_usuario'];  // Si no es un array, lo usamos tal cual

        if (!userId) {
            res.status(400).json({ message: 'User ID is required in headers' });
            return;
        }

        // Llamamos a la función de eliminación pasando el ID de ubicación
        const deletedLocation = await locationDao.delete.deleteLocation(req.params.id);

        if (!deletedLocation) {
            res.status(404).json({ message: 'Location not found' });
            return;
        }

        res.status(200).json({ message: 'Location deleted successfully' }); // Retornamos un mensaje de éxito
    } catch (error) {
        next(error); // Pasamos el error al manejador global de errores
    }
};
;
