const express = require('express');
const router = express.Router();
const fs = require('fs');

// Endpoint para crear un nuevo carrito
router.post('/', (req, res) => {
    try {
        const cartId = Date.now().toString(); // Generar un ID único para el carrito
        const newCart = {
            id: cartId,
            products: [],
        };

        fs.writeFileSync(`carrito_${cartId}.json`, JSON.stringify(newCart));
        res.json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Endpoint para obtener un carrito por su ID
router.get('/:cid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartData = fs.readFileSync(`carrito_${cartId}.json`, 'utf-8');
        const cart = JSON.parse(cartData);

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Otros endpoints para agregar, actualizar y eliminar productos del carrito

module.exports = router;
