import React from 'react';
import SectionHeading from '../components/UI/SectionHeading';

const Privacy = () => {
    return (
        <div className="bg-auric-blush min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
                <SectionHeading title="Privacy Policy" subtitle="LEGAL" />

                <div className="mt-12 space-y-8 text-gray-700 leading-relaxed">
                    <p>At Auric krystals, we are committed to protecting your privacy and personal spiritual information. This policy outlines how we collect, use, and safeguard your data.</p>

                    <section>
                        <h3 className="font-serif text-xl font-bold text-auric-rose mb-3">Information Collection</h3>
                        <p>We collect information you provide when creating an account, making a purchase, or booking a consultation. This includes your name, contact details, and for astrology services, your birth data (date, time, and place of birth).</p>
                    </section>

                    <section>
                        <h3 className="font-serif text-xl font-bold text-auric-rose mb-3">Usage of Data</h3>
                        <p>Your birth data is used solely for the purpose of generating your astrological charts and providing accurate consultations. We do not share your personal information with third parties except as required for order fulfillment (e.g., shipping carriers).</p>
                    </section>

                    <section>
                        <h3 className="font-serif text-xl font-bold text-auric-rose mb-3">Security</h3>
                        <p>We implement industry-standard security measures to protect your data. All transactions are processed through secure, SSL-encrypted gateways.</p>
                    </section>

                    <section>
                        <h3 className="font-serif text-xl font-bold text-auric-rose mb-3">Refunds and Returns</h3>
                        <p>No exchange. No return | No refund.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
