// Test the /locations endpoint directly
const axios = require('axios');

async function testLocations() {
    try {
        // First login to get a token
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            phone: '9360263934',
            password: '1234',
            role: 'driver'
        });

        const token = loginResponse.data.token;
        console.log('✅ Logged in successfully');

        // Now fetch locations
        const locationsResponse = await axios.get('http://localhost:5000/api/routes/locations', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('\n📍 Locations from API:');
        console.log(locationsResponse.data);

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testLocations();
