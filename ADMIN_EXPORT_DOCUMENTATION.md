# Admin Data Export System Documentation

## Overview
A comprehensive admin data export system has been successfully implemented for the Fasting Skool application. This system allows administrators to export all member data in various formats for analysis, reporting, and integration with external tools.

## Admin Authentication
- Admin users are identified by their username
- Currently configured admin usernames: `admin`, `fastingadmin`, `superadmin`
- To add more admin users, modify the `adminUsernames` array in `server/auth.ts`

## Available Admin Endpoints

### 1. GET `/api/admin/users`
- **Purpose**: Fetch all users with their aggregated statistics
- **Authentication**: Admin only
- **Response**: JSON array of users with stats including:
  - User profile information (password excluded)
  - Total days tracked
  - Successful days count
  - Current and best streaks
  - Average fasting hours
  - Weekly success rate
  - Total fasting hours

### 2. GET `/api/admin/export/csv`
- **Purpose**: Generate and download a summary CSV of all members
- **Authentication**: Admin only
- **Response**: CSV file download
- **Filename**: `fasting-members-export-YYYY-MM-DD.csv`
- **Columns**:
  - Username
  - Email
  - Phone Number
  - First Name
  - Last Name
  - Account Created
  - Total Days Tracked
  - Total Successful Days
  - Current Streak
  - Best Streak
  - Average Fasting Hours
  - Total Fasting Hours
  - Weekly Success Rate (%)
  - Most Recent Fast Date
  - Most Recent Fast Hours
  - Most Recent Clean Fast
  - Most Recent Weight
  - Most Recent Steps
  - Active Habits Count

### 3. GET `/api/admin/export/csv/detailed`
- **Purpose**: Generate detailed CSV with all daily logs for all users
- **Authentication**: Admin only
- **Response**: CSV file download
- **Filename**: `fasting-detailed-export-YYYY-MM-DD.csv`
- **Columns**:
  - Username
  - Email
  - Date
  - Start Time
  - End Time
  - Fasting Hours
  - Clean Fast
  - Mood
  - Energy Level
  - Weight
  - Steps
  - Water Intake
  - Exercise Minutes
  - Notes

### 4. POST `/api/admin/export/notion`
- **Purpose**: Prepare data formatted for Notion database import
- **Authentication**: Admin only
- **Request Body**: None required
- **Response**: JSON structured for Notion API
- **Use Case**: Integration with Notion databases for advanced tracking and visualization

### 5. GET `/api/admin/stats`
- **Purpose**: Get aggregate statistics across all users
- **Authentication**: Admin only
- **Response**: JSON object containing:
  - Total users count
  - Active users (activity in last 7 days)
  - Total days tracked across all users
  - Total successful days
  - Average current streak
  - Best streak overall
  - Overall success rate percentage

## Storage Helper Functions

The following helper functions were added to `server/storage.ts`:

### `getAllUsers()`
Returns all users in the database.

### `getAllUsersWithStats()`
Returns all users with their calculated statistics including streaks, success rates, and fasting metrics.

### `getUserDailyLogs(userId)`
Fetches all daily logs for a specific user, sorted by date descending.

### `getUserHabits(userId)`
Returns all habits for a specific user.

### `calculateSuccessMetrics(userId)`
Calculates comprehensive success metrics for a user:
- Current streak (consecutive successful days)
- Best streak ever achieved
- Total successful days
- Weekly success rate (last 7 days)
- Average fasting hours
- Total fasting hours

## CSV Export Features

### Proper Escaping
- Values containing commas, quotes, or line breaks are properly escaped
- Double quotes within values are escaped by doubling them
- Values are wrapped in quotes when necessary

### Date Formatting
- Filenames include the current date in YYYY-MM-DD format
- Dates in CSV are formatted for easy readability

### Download Headers
- Proper Content-Type: `text/csv`
- Content-Disposition with filename for automatic download

## Testing

A comprehensive test suite is available in `test-admin-endpoints.js`:

```bash
node test-admin-endpoints.js
```

Test coverage includes:
- Admin authentication
- User data retrieval
- CSV export generation
- Detailed CSV export
- Notion export preparation
- Admin statistics calculation
- Non-admin access denial

## Usage Example

### 1. Create Admin Account
```javascript
// Register an admin account (username must be in adminUsernames list)
POST /api/register
{
  "username": "admin",
  "password": "securepassword",
  "email": "admin@fastingskool.com",
  "firstName": "Admin",
  "lastName": "User"
}
```

### 2. Login as Admin
```javascript
POST /api/login
{
  "username": "admin",
  "password": "securepassword"
}
```

### 3. Export Data
```javascript
// Get CSV export
GET /api/admin/export/csv
// Response: CSV file download

// Get detailed CSV with all logs
GET /api/admin/export/csv/detailed
// Response: Detailed CSV file download
```

## Security Considerations

1. **Authentication Required**: All admin endpoints require authenticated sessions
2. **Admin Authorization**: Only users with admin usernames can access these endpoints
3. **Password Protection**: User passwords are never included in exports
4. **Session Management**: Uses secure session cookies with httpOnly flag
5. **Rate Limiting**: Consider adding rate limiting for export endpoints in production

## Future Enhancements

1. **Database Admin Flag**: Add an `isAdmin` field to the users table instead of hardcoded usernames
2. **Export Filtering**: Add date range and user filtering options
3. **Additional Formats**: Support for Excel, JSON, and XML exports
4. **Scheduled Reports**: Automatic weekly/monthly report generation
5. **Email Delivery**: Send exports via email to admin
6. **Data Anonymization**: Option to export anonymized data for sharing
7. **Audit Logging**: Track who exports data and when

## Maintenance

- Admin usernames are defined in `server/auth.ts` in the `isAdmin` middleware
- CSV generation logic is in `server/routes.ts` in the `registerAdminRoutes` function
- Data aggregation functions are in `server/storage.ts`
- Test suite is in `test-admin-endpoints.js`

## Performance Notes

- Large exports may take several seconds for databases with many users
- Consider implementing pagination for very large datasets
- CSV generation is memory-efficient, streaming data row by row
- Database queries are optimized with proper indexing

## Troubleshooting

### Common Issues:

1. **403 Forbidden**: User is not in the admin list
2. **401 Unauthorized**: User is not logged in
3. **Empty CSV**: No users or data in the database
4. **Timeout on Large Exports**: Consider increasing server timeout for large datasets

---

Created: September 17, 2025
Version: 1.0.0