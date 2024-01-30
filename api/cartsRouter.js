const express = require('express');
const router = express.Router();
const CartModel = require('../dao/models/CartModel');
const ProductModel = require('../dao/models/ProductModel');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await CartModel.create({ products: [] });
        res.json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Verificar si el carrito y el producto existen
        const cart = await CartModel.findById(cid);
        const product = await ProductModel.findById(pid);

        if (!cart || !product) {
            return res.status(404).send('Carrito o producto no encontrado');
        }

        // Agregar el producto al carrito con la cantidad especificada
        cart.products.push({ product: pid, quantity });
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Verificar si el carrito y el producto existen
        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Buscar el producto en el carrito y actualizar su cantidad
        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).send('Producto no encontrado en el carrito');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // Verificar si el carrito existe
        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Eliminar el producto del carrito
        cart.products = cart.products.filter(item => item.product.toString() !== pid);
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Obtener todos los productos en el carrito
router.get('/:cid/products', async (req, res) => {
    try {
        const { cid } = req.params;

        // Verificar si el carrito existe
        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Obtener los detalles de cada producto en el carrito
        const products = [];
        for (const item of cart.products) {
            const product = await ProductModel.findById(item.product);
            if (product) {
                products.push({ product, quantity: item.quantity });
            }
        }

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
