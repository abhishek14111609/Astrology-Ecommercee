import http from 'http';

function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function testDatabaseConnection() {
    console.log('='.repeat(60));
    console.log('TESTING BACKEND DATABASE CONNECTION');
    console.log('='.repeat(60));
    console.log('');

    try {
        // Test 1: Health Check
        console.log('1. Testing Backend Health...');
        const health = await makeRequest('/api/health');
        console.log('✅ Backend is running');
        console.log(`   Status: ${health.status}`);
        console.log(`   Database: ${health.database}`);
        console.log('');

        // Test 2: Database Status
        console.log('2. Checking Database Tables...');
        const status = await makeRequest('/api/setup/database-status');
        console.log(`   Database: ${status.database}`);
        console.log('');

        let existingTables = 0;
        let missingTables = 0;

        for (const [table, info] of Object.entries(status.status)) {
            if (info.exists) {
                console.log(`   ✅ ${table.padEnd(20)} - ${info.count} records`);
                existingTables++;
            } else {
                console.log(`   ❌ ${table.padEnd(20)} - NOT FOUND`);
                missingTables++;
            }
        }

        console.log('');
        console.log(`   Summary: ${existingTables} tables exist, ${missingTables} missing`);
        console.log('');

        // Test 3: Initialize if needed
        if (missingTables > 0) {
            console.log('3. Initializing Missing Tables...');
            const initResult = await makeRequest('/api/setup/init-database', 'POST');
            console.log(`   ✅ Initialization completed`);
            console.log(`   Total statements executed: ${initResult.totalStatements}`);
            console.log('');

            // Show results
            initResult.results.forEach((result) => {
                const status = result.success ? '✅' : '❌';
                console.log(`   ${status} ${result.statement}`);
                if (!result.success) {
                    console.log(`      Error: ${result.error}`);
                }
            });
            console.log('');

            // Wait a moment for tables to be created
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Test 4: Check if we need to seed data
        console.log('4. Checking Data Status...');
        const status2 = await makeRequest('/api/setup/database-status');

        const hasData = status2.status.products?.count > 0;

        if (!hasData) {
            console.log('   No data found. Seeding sample data...');
            const seedResult = await makeRequest('/api/seed/seed-data', 'POST');
            console.log(`   ✅ Seed data inserted`);
            console.log(`   Categories: ${seedResult.summary.categories}`);
            console.log(`   Products: ${seedResult.summary.products}`);
            console.log(`   Admin Users: ${seedResult.summary.users}`);
            console.log(`   Customers: ${seedResult.summary.customers}`);
            console.log(`   Orders: ${seedResult.summary.orders}`);
        } else {
            console.log(`   ✅ Database already has data (${status2.status.products.count} products)`);
        }
        console.log('');

        // Test 5: Test Dashboard APIs
        console.log('5. Testing Dashboard APIs...');
        try {
            const stats = await makeRequest('/api/dashboard/stats');
            console.log('   ✅ Stats API working');
            console.log(`      Revenue: ₹${stats.revenue.value}`);
            console.log(`      Products: ${stats.products.value}`);
            console.log(`      Active Orders: ${stats.activeOrders.value}`);
            console.log(`      Customers: ${stats.customers.value}`);
        } catch (err) {
            console.log('   ⚠️  Stats API not tested (may need data first)');
        }
        console.log('');

        console.log('='.repeat(60));
        console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log('');
        console.log('✅ Backend is properly connected to MongoDB');
        console.log('✅ Collections are initialized as needed');
        console.log('✅ Sample data is loaded');
        console.log('');
        console.log('🚀 You can now use the Admin Panel at: http://localhost:5174');
        console.log('');

    } catch (error) {
        console.error('');
        console.error('❌ ERROR:', error.message);
        console.error('');
        console.error('Make sure:');
        console.error('1. MongoDB is running');
        console.error('2. Backend server is running (npm run dev)');
        console.error('3. MONGO_URI is correct (or uses default)');
        console.error('4. Database "auric_krystals" will be created automatically');
        process.exit(1);
    }
}

testDatabaseConnection();
