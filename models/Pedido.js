const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  telefone: { type: String, required: true },
  itens: { type: Array, required: true },
  total: { type: Number, required: true },
  data: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pedido", PedidoSchema);
