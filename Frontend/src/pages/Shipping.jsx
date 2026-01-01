import React from 'react';
import SectionHeading from '../components/UI/SectionHeading';

const Shipping = () => {
    return (
        <div className="bg-auric-blush min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
                <SectionHeading title="Shipping & Returns" subtitle="POLICIES" />

                <div className="mt-12 space-y-10 text-gray-700 leading-relaxed">
                    <section>
                        <h3 className="font-serif text-2xl font-bold text-auric-rose mb-4">Domestic Shipping</h3>
                        <p>We take great care in packaging our sacred artifacts to ensure they reach you in perfect condition. Domestic orders within India are typically delivered within 5-7 business days. We offer free shipping on all orders above ₹999.</p>
                    </section>

                    <section>
                        <h3 className="font-serif text-2xl font-bold text-auric-rose mb-4">International Shipping</h3>
                        <p>Auric Krystal ships worldwide. International delivery times vary between 10-14 business days depending on customs clearance and location. Please note that customs duties and taxes, if applicable, are to be borne by the recipient.</p>
                    </section>

                    <section>
                        <h3 className="font-serif text-2xl font-bold text-auric-rose mb-4">Returns & Exchanges</h3>
                        <p>Our goal is your complete spiritual satisfaction. If you are not happy with your purchase, you may return un-energized products in their original condition within 15 days of delivery. Please note that personalized astrology sessions and specially energized crystals are not eligible for returns.</p>
                    </section>

                    <section>
                        <h3 className="font-serif text-2xl font-bold text-auric-rose mb-4">Damaged Items</h3>
                        <p>In the rare event that an item arrives damaged, please contact our support team at hello@aurickrystal.com within 48 hours of delivery with photographic evidence of the damage. we will arrange for a replacement immediately.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
