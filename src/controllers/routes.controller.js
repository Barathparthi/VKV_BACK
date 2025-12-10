const RouteModel = require('@/models/Route');
const RoutePrice = require('@/models/RoutePrice');

// Get route price
exports.getRoutePrice = async (req, res) => {
    try {
        const { from, to } = req.params;
        const price = await RoutePrice.findOne({
            from_location: from,
            to_location: to,
        });

        if (!price) {
            return res.status(404).json({ message: 'Price not found for this route' });
        }

        res.json(price);
    } catch (error) {
        console.error('Error fetching route price:', error);
        res.status(500).json({ message: 'Error fetching route price', error: error.message });
    }
};

// Get all routes
exports.getRoutes = async (req, res) => {
    try {
        const routes = await RouteModel.find({ is_active: true }).sort({
            from_location: 1,
            to_location: 1,
        });
        res.json(routes);
    } catch (error) {
        console.error('Error fetching routes:', error);
        res.status(500).json({ message: 'Error fetching routes', error: error.message });
    }
};

// Get all unique locations (for dropdowns)
exports.getLocations = async (req, res) => {
    try {
        const prices = await RoutePrice.find({});
        const locations = new Set();

        prices.forEach((price) => {
            if (price.from_location) locations.add(price.from_location);
            if (price.to_location) locations.add(price.to_location);
        });

        const sortedLocations = Array.from(locations).sort();
        res.json(sortedLocations);
    } catch (error) {
        console.error('❌ Error fetching locations:', error);
        res.status(500).json({ message: 'Error fetching locations', error: error.message });
    }
};

// Get route by ID
exports.getRoute = async (req, res) => {
    try {
        const route = await RouteModel.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }
        res.json(route);
    } catch (error) {
        console.error('Error fetching route:', error);
        res.status(500).json({ message: 'Error fetching route', error: error.message });
    }
};

// Find route by from and to locations
exports.findRoute = async (req, res) => {
    try {
        const route = await RouteModel.findOne({
            from_location: req.params.from,
            to_location: req.params.to,
            is_active: true,
        });

        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        res.json(route);
    } catch (error) {
        console.error('Error finding route:', error);
        res.status(500).json({ message: 'Error finding route', error: error.message });
    }
};

// Create new route (admin only)
exports.createRoute = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { from_location, to_location, distance } = req.body;

        if (!from_location || !to_location || !distance) {
            return res.status(400).json({
                message: 'Missing required fields: from_location, to_location, distance',
            });
        }

        const existingRoute = await RouteModel.findOne({
            from_location,
            to_location,
        });

        if (existingRoute) {
            return res.status(400).json({
                message: 'Route already exists from this location to destination',
            });
        }

        const route = new RouteModel({
            from_location,
            to_location,
            distance,
        });

        await route.save();

        const existingPrice = await RoutePrice.findOne({
            from_location,
            to_location,
        });

        if (!existingPrice) {
            await RoutePrice.create({
                from_location,
                to_location,
                driver_bata_single: 0,
                driver_bata_double: 0,
                cleaner_bata: 0,
            });
        }

        res.status(201).json(route);
    } catch (error) {
        console.error('Error creating route:', error);
        res.status(500).json({ message: 'Error creating route', error: error.message });
    }
};

// Update or Create route price (admin only)
exports.updateRoutePrice = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { from_location, to_location, driver_bata_single, driver_bata_double, cleaner_bata } =
            req.body;

        if (!from_location || !to_location) {
            return res.status(400).json({ message: 'Missing from_location or to_location' });
        }

        const price = await RoutePrice.findOneAndUpdate(
            { from_location, to_location },
            {
                driver_bata_single: driver_bata_single || 0,
                driver_bata_double: driver_bata_double || 0,
                cleaner_bata: cleaner_bata || 0,
            },
            { new: true, upsert: true },
        );

        res.json(price);
    } catch (error) {
        console.error('Error updating route price:', error);
        res.status(500).json({ message: 'Error updating route price', error: error.message });
    }
};

// Update route (admin only)
exports.updateRoute = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { from_location, to_location, distance, is_active } = req.body;

        const route = await RouteModel.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        if (from_location !== undefined) route.from_location = from_location;
        if (to_location !== undefined) route.to_location = to_location;
        if (distance !== undefined) route.distance = distance;
        if (is_active !== undefined) route.is_active = is_active;

        await route.save();
        res.json(route);
    } catch (error) {
        console.error('Error updating route:', error);
        res.status(500).json({ message: 'Error updating route', error: error.message });
    }
};

// Delete route (admin only) - soft delete
exports.deleteRoute = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const route = await RouteModel.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        route.is_active = false;
        await route.save();

        res.json({ message: 'Route deleted successfully' });
    } catch (error) {
        console.error('Error deleting route:', error);
        res.status(500).json({ message: 'Error deleting route', error: error.message });
    }
};
