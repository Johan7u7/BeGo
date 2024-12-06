import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conexión a la base de datos exitosa");
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        process.exit(1);
    }
};
