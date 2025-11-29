# Login/Signup Redirect Debug Guide

## What I Fixed

### 1. Login Page (`src/app/login/page.tsx`)
- ✅ Changed from `router.push()` to `window.location.href` for forced redirect
- ✅ Added console logging to track the login flow
- ✅ Better error handling

### 2. Signup Page (`src/app/signup/page.tsx`)
- ✅ Changed from `router.push()` to `window.location.href` for forced redirect
- ✅ Added console logging

### 3. Dashboard Page (`src/app/dashboard/page.tsx`)
- ✅ Added loading state with spinner
- ✅ Better authentication check
- ✅ Redirects to login if not authenticated
- ✅ Console logging for debugging

### 4. Login API (`src/app/api/auth/login/route.ts`)
- ✅ Better error messages
- ✅ Console logging for debugging
- ✅ Improved validation

## How to Test

### Test Signup (If you haven't already)
1. Go to: http://localhost:3000
2. Click "Get Started Free"
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Monthly Income: 50000
   - Monthly Expenses: 30000
4. Click "Sign Up"
5. **Open Browser Console (F12)** - You should see:
   - "Signup successful, redirecting to dashboard..."
   - "Dashboard - Auth check: {hasUser: true, hasToken: true, ...}"
   - "User authenticated: Test User"

### Test Login
1. Go to: http://localhost:3000/login
2. Enter:
   - Email: test@example.com
   - Password: password123
3. Click "Login"
4. **Open Browser Console (F12)** - You should see:
   - "Attempting login with: test@example.com"
   - "Login response: {status: 200, data: {...}}"
   - "Login successful, redirecting to dashboard..."
   - "Dashboard - Auth check: {hasUser: true, hasToken: true, ...}"
   - "User authenticated: Test User"

## Debugging Steps

### If Login/Signup Button Does Nothing:

1. **Open Browser Console (F12)**
   - Press F12 or Right-click → Inspect → Console tab
   - Look for any red error messages

2. **Check Network Tab**
   - F12 → Network tab
   - Try logging in
   - Look for the `/api/auth/login` request
   - Click on it to see:
     - Status code (should be 200)
     - Response data
     - Any errors

3. **Check Local Storage**
   - F12 → Application tab (Chrome) or Storage tab (Firefox)
   - Look under Local Storage → http://localhost:3000
   - After login, you should see:
     - `token`: (a long string)
     - `user`: (JSON with your user data)

### Common Issues & Solutions

#### Issue: "Invalid email or password"
**Solution**: Make sure you signed up first with that email

#### Issue: Page refreshes but stays on login
**Possible causes**:
1. JavaScript error (check console)
2. localStorage not working (check if enabled)
3. Redirect being blocked

**Try this**:
```javascript
// In browser console, manually test:
localStorage.setItem('test', 'value');
console.log(localStorage.getItem('test')); // Should show 'value'
```

#### Issue: Redirects to login immediately
**Cause**: Dashboard can't find user data

**Solution**: 
1. Clear localStorage: `localStorage.clear()`
2. Try signup again
3. Check console for errors

### Manual Test in Browser Console

After logging in, test in console (F12):

```javascript
// Check if data is stored
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));

// Manually redirect
window.location.href = '/dashboard';
```

## What Should Happen

### Successful Login Flow:
1. ✅ Click "Login" button
2. ✅ Button shows "Logging in..." with spinner
3. ✅ Console shows login attempt
4. ✅ API returns success (status 200)
5. ✅ Token and user saved to localStorage
6. ✅ Console shows "Login successful, redirecting..."
7. ✅ Page redirects to /dashboard
8. ✅ Dashboard shows loading spinner briefly
9. ✅ Dashboard loads with "Welcome back, [Your Name]!"

### Successful Signup Flow:
1. ✅ Click "Sign Up" button
2. ✅ Button shows "Creating Account..." with spinner
3. ✅ Console shows signup attempt
4. ✅ API creates user in database
5. ✅ API returns success with token
6. ✅ Token and user saved to localStorage
7. ✅ Console shows "Signup successful, redirecting..."
8. ✅ Page redirects to /dashboard
9. ✅ Dashboard loads with "Welcome back, [Your Name]!"

## Still Not Working?

### Try These Steps:

1. **Hard Refresh**
   - Windows: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

2. **Clear Browser Cache**
   - Ctrl + Shift + Delete
   - Clear "Cached images and files"
   - Clear "Cookies and site data"

3. **Try Incognito/Private Window**
   - Ctrl + Shift + N (Chrome)
   - Ctrl + Shift + P (Firefox)

4. **Check if Dev Server is Running**
   - Should see: "Local: http://localhost:3000"
   - If not, run: `npm run dev`

5. **Restart Dev Server**
   - Stop: Ctrl + C
   - Start: `npm run dev`

## Get Console Logs

If it's still not working, please share:
1. Browser console output (F12 → Console tab)
2. Network tab for /api/auth/login request
3. Any error messages you see

The console logs I added will help us see exactly where the issue is!
