// Carregar variáveis de ambiente do arquivo .env
require("dotenv").config();

// Importar módulos necessários
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

// Configurar Mongoose strictQuery
mongoose.set("strictQuery", false); // ou true, conforme necessário

// Criar instância do express
const app = express();

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

// Configurar CSP para permitir estilos de fontes confiáveis
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "https://www.gstatic.com",
        "https://fonts.googleapis.com",
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Adicione isso se precisar de scripts inline
    },
  })
);

// Servir arquivos estáticos da pasta 'public'
app.use(express.static("public"));

// Rota para a página inicial
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Conectar ao MongoDB
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
    process.exit(1); // Terminar o processo com erro
  });

// Importar e usar as rotas de pedidos
const pedidoRoutes = require("./routes/pedidos");
app.use("/api/pedidos", pedidoRoutes);

// Definir a porta e iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
