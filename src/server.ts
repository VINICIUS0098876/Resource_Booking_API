import Express from "express";
import cors from "cors";
import BodyParser from "body-parser";
import router from "./routes";
import swaggerUi from 'swagger-ui-express'; // <--- Importe aqui
import { swaggerDocument } from '../src/utils/swagger'; // <--- Importe seu arquivo de config
import dotenv from "dotenv";

dotenv.config();

const app = Express();



const start = async ()=>{
    app.use(cors())
    app.use(BodyParser.json())
    app.use(router)
    // Rota da Documentação
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

    try {
        app.listen(3000, ()=>{
            console.log('Server is running on port 3000')
        })
    } catch (error) {
        console.log('Error starting the server', error)
        process.exit(1)
    }
}

start()