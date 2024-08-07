const express = require('express');
const routerTreino = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/authMiddleware');
const Treino = require('../models/treinoModel')

routerTreino.use(express.json());
routerTreino.use(cors());

// Rota para buscar todos os treinos
routerTreino.get('/treino/buscar', async (req, res) => {
    try {
        const all = await Treino.find();
        return res.status(200).json(all);
    } catch (error) {
        return res.status(500).send('Deu erro' + error.message);
    }
});

// Rota para buscar o perfil do usuário pelo nome de usuário e exibir na url
routerTreino.get('/prova/:nameUrl', async (req, res) => {
    try {
        const nameUrl = req.params.nameUrl;
        const url = await Treino.findOne({ nameUrl });
  
        if (!url) {
            return res.status(404).json({ message: 'nameUrl não encontrada' });
        }
  
        // Retorne os detalhes do usuário, como desejado
        return res.status(200).json(url);
    } catch (error) {
        console.error('Erro ao buscar nameUrl:', error);
        res.status(500).json({ message: 'Erro ao buscar nameUrl', });
    }
});

// // Rota para buscar treino pelo ID do usuário
// routerTreino.get('/treino/:userid', async (req, res) => {
//     const { userid } = req.params;

//     try {
//         const treino = await Treino.find({ userid });

//         if (!treino || treino.length === 0) {
//             return res.status(404).json({ mensagem: 'Nenhum treino encontrado para este usuário' });
//         }

//         return res.status(200).json(treino);
//     } catch (error) {
//         console.error('Erro ao buscar treino:', error);
//         return res.status(500).json({ mensagem: 'Erro interno do servidor' });
//     }
// });

// // Rota para buscar treino pelo ID do personal
// routerTreino.get('/treinoPersonal/:storeid', async (req, res) => {
//     const { storeid } = req.params;

//     try {
//         const treino = await Treino.find({ storeid });

//         if (!treino || treino.length === 0) {
//             return res.status(404).json({ mensagem: 'Nenhum treino encontrado para este personal' });
//         }

//         return res.status(200).json(treino);
//     } catch (error) {
//         console.error('Erro ao buscar treino:', error);
//         return res.status(500).json({ mensagem: 'Erro interno do servidor' });
//     }
// });

// Rota para criar treino
routerTreino.post('/treino/criar', authenticateToken, async (req, res) => {
    const { treino1, treino2, treino3, treino4, treino5, userid, storeid, nameUrl, nameProva, linkUrl } = req.body;
    try {
        const novoTreino = new Treino({ treino1, treino2, treino3, treino4, treino5, userid, storeid, nameUrl, nameProva, linkUrl });
        await novoTreino.save();
        res.status(200).json(novoTreino);
    } catch (error) {
        console.error('Erro ao criar treino:', error);
        res.status(500).json({ mensagem: 'Você pode não estar logado' });
    }
});

// Rota para atualizar treino pelo ID
routerTreino.patch('/treino/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const treinoAtualizado = await Treino.findByIdAndUpdate(id, updates, { new: true });
        if (!treinoAtualizado) {
            return res.status(404).json({ mensagem: 'Treino não encontrado' });
        }
        res.status(200).json(treinoAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar treino:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
});

// Rota para deletar treino por ID
routerTreino.delete('/treino/:id', authenticateToken, async (req, res) => {
    const treinoId = req.params.id;

    try {
        await Treino.findByIdAndDelete(treinoId);
        res.status(200).json({ message: 'Treino deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar treino:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});



module.exports = routerTreino;
