const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido");
const pedidoRoutes = require("./routes/pedidos");

router.post("/", async (req, res) => {
  const novoPedido = new Pedido(req.body);
  try {
    const pedidoSalvo = await novoPedido.save();
    res.status(201).json(pedidoSalvo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).json(pedidos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
