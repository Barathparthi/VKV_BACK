const RouteModel = require('@/models/Route');
const RoutePrice = require('@/models/RoutePrice');
const Location = require('@/models/Location');

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

// Get all routes with prices
exports.getRoutes = async (req, res) => {
    try {
        console.log('📍 Fetching all routes from Route-price collection...');
        // Fetch from Route-price collection as primary source
        const routes = await RoutePrice.aggregate([
            {
                $lookup: {
                    from: 'routes',
                    let: { from: '$from_location', to: '$to_location' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$from_location', '$$from'] },
                                        { $eq: ['$to_location', '$$to'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'routeInfo'
                }
            },
            {
                $unwind: {
                    path: '$routeInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: { $ifNull: ['$routeInfo._id', '$_id'] },
                    from_location: '$from_location',
                    to_location: '$to_location',
                    distance: { $ifNull: ['$routeInfo.distance', 0] },
                    is_active: { $ifNull: ['$routeInfo.is_active', true] },
                    driver_bata_single: '$driver_bata_single',
                    driver_bata_double: '$driver_bata_double',
                    cleaner_bata: '$cleaner_bata',
                    created_at: { $ifNull: ['$routeInfo.created_at', new Date()] },
                    updated_at: { $ifNull: ['$routeInfo.updated_at', new Date()] }
                }
            },
            { $sort: { from_location: 1, to_location: 1 } }
        ]);

        res.json(routes);
    } catch (error) {
        console.error('Error fetching routes:', error);
        res.status(500).json({ message: 'Error fetching routes', error: error.message });
    }
};

// Get all unique locations (for dropdowns)
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find({}).sort({ City: 1 });
        const locationNames = locations.map(loc => loc.City);
        res.json(locationNames);
    } catch (error) {
        console.error('❌ Error fetching locations:', error);
        res.status(500).json({ message: 'Error fetching locations', error: error.message });
    }
};

// Add new location (City)
exports.addLocation = async (req, res) => {
    try {
        const { city } = req.body;
        if (!city) {
            return res.status(400).json({ message: 'City name is required' });
        }

        // Case insensitive check
        const existingLocation = await Location.findOne({
            City: { $regex: new RegExp(`^${city}$`, 'i') }
        });

        if (existingLocation) {
            return res.status(400).json({ message: 'Location already exists' });
        }

        const newLocation = new Location({ City: city });
        await newLocation.save();

        res.status(201).json(newLocation);
    } catch (error) {
        console.error('Error adding location:', error);
        res.status(500).json({ message: 'Error adding location', error: error.message });
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
        const { from, to } = req.params;

        // Check Routes collection (Case Insensitive)
        const route = await RouteModel.findOne({
            from_location: { $regex: new RegExp(`^${from}$`, 'i') },
            to_location: { $regex: new RegExp(`^${to}$`, 'i') },
        });

        if (route) {
            return res.json({
                exists: true,
                source: 'routes',
                isActive: route.is_active,
                route: route
            });
        }

        // Check RoutePrice collection (Case Insensitive)
        const price = await RoutePrice.findOne({
            from_location: { $regex: new RegExp(`^${from}$`, 'i') },
            to_location: { $regex: new RegExp(`^${to}$`, 'i') },
        });

        if (price) {
            return res.json({
                exists: true,
                source: 'price',
                isActive: true, // Treated as active for display
                route: price
            });
        }

        return res.status(404).json({
            exists: false,
            message: 'Route not found'
        });
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

        const {
            from_location,
            to_location,
            distance,
            driver_bata_single,
            driver_bata_double,
            cleaner_bata
        } = req.body;

        if (!from_location || !to_location) {
            return res.status(400).json({
                message: 'Missing required fields: from_location, to_location',
            });
        }

        // Check for existing route (case-insensitive) in Routes collection
        const existingRoute = await RouteModel.findOne({
            from_location: { $regex: new RegExp(`^${from_location}$`, 'i') },
            to_location: { $regex: new RegExp(`^${to_location}$`, 'i') },
        });

        let route;

        if (existingRoute) {
            if (existingRoute.is_active) {
                return res.status(400).json({
                    message: `Route already exists: ${existingRoute.from_location} to ${existingRoute.to_location}`,
                });
            } else {
                // Reactivate route
                existingRoute.is_active = true;
                if (distance) existingRoute.distance = distance;
                await existingRoute.save();
                route = existingRoute;
            }
        } else {
            // Check RoutePrice (case-insensitive) for ghost routes to avoid duplicates
            const existingPrice = await RoutePrice.findOne({
                from_location: { $regex: new RegExp(`^${from_location}$`, 'i') },
                to_location: { $regex: new RegExp(`^${to_location}$`, 'i') },
            });

            if (existingPrice) {
                // If casing matches exactly, we allow it (syncing logic).
                // If casing differs, we block to prevent duplicates.
                if (existingPrice.from_location !== from_location || existingPrice.to_location !== to_location) {
                    return res.status(400).json({
                        message: `Route already exists in price list as: ${existingPrice.from_location} -> ${existingPrice.to_location}`,
                    });
                }
            }

            route = new RouteModel({
                from_location,
                to_location,
                distance: distance || 0,
            });
            await route.save();
        }

        // Create or update price
        await RoutePrice.findOneAndUpdate(
            { from_location, to_location },
            {
                driver_bata_single: driver_bata_single || 0,
                driver_bata_double: driver_bata_double || 0,
                cleaner_bata: cleaner_bata || 0
            },
            { upsert: true, new: true }
        );

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

        const {
            from_location,
            to_location,
            distance,
            is_active,
            driver_bata_single,
            driver_bata_double,
            cleaner_bata
        } = req.body;

        let route = await RouteModel.findById(req.params.id);

        if (!route) {
            // Check if it's a ghost route (ID in RoutePrice but not in Routes)
            const ghostPrice = await RoutePrice.findById(req.params.id);
            if (ghostPrice) {
                // Sync: Create a new Route document using the existing Price ID
                route = new RouteModel({
                    _id: req.params.id, // Preserve the ID so frontend stays in sync
                    from_location: ghostPrice.from_location,
                    to_location: ghostPrice.to_location,
                    distance: 0,
                    is_active: true
                });
                // Note: We don't save yet; subsequent logic will apply updates and save.
            } else {
                return res.status(404).json({ message: 'Route not found' });
            }
        }

        // Store original locations to find the price record
        const originalFrom = route.from_location;
        const originalTo = route.to_location;

        if (from_location !== undefined) route.from_location = from_location;
        if (to_location !== undefined) route.to_location = to_location;
        if (distance !== undefined) route.distance = distance;
        if (is_active !== undefined) route.is_active = is_active;

        await route.save();

        // Update price info. If location changed, we might need to handle that, 
        // but typically IDs or stable keys are better. 
        // Here we rely on the implementation that uses from/to as keys for Price.
        // We should update the Price entry that matches the *new* location names if they changed,
        // OR update the old one to the new names? 
        // The RoutePrice model is separate. To keep it simple, we upsert based on the *current* (possibly new) locations.

        const finalFrom = from_location !== undefined ? from_location : originalFrom;
        const finalTo = to_location !== undefined ? to_location : originalTo;

        // Build update object with only defined values
        const priceUpdate = {};
        if (driver_bata_single !== undefined) priceUpdate.driver_bata_single = driver_bata_single;
        if (driver_bata_double !== undefined) priceUpdate.driver_bata_double = driver_bata_double;
        if (cleaner_bata !== undefined) priceUpdate.cleaner_bata = cleaner_bata;

        // Only update if there are price fields to update
        if (Object.keys(priceUpdate).length > 0) {
            await RoutePrice.findOneAndUpdate(
                { from_location: finalFrom, to_location: finalTo },
                priceUpdate,
                { upsert: true, new: true }
            );
        }

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

        let route = await RouteModel.findById(req.params.id);
        if (!route) {
            // Check if ghost route
            const ghost = await RoutePrice.findById(req.params.id);
            if (ghost) {
                try {
                    route = new RouteModel({
                        _id: req.params.id,
                        from_location: ghost.from_location,
                        to_location: ghost.to_location,
                        is_active: false // Create as inactive immediately
                    });
                    await route.save();
                    return res.json({ message: 'Route deleted successfully' });
                } catch (err) {
                    // If creating the route fails due to duplicate key (E11000), 
                    // it means another active route exists with these details.
                    // In this case, we hard-delete the ghost price record to remove the duplicate.
                    if (err.code === 11000) {
                        await RoutePrice.findByIdAndDelete(req.params.id);
                        return res.json({ message: 'Duplicate route record removed permanently' });
                    }
                    throw err;
                }
            } else {
                return res.status(404).json({ message: 'Route not found' });
            }
        }

        route.is_active = false;
        await route.save();

        res.json({ message: 'Route deleted successfully' });
    } catch (error) {
        console.error('Error deleting route:', error);
        res.status(500).json({ message: 'Error deleting route', error: error.message });
    }
};
