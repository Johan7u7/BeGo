const regexPatternString = "^(?![nN][uU][lL]{2}$)\\s*\\S.*";  // Regex para evitar 'null' o valores vacíos

// Esquema para headers
const headerEsquema = {
    type: "object",
    properties: {
        nombre_aplicativo: {
            type: "string",
            pattern: regexPatternString,
        },
        identificador_usuario: {
            type: "string",
            pattern: regexPatternString,
        },
        idsession: {
            type: "string",
            pattern: regexPatternString,
        },
    },
    required: ["nombre_aplicativo", "identificador_usuario", "idsession"], // Todos los campos son obligatorios
};

// Esquema para body (ejemplo de validación de nombre)
const bodyEsquema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            pattern: regexPatternString,
        },
    },
    required: ["name"],
    additionalProperties: false, // No permitir propiedades adicionales
};

// Esquema para un usuario (User)
const userEsquema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            pattern: regexPatternString,
        },
        email: {
            type: "string",
            format: "email", // Validación para formato de email
        },
        password: {
            type: "string",
            minLength: 8,  // Contraseña debe tener al menos 8 caracteres
        },
    },
    required: ["name", "email", "password"], // Todos los campos son obligatorios
    additionalProperties: false, // No permitir propiedades adicionales
};

// Esquema para un camión (Truck)
const truckEsquema = {
    type: "object",
    properties: {
        year: {
            type: "string", // El año del camión
            minLength: 4,   // Asegurando que el año sea de 4 caracteres
            maxLength: 4,
        },
        color: {
            type: "string", // Color del camión
            pattern: regexPatternString,
        },
        plates: {
            type: "string", // Placas del camión
            pattern: regexPatternString,
        },
    },
    required: ["year", "color", "plates"], // Todos los campos son obligatorios
    additionalProperties: false, // No permitir propiedades adicionales
};

// Esquema para una Location
const locationEsquema = {
    type: "object",
    properties: {
        user: {
            type: "string", // ID de usuario
            pattern: regexPatternString,
        },
        place_id: {
            type: "string", // ID del lugar
            pattern: regexPatternString,
        },
        address: {
            type: "string", // Dirección de la ubicación
            pattern: regexPatternString,
        },
        latitude: {
            type: "number", // Latitud
        },
        longitude: {
            type: "number", // Longitud
        },
    },
    required: ["user", "place_id", "address", "latitude", "longitude"], // Todos los campos son obligatorios
    additionalProperties: false, // No permitir propiedades adicionales
};

// Esquema para una Order
const orderEsquema = {
    type: "object",
    properties: {
        user: {
            type: "string", // ID de usuario
            pattern: regexPatternString,
        },
        truck: {
            type: "string", // ID de camión
            pattern: regexPatternString,
        },
        status: {
            type: "string", // Estado de la orden
            enum: ["pending", "in-progress", "completed"], // Estados posibles de la orden
        },
        delivery_date: {
            type: "string", // Fecha de entrega
            format: "date", // Validación de formato de fecha
        },
    },
    required: ["user", "truck", "status", "delivery_date"], // Todos los campos son obligatorios
    additionalProperties: false, // No permitir propiedades adicionales
};

// Exportar todos los esquemas
export default {
    headerEsquema,
    bodyEsquema,
    userEsquema,         // Esquema para User
    truckEsquema,        // Esquema para Truck
    locationEsquema,     // Esquema para Location
    orderEsquema,        // Esquema para Order
};
