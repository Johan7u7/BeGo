interface ErrorDetail {
    code: string;
    message: string;
}

interface RespJSON {
    codigo: string;
    errores: ErrorDetail[];
    mensaje: string;
    resultado: any[];
}

// Definición de la respuesta estándar
const respJSON: RespJSON = {
    codigo: "",
    errores: [],
    mensaje: "",
    resultado: []
};

export default respJSON;
export { ErrorDetail };  // Exportamos ErrorDetail si lo necesitas en otros archivos
