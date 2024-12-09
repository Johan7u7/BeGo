interface Contexto {
  [key: string]: {
    codigo: string;
    mensaje: string;
  };
}

interface HttpCodigo {
  estatus: number;
  contexto: Contexto;
}

export const HTTP_CODIGOS: { [key: string]: HttpCodigo } = {
  _200: {
    estatus: 200,
    contexto: {
      _000: { codigo: "000", mensaje: "Operación exitosa" },
      _001: { codigo: "001", mensaje: "Error en validación" },
    },
  },
  _201: {
    estatus: 201,
    contexto: {
      _000: { codigo: "000", mensaje: "Operación exitosa" },
    },
  },
  _400: {
    estatus: 400,
    contexto: {
      _000: { codigo: "400", mensaje: "Petición Incorrecta" },
      _010: { codigo: "010", mensaje: "Cabeceras inválidas" },
      _011: { codigo: "011", mensaje: "Esquema inválido" },
      _012: { codigo: "012", mensaje: "Body inválido" },
      _013: { codigo: "013", mensaje: "Error al registrar descuento" },
      _0404: { codigo: "0404", mensaje: "No hay resultados" },
      _014: { codigo: "014", mensaje: "La fecha fin debe de ser mayor" },
    },
  },
  _401: {
    estatus: 401,
    contexto: {
      _000: { codigo: "401-0", mensaje: "Usuario o Contraseña Incorrectos." },
      _010: { codigo: "401-10", mensaje: "No autorizado." },
      _011: { codigo: "401-11", mensaje: "Ha ocurrido un error." },
    },
  },
  _500: {
    estatus: 500,
    contexto: {
      _100: { codigo: "100", mensaje: "Error general..." },
      _101: { codigo: "101", mensaje: "Error al ejecutar proceso" },
    },
  },
};
