import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/UI/Button';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart, deleteFromCart, cartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-auric-blush px-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <Trash2 size={32} />
                </div>
                <h1 className="font-serif text-2xl font-bold text-auric-rose mb-2">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8 text-center max-w-sm">Looks like you haven't added any spiritual artifacts to your cart yet.</p>
                <Link to="/shop">
                    <Button variant="primary">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-auric-blush min-h-screen py-10">
            <div className="container mx-auto px-4">
                <h1 className="font-serif text-3xl font-bold text-auric-rose mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Cart Items */}
                    <div className="lg:w-2/3 space-y-4">
                        {cartItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="bg-white p-4 rounded-lg shadow-sm flex gap-4 border border-gray-100 items-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                                    <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-medium text-auric-rose">{item.name}</h3>
                                    <p className="text-xs text-gray-500 uppercase">{item.category}</p>
                                    <div className="mt-2 text-auric-gold font-semibold">₹{item.price * item.quantity}</div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center border border-gray-200 rounded-sm">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => deleteFromCart(item.id)}
                                        className="text-xs text-red-500 hover:text-red-700 underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <Link to="/shop" className="inline-flex items-center gap-2 text-auric-rose font-medium mt-6 hover:text-auric-gold">
                            <ArrowLeft size={16} /> Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="font-serif text-xl font-bold text-auric-rose mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-lg font-bold text-auric-rose mb-6">
                                <span>Total</span>
                                <span>₹{cartTotal}</span>
                            </div>

                            {/* <Button variant="primary" className="w-full">
                                Proceed to Checkout
                            </Button> */}
                            <Link to="/checkout" className="w-full block">
                                <Button variant="primary" className="w-full">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                Secure Checkout - SSL Encrypted
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;
