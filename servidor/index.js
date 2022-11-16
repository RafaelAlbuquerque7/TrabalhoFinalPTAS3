// JWT
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
var { expressjwt: expressJWT } = require("express-jwt");
const cors = require('cors');
const crip = require('./cripts') 

var cookieParser = require('cookie-parser')

const express = require('express');
const { usuario } = require('./models');

const app = express();

app.set('view engine', 'ejs');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

app.use(cookieParser());
app.use(
  expressJWT({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    getToken: req => req.cookies.token
  }).unless({ path: ["/", "/autenticar", "/deslogar", "/logar"] })
);

app.get('/autenticar', async function(req, res){
  res.render('autenticar');
})


app.get('/', async function(req, res){
  res.render("home")
})

app.get('/sobre', async function(req, res){
  res.render("sobre")
})

app.get('/listar', async function(req,res){
  const usuarios = await usuario.findAll();
  res.json(usuarios);
})


app.get('/cadastrar', async function(req, res){
  res.render('cadastrar')
})


app.post('/cadastrar' , async function(req,res){
  const dados = crip.encrypt(req.body.password);
const usuario_ = usuario.create(
{
  name: req.body.name,
  user:req.body.user,
  password: dados
});
console.log(req.body.name, req.body.user, dados);
res.json(usuario_);
});

app.post('/logar', async (req, res) => {
  const usuario_r = await usuario.findOne({where:{user: req.body.user}});
  const senha = crip.encrypt(req.body.password);
  if(usuario_r === null){
    res.status(500).json({message: 'Login inválido!'});
  } else if(req.body.user === usuario_r.user && senha === usuario_r.password){
    const id = 1;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 3600 // expires in 1 hour
    });

    res.cookie('token', token, { httpOnly: true });
    return res.json({ auth: true, token: token });
  } else{
    res.status(500).json({message: 'Login inválido!'});
  }

})

app.post('/deslogar', function(req, res) {
  res.cookie('token', null, { httpOnly: true });
  res.json({deslogado: true})
})

app.listen(3000, function() {
  console.log('App de Exemplo escutando na porta 3000!')
});