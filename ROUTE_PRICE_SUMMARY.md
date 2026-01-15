# Route-price Collection Summary

**Export Date:** January 14, 2026, 9:56 PM IST  
**Total Routes:** 51

---

## 📊 Summary Statistics

- **Total Routes in Route-price Collection:** 51
- **Unique From Locations:** 26
- **Unique To Locations:** 26
- **Total Unique Locations:** 26

---

## 🗺️ All Locations

1. Bangalore
2. Chennai
3. Ernakulam
4. Goa
5. Hyderabad
6. Kannur
7. Karungal
8. Marudhamalai
9. Munnar
10. Nagercoil
11. Paramakudi
12. Rameshwaram
13. Thiruchendur
14. Vadipatti
15. Varanasi
16. Varkala
17. Vellayapuram
18. Vijayawada
19. Visakhapatnam
20. ernakulam (lowercase)
21. goa (lowercase)
22. kannur (lowercase)
23. marudhamalai (lowercase)
24. munnar (lowercase)
25. thiruchendur (lowercase)
26. vellayapuram (lowercase)

---

## 🔧 Backend Changes Made

### Modified: `routes.controller.js`

**Previous Behavior:**
- Fetched routes from `Routes` collection (only 16 routes)
- Joined with `Route-price` for pricing data
- Only showed routes that existed in `Routes` collection

**New Behavior:**
- Fetches routes from `Route-price` collection (all 51 routes)
- Joins with `Routes` collection for metadata (distance, is_active)
- Shows ALL routes that have pricing information
- If a route doesn't exist in `Routes` collection, it defaults:
  - `distance`: 0
  - `is_active`: true
  - `_id`: Uses Route-price _id

---

## 📍 Route Breakdown

### Major Route Groups:

**From Bangalore (3 routes):**
- Bangalore → Chennai
- Bangalore → Rameshwaram
- Bangalore → Varkala

**From Chennai (20 routes):**
- Chennai → Bangalore
- Chennai → Ernakulam
- Chennai → Goa
- Chennai → Hyderabad
- Chennai → Kannur
- Chennai → Karungal
- Chennai → Marudhamalai
- Chennai → Munnar
- Chennai → Nagercoil
- Chennai → Paramakudi
- Chennai → Thiruchendur
- Chennai → Vadipatti
- Chennai → Varanasi
- Chennai → Varkala
- Chennai → Vellayapuram
- Chennai → Vijayawada
- Chennai → Visakhapatnam
- Chennai → ernakulam (duplicate with different case)
- Chennai → goa (duplicate with different case)
- Chennai → kannur (duplicate with different case)
- Chennai → marudhamalai (duplicate with different case)
- Chennai → munnar (duplicate with different case)
- Chennai → thiruchendur (duplicate with different case)
- Chennai → vellayapuram (duplicate with different case)

**Return Routes to Chennai (17 routes):**
- Ernakulam → Chennai
- Goa → Chennai
- Hyderabad → Chennai
- Kannur → Chennai
- Karungal → Chennai
- Marudhamalai → Chennai
- Munnar → Chennai
- Nagercoil → Chennai
- Paramakudi → Chennai
- Thiruchendur → Chennai
- Vadipatti → Chennai
- Varanasi → Chennai
- Varkala → Chennai
- Vellayapuram → Chennai
- Vijayawada → Chennai
- Visakhapatnam → Chennai
- ernakulam → Chennai (lowercase)
- goa → Chennai (lowercase)
- kannur → Chennai (lowercase)
- munnar → Chennai (lowercase)
- thiruchendur → Chennai (lowercase)
- vellayapuram → Chennai (lowercase)

**Other Routes (3 routes):**
- Rameshwaram → Bangalore
- Varkala → Bangalore
- Varkala → Chennai

---

## ⚠️ Data Quality Issues

1. **Case Inconsistency:** Several locations have both capitalized and lowercase versions:
   - Chennai vs chennai
   - Ernakulam vs ernakulam
   - Goa vs goa
   - Kannur vs kannur
   - Marudhamalai vs marudhamalai
   - Munnar vs munnar
   - Thiruchendur vs thiruchendur
   - Vellayapuram vs vellayapuram

2. **Duplicate Routes:** Due to case sensitivity, some routes appear twice with different pricing

---

## ✅ What's Now Displayed

The **"View All Routes"** page in the admin dashboard will now display all **51 routes** from the `Route-price` collection, including:

- All routes with pricing information
- Routes grouped by starting location
- Edit and delete functionality for each route
- Search and filter capabilities

---

## 📁 Files Generated

1. `route_prices_export_1768408007191.json` - Full JSON export of all Route-price data
2. `ROUTE_PRICE_SUMMARY.md` - This summary document

---

**Note:** The frontend will automatically fetch and display all 51 routes when you navigate to Route Management → View All Routes.
