import express from 'express';


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.listen(3000, () =>{
    console.log("server rodando na porta: " + PORT)
})

app.get('/primeiro', (req, res) =>{

    return res.status(200).json({primeiro: "primeiro get feito sozinho"})
});