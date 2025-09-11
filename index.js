// Importando dotenv
const dotenv = require('dotenv');
dotenv.config();

// Importando MongoDB + Mongoose
const connectMongoDBWithMongoose = require('./src/database/connectMongoDBWithMongoose');
connectMongoDBWithMongoose();

// Importando Express e colocando dentro da constante "app"
const express = require('express');
const morgan = require('morgan'); // ajuda nas requisições HTTP mostrando tipo e tempo de resposta
const app = express();
app.use(express.json()); // sinalizando que receberá JSON
app.use(express.urlencoded({ extended: true })); // facilita a parte de envio de arquivos
app.use(morgan('dev'));

const cors = require('cors'); // importando cors
const allowedOrigins = [
    'https://cestsegtrabalho.com.br',
    'https://api.cestsegtrabalho.com.br',
    'https://api.comunhaorara.com',
    'https://app.cestsegtrabalho.com.br',
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Importando https e fs
const https = require('https');
const fs = require('fs');

// * ========== ROUTERS ======== *

// * ====== Product ====== *
const routerProduct = require('./src/routers/routerProduct');
app.use('/', routerProduct);

// * ====== User ====== *
const routerUser = require('./src/routers/routerUser');
app.use('/', routerUser);

// * ====== UserStore ====== *
const routerUserStore = require('./src/routers/routerUserStore');
app.use('/', routerUserStore);

// * ====== Categoria ====== *
const routerCategoria = require('./src/routers/routerCategoria');
app.use('/', routerCategoria);

// * ====== UserStore ====== *
const routerS3 = require('./src/routers/routerS3');
app.use('/', routerS3);

// Perimetria
const routerPerimetria = require('./src/routers/routerPerimetria');
app.use('/', routerPerimetria);

// Dobras Cutaneas
const routerDobrasCutaneas = require('./src/routers/routerDobrasCutaneas');
app.use('/', routerDobrasCutaneas);

// Treino
const routerTreino = require('./src/routers/routerTreino');
app.use('/', routerTreino);

// Treino Gym
const routerTreinoGym = require('./src/routers/routertreinogym');
app.use('/', routerTreinoGym);

const resetPasswordRouter = require('./src/routers/ResetPasswordRequest');
app.use('/', resetPasswordRouter);

const routerResetPasswordUserStore = require('./src/routers/ResetPasswordRequestUserStore');
app.use('/', routerResetPasswordUserStore);

const routerURL = require('./src/routers/routerUrlsave')
app.use('/', routerURL)

const routerCurso = require('./src/routers/routerCurso')
app.use('/', routerCurso)

const routerGabarito = require('./src/routers/routerGabarito')
app.use('/', routerGabarito)

const apiWhatsapp = require('./src/routers/apiWhatsapp')
app.use('/', apiWhatsapp)

const routerHistoricoCurso = require('./src/routers/routerHistoricoCurso')
app.use('/', routerHistoricoCurso)

const routerHistoricoProva = require('./src/routers/routerHistoricoProva')
app.use('/', routerHistoricoProva)

// Definindo a porta
const port = 8081;

// Função que será executada quando o servidor ficar online
app.listen(port, '0.0.0.0', () => console.log(`Rodando com Express na porta ${port}`));
