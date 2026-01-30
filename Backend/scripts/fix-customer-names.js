import { connect } from '../db.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

async function fixCustomerNames() {
    try {
        await connect();
        console.log('Connected to database...');

        // Find all orders with "undefined undefined" or null customer names
        const badOrders = await Order.find({
            $or: [
                { customer_name: 'undefined undefined' },
                { customer_name: 'undefined' },
                { customer_name: null },
                { customer_name: '' }
            ]
        });

        console.log(`Found ${badOrders.length} orders with invalid customer names`);

        let fixed = 0;
        for (const order of badOrders) {
            let customerName = 'Unknown Customer';

            // Try to get customer name from user if user_id exists
            if (order.user_id) {
                const user = await User.findOne({ id: order.user_id }); 
                if (user && user.name) {
                    customerName = user.name;
                } else if (user && user.email) {
                    customerName = user.email;
                }
            }

            // Update the order
            await Order.updateOne(
                { _id: order._id },
                { customer_name: customerName }
            );

            fixed++;
            console.log(`✓ Order ${order.order_number}: Updated to "${customerName}"`);
        }

        console.log(`\nFixed ${fixed} orders successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('Error fixing customer names:', error);
        process.exit(1);
    }
}

fixCustomerNames();
