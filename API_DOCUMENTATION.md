# VKV Travels Backend API Documentation

## Base URL
`http://localhost:5000/api`

---

## Authentication Routes (`/api/auth`)

### POST /api/auth/register
- **Description**: Register a new user
- **Access**: Public
- **Body**: `{ name, phone, password, role }`

### POST /api/auth/login
- **Description**: Login user
- **Access**: Public
- **Body**: `{ phone, password, role }`
- **Returns**: JWT token

---

## Driver Routes (`/api/drivers`)

### GET /api/drivers
- **Description**: Get all drivers
- **Access**: Private
- **Query Params**: `isActive` (optional)

### GET /api/drivers/:id
- **Description**: Get driver by ID
- **Access**: Private

### POST /api/drivers
- **Description**: Create new driver
- **Access**: Private (Admin only)
- **Body**: `{ name, phone, password, employeeCode, ... }`

### PUT /api/drivers/:id
- **Description**: Update driver
- **Access**: Private (Admin only)
- **Body**: Updated driver fields

### DELETE /api/drivers/:id
- **Description**: Soft delete driver (set isActive to false)
- **Access**: Private (Admin only)

---

## Attender Routes (`/api/attenders`)

### GET /api/attenders
- **Description**: Get all attenders
- **Access**: Private
- **Query Params**: `isActive` (optional)

### GET /api/attenders/:id
- **Description**: Get attender by ID
- **Access**: Private

### POST /api/attenders
- **Description**: Create new attender
- **Access**: Private (Admin only)
- **Body**: `{ name, phone, password, employeeCode, ... }`

### PUT /api/attenders/:id
- **Description**: Update attender
- **Access**: Private (Admin only)
- **Body**: Updated attender fields

### DELETE /api/attenders/:id
- **Description**: Soft delete attender (set isActive to false)
- **Access**: Private (Admin only)

---

## Trip/Tripsheet Routes (`/api/trips`)

### GET /api/trips
- **Description**: Get all trips (with filters)
- **Access**: Private (Admin only)
- **Query Params**: `status`, `driverId`, `vehicleId`, `type`, `startDate`, `endDate`

### GET /api/trips/my-trips
- **Description**: Get logged-in user's trips
- **Access**: Private
- **Query Params**: `status`, `type`, `startDate`, `endDate`

### GET /api/trips/:id
- **Description**: Get single trip by ID
- **Access**: Private (Owner or Admin)

### POST /api/trips
- **Description**: Create new trip
- **Access**: Private (Driver/Attender/Admin)
- **Body**: `{ vehicleId, type, date, from_location, to_location, distance, ... }`

### PUT /api/trips/:id
- **Description**: Update trip
- **Access**: Private (Owner or Admin)
- **Body**: Updated trip fields
- **Note**: Can only update pending trips (unless admin)

### DELETE /api/trips/:id
- **Description**: Delete trip
- **Access**: Private (Owner or Admin)
- **Note**: Can only delete pending trips (unless admin)

---

## Salary Routes (`/api/salary`)

### GET /api/salary
- **Description**: Get all salaries
- **Access**: Private (Admin only)
- **Query Params**: `month`, `year`, `driverId`, `status`

### GET /api/salary/:id
- **Description**: Get salary by ID
- **Access**: Private (Owner or Admin)

### GET /api/salary/my-salary
- **Description**: Get logged-in user's salary history
- **Access**: Private

### POST /api/salary/calculate-monthly
- **Description**: Calculate monthly salary for all drivers based on approved trips
- **Access**: Private (Admin only)
- **Body**: `{ month, year }`

### POST /api/salary
- **Description**: Manually create/update salary
- **Access**: Private (Admin only)
- **Body**: `{ driverId, month, year, total_trips, total_salary, ... }`

### PUT /api/salary/:id
- **Description**: Update salary
- **Access**: Private (Admin only)
- **Body**: Updated salary fields

### PUT /api/salary/:id/approve
- **Description**: Approve salary
- **Access**: Private (Admin only)

### PUT /api/salary/:id/paid
- **Description**: Mark salary as paid
- **Access**: Private (Admin only)

---

## Vehicle Routes (`/api/vehicles`)

### GET /api/vehicles
- **Description**: Get all active vehicles
- **Access**: Private

### POST /api/vehicles
- **Description**: Create new vehicle
- **Access**: Private (Admin only)
- **Body**: `{ vehicle_number, vehicle_type, status, ... }`

### PUT /api/vehicles/:id
- **Description**: Update vehicle
- **Access**: Private (Admin only)
- **Body**: Updated vehicle fields

### DELETE /api/vehicles/:id
- **Description**: Soft delete vehicle (set status to inactive)
- **Access**: Private (Admin only)

---

## Fuel Routes (`/api/fuel`)

### GET /api/fuel
- **Description**: Get all fuel entries
- **Access**: Private (Admin only)

### GET /api/fuel/vehicle/:vehicleId/latest
- **Description**: Get latest fuel reading for a vehicle
- **Access**: Private

### POST /api/fuel
- **Description**: Create new fuel entry
- **Access**: Private (Admin only)
- **Body**: `{ vehicleId, driverId, date, curr_reading, fuel_liters, ... }`

### PUT /api/fuel/:id
- **Description**: Update fuel entry
- **Access**: Private (Admin only)
- **Body**: Updated fuel entry fields

### DELETE /api/fuel/:id
- **Description**: Delete fuel entry
- **Access**: Private (Admin only)

---

## Admin Routes (`/api/admin`)

### GET /api/admin/dashboard/stats
- **Description**: Get dashboard statistics
- **Access**: Private (Admin only)
- **Returns**: `{ totalDrivers, totalVehicles, tripsThisMonth, pendingApprovals }`

### GET /api/admin/trips
- **Description**: Get all trips for admin view
- **Access**: Private (Admin only)
- **Query Params**: `status`, `driverId`, `startDate`, `endDate`

### PUT /api/admin/trips/:id/:action
- **Description**: Approve or reject trip
- **Access**: Private (Admin only)
- **Params**: `action` must be 'approve' or 'reject'
- **Body**: `{ adminNotes }` (optional)

### GET /api/admin/users
- **Description**: Get all users
- **Access**: Private (Admin only)

### GET /api/admin/drivers
- **Description**: Get all drivers
- **Access**: Private (Admin only)

### GET /api/admin/attenders
- **Description**: Get all attenders
- **Access**: Private (Admin only)

---

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // For list endpoints
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

---

## Notes

- All timestamps are handled automatically by MongoDB (createdAt, updatedAt)
- Soft deletes are used where applicable (isActive flag)
- Trip calculations (salary) are done automatically on save
- Drivers/Attenders can only access and modify their own trips and salary data
- Admins have access to all resources
