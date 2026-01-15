// Test script to verify the routes API endpoint
const axios = require('axios');

async function testRoutesAPI() {
    try {
        console.log('\n🔍 Testing Routes API Endpoint...\n');

        // You'll need to replace this with a valid token from your login
        // For now, let's test without auth to see the error
        const response = await axios.get('http://localhost:5001/api/routes', {
            headers: {
                // Add your auth token here if needed
                // 'Authorization': 'Bearer YOUR_TOKEN'
            },
            validateStatus: () => true // Accept any status code
        });

        console.log('Status Code:', response.status);
        console.log('Status Text:', response.statusText);

        if (response.status === 200) {
            const routes = response.data;
            console.log('\n✅ SUCCESS!');
            console.log(`📊 Total Routes Returned: ${routes.length}`);

            if (routes.length > 0) {
                console.log('\n📍 Sample Routes:');
                routes.slice(0, 5).forEach((route, idx) => {
                    console.log(`   ${idx + 1}. ${route.from_location} → ${route.to_location}`);
                    console.log(`      Driver Bata (D): ₹${route.driver_bata_double}`);
                });
            }

            console.log(`\n✨ Expected: 51 routes`);
            console.log(`✨ Received: ${routes.length} routes`);

            if (routes.length === 51) {
                console.log('\n🎉 SUCCESS! All routes are being returned!\n');
            } else {
                console.log(`\n⚠️  WARNING: Expected 51 routes but got ${routes.length}\n`);
            }
        } else if (response.status === 401) {
            console.log('\n⚠️  Authentication required. Please login first.');
            console.log('   The API endpoint requires a valid JWT token.\n');
        } else {
            console.log('\n❌ Error:', response.data);
        }

    } catch (error) {
        console.error('\n❌ Error testing API:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('   Make sure the backend server is running on port 5001\n');
        }
    }
}

testRoutesAPI();
