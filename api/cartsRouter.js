const express = require('express');
const router = express.Router();
const CartModel = require('../dao/models/CartModel');
const ProductModel = require('../dao/models/ProductModel');

// Endpoint para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await CartModel.create({ products: [] });
        res.json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Endpoint para agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Verifica si el carrito y el producto existen
        const cart = await CartModel.findById(cid);
        const product = await ProductModel.findById(pid);

        if (!cart || !product) {
            return res.status(404).send('Carrito o producto no encontrado');
        }

        // Agrega el producto al carrito con la cantidad especificada
        cart.products.push({ product: pid, quantity });
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Otros endpoints para actualizar y eliminar productos del carrito

module.exports = router;
