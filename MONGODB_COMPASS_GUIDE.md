# MongoDB Compass Viewing Guide

## ✅ Your Data is Successfully in MongoDB!

### 📊 Database Summary

**Database Name:** `vkv`

**Collections:**
- `users` - Contains 82 documents (61 drivers + 20 attenders + 1 admin)
- `vehicles` - Contains 30 documents
- `trips` - Empty (ready for trip data)
- `salaries` - Empty (ready for salary data)

---

## 🔗 Connection Information

**MongoDB Connection String:**
```
mongodb+srv://admin:admin123@cluster0.mp18txy.mongodb.net/vkv
```

**Credentials:**
- Username: `admin`
- Password: `admin123`
- Database: `vkv`

---

## 📱 How to View in MongoDB Compass

### Step 1: Open MongoDB Compass
1. Launch MongoDB Compass application on your computer

### Step 2: Connect to Database
1. Click **"New Connection"** or **"Connect"**
2. Paste the connection string:
   ```
   mongodb+srv://admin:admin123@cluster0.mp18txy.mongodb.net/vkv
   ```
3. Click **"Connect"**

### Step 3: Navigate to Database
1. On the left sidebar, you'll see **"vkv"** database
2. Click on it to expand
3. You'll see collections:
   - `users`
   - `vehicles`
   - `trips`
   - `salaries`

---

## 👤 Viewing DRIVERS

### Method 1: Filter in Compass
1. Click on **"users"** collection
2. Click on the **"Filter"** button at the top
3. Enter this filter:
   ```json
   { "role": "driver" }
   ```
4. Click **"Find"**
5. You'll see all 61 drivers!

### What You'll See:
```
SASIKUMAR Dvk    | 7502795662   | DRV001
VELMURUGAN       | 8667459060   | DRV002
DHURGESH         | 9360252782   | DRV003
... (58 more)
```

### Fields in Each Driver Document:
- `_id` - MongoDB unique ID
- `name` - Driver name
- `phone` - Phone number (10 digits)
- `password` - Hashed password
- `role` - "driver"
- `employeeCode` - DRV001, DRV002, etc.
- `isActive` - true/false
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

---

## 👥 Viewing ATTENDERS

### Method 1: Filter in Compass
1. Click on **"users"** collection
2. Click on the **"Filter"** button
3. Enter this filter:
   ```json
   { "role": "attender" }
   ```
4. Click **"Find"**
5. You'll see all 20 attenders!

### What You'll See:
```
KUMAR A      | 9876543210   | ATD001
RAVI S       | 9876543211   | ATD002
SURESH M     | 9876543212   | ATD003
... (17 more)
```

### Fields in Each Attender Document:
- `_id` - MongoDB unique ID
- `name` - Attender name
- `phone` - Phone number (10 digits)
- `password` - Hashed password
- `role` - "attender"
- `employeeCode` - ATD001, ATD002, etc.
- `isActive` - true/false
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

---

## 🚌 Viewing VEHICLES

### No Filter Needed!
1. Click on **"vehicles"** collection
2. You'll see all 30 vehicles immediately

### What You'll See:
```
NL01B9051    | SEATER   | 50 seats  | active
TN18BU9046   | SEATER   | 50 seats  | active
TN18BS9036   | SLEEPER  | 40 seats  | active
... (27 more)
```

### Fields in Each Vehicle Document:
- `_id` - MongoDB unique ID
- `vehicle_number` - Bus number (e.g., TN18BS9036)
- `bus_type` - SEATER or SLEEPER
- `capacity` - 40 or 50 seats
- `default_mileage` - 8 km/liter
- `status` - active/inactive/maintenance
- `createdAt` - Timestamp

---

## 🔍 Useful MongoDB Compass Features

### 1. **Search Specific Record**
Example: Find driver by phone number
```json
{ "phone": "7502795662" }
```

### 2. **Multiple Conditions**
Example: Find active drivers
```json
{ "role": "driver", "isActive": true }
```

### 3. **Export Data**
- Click on a collection
- Click **"Export Collection"** button
- Choose JSON or CSV format
- Save to your computer

### 4. **View Schema**
- Click on any collection
- Click **"Schema"** tab at the top
- See data distribution and types

### 5. **Edit Documents** (Use Carefully!)
- Click on any document
- Click **"Edit"** icon
- Make changes
- Click **"Update"**

---

## 📊 Data Statistics

### Current Database State:

| Collection | Total Documents | Details |
|------------|----------------|---------|
| **users** | 82 | 61 drivers + 20 attenders + 1 admin |
| **vehicles** | 30 | 18 SLEEPER + 12 SEATER buses |
| **trips** | 0 | Ready for trip entries |
| **salaries** | 0 | Ready for salary calculations |

---

## 🔐 User Login Information

All users can login with:
- **Phone**: Their assigned phone number
- **Password**: `1234` (default)

**Admin Login:**
- Phone: `admin`
- Password: `admin123`

---

## 💡 Pro Tips

1. **Bookmark Connection**: Save the connection in Compass for quick access
2. **Use Filters**: Filter by role, employeeCode, or any field
3. **Sort Data**: Click column headers to sort
4. **Aggregation Pipeline**: Use for complex queries
5. **Indexes**: Check indexes for performance optimization

---

## 🆘 Troubleshooting

### Can't Connect?
- Check internet connection
- Verify connection string is correct
- Ensure MongoDB Compass is up to date

### Don't See Data?
- Make sure you're in the **"vkv"** database (not "test")
- Refresh the collection (click refresh icon)
- Check filters are not excluding data

### Wrong Count?
- Clear all filters
- Refresh the collection
- Count should match: 61 drivers, 20 attenders, 30 vehicles

---

## ✅ Verification Checklist

- [ ] MongoDB Compass is installed
- [ ] Connected to database using connection string
- [ ] Can see "vkv" database
- [ ] Can see "users" collection with 82 documents
- [ ] Can filter drivers: `{ "role": "driver" }` shows 61
- [ ] Can filter attenders: `{ "role": "attender" }` shows 20
- [ ] Can see "vehicles" collection with 30 documents
- [ ] All data looks correct

---

## 📞 Need Help?

Run this script again anytime:
```bash
cd backend
node scripts/showDatabaseInfo.js
```

This will show you current database state and counts!
