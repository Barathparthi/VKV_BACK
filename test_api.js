const axios = require('axios');

async function testAPI() {
    try {
        console.log('🔍 Testing API endpoint: GET /api/routes/price/Chennai/ernakulam\n');

        const response = await axios.get('http://localhost:5001/api/routes/price/Chennai/ernakulam', {
            headers: {
                // Add a dummy token if needed - adjust based on your auth setup
                'Authorization': 'Bearer test-token'
            }
        });

        console.log('✅ API Response:');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        if (error.response) {
            console.error('❌ API Error Response:');
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Data:`, error.response.data);
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

testAPI();
