//importing Express
const express = require('express')
const routerUser = express()

//importing cors
const cors = require('cors')
routerUser.use(cors())

//importing bcrypt
const bcrypt = require('bcrypt')

//importing JWT
const jwt = require('jsonwebtoken')

//importing BodyParser
const bodyParser = require('body-parser')

//importing Model
const User = require('../models/UserModel')

//signaling that it will be receive JSON
routerUser.use(bodyParser.json())

const cookieParser = require("cookie-parser") 

routerUser.use(cookieParser())

routerUser.get("/um", (req, res) => {
  res.render("Login")
})

routerUser.get('/dois', (req, res) => {
  res.render("Signup")
})


// * ==================== GET - Pega todos os usuários ==================== *
routerUser.get('/user', async (req, res) => {
    const all = await User.find()
    try {
    return res.status(200).json(all)
   } catch (error) {
    return res.status(500).send('Deu erro' + error.message)
   }
})
// * ==================== GET - Pega todos os usuários ==================== *





//*===================== CADASTRAR USUÁRIO =====================*
routerUser.post('/register', (req, res) => {
    const { name, phone, email, nascimento, password} = req.body;

    // Verifique se o usuário já existe
    User.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(400).json({ message: 'Usuário já existe' });
            }

            // Criptografe a senha do usuário
            bcrypt.hash(password, 10)
                .then((hashedPassword) => {

                    // Crie o novo usuário
                    const newUser = new User({
                        name,
                        phone,
                        email,
                        nascimento,
                        password: hashedPassword,
                    });

                    // Salve o usuário no banco de dados
                    newUser.save()
                        .then(() => {
                            res.status(201).json({ message: 'Usuário registrado com sucesso' });
                        })
                        .catch((error) => {
                            console.error('Erro ao criar usuário:', error);
                            res.status(500).json({ message: 'Erro ao criar usuário' });
                        });
                })
                .catch((error) => {
                    console.error('Erro ao criar usuário:', error);
                    res.status(500).json({ message: 'Erro ao criar usuário' });
                });
        })
        .catch((error) => {
            console.error('Erro ao verificar usuário existente:', error);
            res.status(500).json({ message: 'Erro ao verificar usuário existente:' });
        });
});
//*===================== CADASTRAR USUÁRIO =====================*



//*===================== lOGIN =====================*
routerUser.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Encontre o usuário pelo email
  User.findOne({ email }) 
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      // Verifique a senha usando bcrypt
      bcrypt.compare(password, user.password)
        .then(result => {
          if (!result) {
            return res.status(401).json({ message: 'Senha inválida' });
          }

          // Crie um token JWT
          const secretKey = 'suaChaveSecreta'; // Substitua com a sua chave secreta
          const token = jwt.sign({ email, result }, '123');

          return res.json({ auth: true, token });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: 'Erro ao verificar a senha' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Erro ao buscar o usuário' });
    });
});


//*===================== lOGIN =====================*


//*===================== ROTA PROTEGIDA =====================*
routerUser.get('/protected', (req, res) => {
  //recebe o token do frontend
  const token = req.headers.authorization;

  //Se não houver token, retorna esse código
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  // Substitua com a sua chave secreta
  const secretKey = '123';

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      //se token for falso
      return res.status(401).json({ message: 'Token inválido' + JSON.stringify(token) });
    }

    //Decodifique o token para obter informações do usuário
    const userEmail = decoded.email;

    res.json({ message: 'Rota protegida acessada com sucesso', userEmail });
  });
});
//*===================== ROTA PROTEGIDA =====================*

module.exports = routerUser