import express from 'express';
import jogarRoutes from './routes/jogarRoutes';
import iniciarRoute from './routes/iniciarRoutes';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () =>{
    console.log("server rodando na porta: " + PORT)
})

app.use('/iniciar', iniciarRoute);
app.use('/jogar', jogarRoutes);