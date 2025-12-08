import express from 'express';

import iniciarRoute from './routes/iniciarRoutes';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.listen(3000, () =>{
    console.log("server rodando na porta: " + PORT)
})

app.use('/iniciar', iniciarRoute);
