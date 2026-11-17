const express = require('express');
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Initialize an array with three sample vehicle records
let vehicles = [
    { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
    { id: 2, vehicleName: "Honda City", vehicleNumber: "DL1CA9876", type: "Sedan", price: 1200000 },
    { id: 3, vehicleName: "Tata Nexon", vehicleNumber: "UP14XY5678", type: "SUV", price: 1100000 }
];

// GET /vehicles : Retrieve all vehicles
app.get('/vehicles', (req, res) => {
    res.json(vehicles);
});

// GET /vehicles/:id : Retrieve vehicle by ID
app.get('/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
});

// POST /vehicles : Add a new vehicle
app.post('/vehicles', (req, res) => {
    const { id, vehicleName, vehicleNumber, type, price } = req.body;
    
    // Validate missing fields and check if price is a positive number
    if (!id || !vehicleName || !vehicleNumber || !type || price === undefined || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Missing required fields or invalid price. Price must be a positive number.' });
    }
    
    const newVehicle = { id, vehicleName, vehicleNumber, type, price };
    vehicles.push(newVehicle);
    
    res.status(201).json({ 
        message: 'Vehicle added successfully', 
        vehicle: newVehicle 
    });
});

// PUT /vehicles/:id : Update vehicle details
app.put('/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }

    const { vehicleName, vehicleNumber, type, price } = req.body;
    
    // Update fields if provided in request
    if (vehicleName) vehicle.vehicleName = vehicleName;
    if (vehicleNumber) vehicle.vehicleNumber = vehicleNumber;
    if (type) vehicle.type = type;
    if (price && typeof price === 'number' && price > 0) vehicle.price = price;

    res.json({ message: 'Vehicle updated successfully', vehicle });
});

// DELETE /vehicles/:id : Delete a vehicle
app.delete('/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const index = vehicles.findIndex(v => v.id === vehicleId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    vehicles.splice(index, 1);
    res.json({ message: 'Vehicle deleted successfully' });
});

app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});