//Databasepage

const axios = require('axios')

//importing Express
const express = require('express')
const db = express()

//signaling that it will be receive JSON
db.use(express.json())

//importing cors
const cors = require('cors')
db.use(cors())

//importing Model
const Produto = require('../models/productModel')
const pedidoModel = require('../models/pedidoModel')



// * =========================== ROUTERS =========================== *

// * ====== GET - All collections ====== *
db.get('/api/produtos', async (req, res) => {
    const all = await Produto.find()
    try {
    return res.status(200).json(all)
   } catch (error) {
    return res.status(500).send('Deu erro' + error.message)
   }
})

// * ====== POST ====== *
db.post('/api/produtos', async (req, res) => {
    const { nome, descricao, preco } = req.body;
  
    try {
      const novoProduto = new Produto({ nome, descricao, preco });
      const produtoSalvo = await novoProduto.save();
      res.json(produtoSalvo);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
  });

// * ====== PUT ====== *
// Rota para atualizar um produto por ID.
db.patch('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco } = req.body;
  
    try {
      const produtoAtualizado = await Produto.findByIdAndUpdate(
        id,
        { nome, descricao, preco },
        { new: true } // Isso retorna o objeto atualizado em vez do antigo.
      );
  
      if (!produtoAtualizado) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' });
      }
  
      res.json(produtoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
  });

// * ====== PATCH ====== *
db.patch('/create:id', async (req, res) => {
    const id = req.params.id
    try {
        const patch = new Produto.updateOne(req.body)
        //const update = await productModel.updateOne({ _id: id }) (NÃO PEGOU)
        res.status(200).json(update)
    } catch (error) {
        res.status(500).send('Deu erro' + error.message)
    }
})

// * ====== DELETE ====== *
db.delete('/api/produtos/:id', async (req, res) => {
const { id } = req.params;

  try {
    await Produto.findByIdAndDelete(id);
    res.json({ mensagem: 'Produto apagado com sucesso' });
  } catch (error) {
    console.error('Erro ao apagar produto:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
})

// * =========================== ROUTERS =========================== *

module.exports = db