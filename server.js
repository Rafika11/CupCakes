// cd "/c/Users/rafae/Desktop/ENGENHARIA SOFTWARE/2024/02° SEMESTRE/PROJETO INTEGRADOR TRASNDISCIPLINAR EM ENGENHARIA DE SOFTWARE II/Projeto Final/ProjetoBackEnd/Projeto Fase 1"

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

// Configurar CSP para permitir estilos de fontes confiáveis
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://www.gstatic.com"],
    },
  })
);

// Servir arquivos estáticos da pasta 'public'
app.use(express.static("public"));

// Rota para a página inicial
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado ao MongoDB");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });

const pedidoRoutes = require("./routes/pedidos");
app.use("/api/pedidos", pedidoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
