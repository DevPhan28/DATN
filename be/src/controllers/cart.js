const Cart = require("../models/cart");
const Product = require("../models/product"); // Model sản phẩm

// Lấy giỏ hàng theo userId
const getCartByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId", "name price image variants");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }
    
    const cartData = {
      products: cart.products.map((item) => {
        if (!item?.productId) {
          return null; // Bỏ qua sản phẩm không tồn tại
        }

        // Tìm biến thể dựa trên sku
        const selectedVariant = item.productId.variants.find(variant => variant.sku === item.variantId);

        return {
          productId: item.productId._id,
          name: item.productId.name,
          image: item.productId.image,
          price: selectedVariant ? selectedVariant.price : item.productId.price,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          variantId: item.variantId,
          size: selectedVariant ? selectedVariant.size : null, 
          color: selectedVariant ? selectedVariant.color : null, 
        };
      }).filter(product => product !== null), // Loại bỏ sản phẩm null
    };

    return res.status(200).json(cartData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Thêm sản phẩm vào giỏ hàng
const addItemToCart = async (req, res) => {
  const { userId, products } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    for (const { productId, variantId, quantity, priceAtTime } of products) {
      // Kiểm tra nếu thiếu dữ liệu cần thiết
      if (!productId || !variantId || !priceAtTime || !quantity || isNaN(priceAtTime) || isNaN(quantity)) {
        return res.status(400).json({ message: 'Invalid product data: productId, variantId, priceAtTime, and quantity are required and must be valid numbers.' });
      }

      // Lấy sản phẩm từ cơ sở dữ liệu để kiểm tra tồn kho
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Tìm variant theo variantId (lưu theo SKU)
      const variant = product.variants.find(v => v.sku === variantId);
      if (!variant) {
        return res.status(404).json({ message: 'Product variant not found' });
      }

      // Kiểm tra tồn kho
      if (quantity > variant.countInStock) {
        return res.status(400).json({
          message: `Số lượng vượt quá tồn kho. Chỉ còn lại ${variant.countInStock} sản phẩm.`,
        });
      }

      const existProductIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId && item.variantId === variantId
      );

      if (existProductIndex !== -1) {
        // Nếu sản phẩm đã tồn tại trong giỏ, chỉ tăng số lượng
        cart.products[existProductIndex].quantity += quantity;
        cart.products[existProductIndex].totalPrice += priceAtTime * quantity;
      } else {
        // Thêm sản phẩm mới vào giỏ
        cart.products.push({
          productId,
          variantId,
          quantity,
          priceAtTime,
          totalPrice: priceAtTime * quantity,
        });
      }
    }

    await cart.save();
    return res.status(201).json({ cart, message: "Đã thêm vào giỏ hàng" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const deleteItemFromCart = async (req, res) => {
  const { userId, productId, variantId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }

    cart.products = cart.products.filter(
      (product) => product.productId && product.productId.toString() !== productId && product.variantId !== variantId
    );
    await cart.save();
    return res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateQuantityCart = async (req, res) => {
  const { userId, productId, variantId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Không có giỏ hàng nào" });
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === productId && item.variantId === variantId
    );
    if (!product) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }

    product.quantity = quantity;
    product.totalPrice = product.priceAtTime * quantity;

    await cart.save();
    return res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tăng số lượng sản phẩm trong giỏ hàng
const increaseProductQuantity = async (req, res) => {
  const { userId, productId, variantId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === productId && item.variantId === variantId
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    product.quantity++;
    product.totalPrice += product.priceAtTime;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Giảm số lượng sản phẩm trong giỏ hàng
const decreaseProductQuantity = async (req, res) => {
  const { userId, productId, variantId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === productId && item.variantId === variantId
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (product.quantity > 1) {
      product.quantity--;
      product.totalPrice -= product.priceAtTime;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng của user
const removeFromCart = async (req, res) => {
  const { userId, productId, variantId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (product) => product.productId && product.productId.toString() !== productId && product.variantId !== variantId
    );

    await cart.save();
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng của user
const updateProductQuantity = async (req, res) => {
  const { userId, productId, variantId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === productId && item.variantId === variantId
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.quantity = quantity;
    product.totalPrice = product.priceAtTime * quantity;

    await cart.save();
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getCartByUserId,
  addItemToCart,
  deleteItemFromCart,
  updateQuantityCart,
  increaseProductQuantity,
  decreaseProductQuantity,
  removeFromCart,
  updateProductQuantity,
};
