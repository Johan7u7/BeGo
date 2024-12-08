const regexPatternString = "^(?![nN][uU][lL]{2}$)\\s*\\S.*";

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

// Esquema para body
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
export default {
    headerEsquema,
    bodyEsquema,
    truckEsquema
};
