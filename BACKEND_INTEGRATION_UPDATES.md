# Frontend Updates for New Backend Response Structure

## Changes Made

### 1. Updated User Interface (`src/lib/types.ts`)

- Added `uuid` field as primary identifier for routing
- Added all new fields from backend response:
  - `phone`, `address`, `dob`, `gender`, `bloodGroup`, `profileImage`
  - `accessToken` for authentication
- Made `lastName` required (non-optional)

### 2. Updated Login API Type (`src/lib/api.ts`)

- Updated login response type to match new backend structure
- Added all new fields in the response interface

### 3. Updated Auth Context (`src/lib/auth.tsx`)

- Modified login function to extract all user data from response
- Changed to use `accessToken` instead of separate token field
- Updated user object creation to include all new fields

### 4. Updated Routing Logic

- **Login Component** (`src/pages/login/index.tsx`): Changed from `user.userID` to `user.uuid` for routing
- **withAuth HOC** (`src/lib/withAuth.tsx`): Updated to use `user.uuid` for dashboard redirects
- **Dashboard Component** (`src/pages/dashboard.tsx`): Updated to use `user.uuid` for routing

## Backend Response Structure Supported

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "uuid": "user-uuid-value", // Used for routing
    "id": "mongodb-object-id",
    "email": "user@example.com",
    "userID": "custom-user-id", // Display ID (e.g., STD001)
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "address": {
      "street": "123 Main St",
      "city": "City",
      "state": "State",
      "zipCode": "12345",
      "country": "Country"
    },
    "dob": "YYYY-MM-DD",
    "gender": "Male",
    "bloodGroup": "A+",
    "role": "student", // String: admin, teacher, student, parent
    "profileImage": "profile-url-or-path",
    "accessToken": "JWT_TOKEN_STRING" // Used for API authentication
  }
}
```

## Key Changes Summary

1. **Primary ID for Routing**: Now using `uuid` instead of `id` or `userID`
2. **Authentication Token**: Using `accessToken` from response data
3. **Role Format**: Supporting string roles (admin, teacher, student, parent)
4. **Extended User Data**: All user profile fields are now captured and stored
5. **Consistent Routing**: All components now use `user.uuid` for navigation

## URL Structure

Routes will now use the UUID:

- `/portal/admin/{uuid}/dashboard`
- `/portal/teacher/{uuid}/dashboard`
- `/portal/student/{uuid}/dashboard`
- `/portal/parent/{uuid}/dashboard`

All components that were previously using `user.id` or `user.userID` for routing have been updated to use `user.uuid`.

The system now properly handles the new backend response structure and will redirect users correctly based on their role and UUID after successful login.
