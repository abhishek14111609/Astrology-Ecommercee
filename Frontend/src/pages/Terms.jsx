import React from 'react';
import SectionHeading from '../components/UI/SectionHeading';

const Terms = () => {
    return (
        <div className="bg-auric-blush min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
                <SectionHeading title="Terms of Harmony" subtitle="LEGAL" />

                <div className="mt-12 space-y-8 text-gray-700 leading-relaxed">
                    <p>By accessing the Auric Krystal sanctuary, you agree to abide by these terms of service.</p>

                    <section>
                        <h3 className="font-serif text-xl font-bold text-auric-rose mb-3">Service Guidelines</h3>
                        <p>Our astrology services and products are designed for spiritual guidance and entertainment. They should not be used as a substitute for professional medical, legal, or financial advice.</p>
                    </section>

                    <section>
                        <h3 className="font-serif text-xl font-bold text-auric-rose mb-3">Intellectual Property</h3>
                        <p>All content on this site, including text, designs, and brand imagery, is the property of Auric Krystal. Unauthorized reproduction is strictly prohibited.</p>
                    </section>

                    <section>
                        <h3 className="font-serif text-xl font-bold text-auric-rose mb-3">Account Responsibility</h3>
                        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
