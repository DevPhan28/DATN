import Cart from "../models/cart";

export const getCartByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }
    const cartData = {
      products: cart.products.map((item) => {
        if (!item?.productId) {
          return null; // Bỏ qua sản phẩm không tồn tại
        }
        return {
          productId: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
        };
      }).filter(product => product !== null), // Loại bỏ sản phẩm null
    };

    return res.status(201).json(cartData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const addItemToCart = async (req, res) => {
  const { userId, products } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    products.forEach(({ productId, quantity }) => {
      const existProductIndex = cart.products.findIndex(
        (item) => item.productId.toString() == productId
      );
      if (existProductIndex !== -1) {
        cart.products[existProductIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    });

    await cart.save();
    return res.status(201).json({ cart, message: "Đã thêm vào giỏ hàng" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteItemFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    cart.products = cart.products.filter(
      (product) =>
        product.productId && product.productId.toString() !== productId
    );
    await cart.save();
    return res.status(201).json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateQuantityCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Không có giỏ hàng nào" });
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === productId
    );
    if (!product) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    product.quantity = quantity;
    await cart.save();
    return res.status(201).json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Tăng số lượng của sản phẩm trong giỏ hàng
export const increaseProductQuantity = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = cart.products.find((item) => item.productId.toString() === productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    product.quantity++;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Giảm số lượng của sản phẩm trong giỏ hàng
export const decreaseProductQuantity = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = cart.products.find((item) => item.productId.toString() === productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (product.quantity > 1) {
      product.quantity--;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Xóa sản phẩm trong giỏ hàng thuộc 1 user

export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Cart not found" });
    }
    cart.products = cart.products.filter(
      (product) => product.productId && product.productId.toString() !== productId
    );

    await cart.save();
    return res.status(StatusCodes.OK).json({ cart });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Internal Server Error" });
  }
};
// Cập nhật số lượng sản phẩm trong giỏ hàng thuộc 1 user
export const updateProductQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Cart not found" });
    }

    const product = cart.products.find((item) => item.productId.toString() === productId);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found" });
    }
    product.quantity = quantity;
    await cart.save();
    return res.status(StatusCodes.OK).json({ cart });
  } catch (error) { }
};