# Login Redirect Fix - Testing Steps

## Changes Made

1. **Login Page (`src/app/login/page.tsx`)**
   - Added `credentials: 'include'` to fetch request
   - Added token storage in localStorage as backup
   - Added 300ms delay before redirect to ensure cookie is set
   - Added auth check endpoint call to verify cookie
   - Using `window.location.href` for hard redirect

2. **Middleware (`src/middleware.ts`)**
   - Enhanced token verification with better logging
   - Added fallback to check Authorization header
   - More detailed console logs for debugging

3. **Login API (`src/app/api/auth/login/route.ts`)**
   - Added detailed logging for cookie setting
   - Cookie settings remain the same (httpOnly, secure in prod, sameSite: lax)

4. **New Auth Check Endpoint (`src/app/api/auth/check/route.ts`)**
   - Created endpoint to verify if cookie is set correctly
   - Returns authentication status and token info

## Testing Steps

1. **Clear Browser Data**
   ```
   - Open DevTools (F12)
   - Go to Application tab
   - Clear all cookies for localhost:3000
   - Clear localStorage
   - Close DevTools
   ```

2. **Restart Development Server**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

3. **Test Login Flow**
   - Open browser console (F12 -> Console tab)
   - Navigate to http://localhost:3000/login
   - Enter credentials and click Login
   - Watch console logs for:
     - "Login: attempting with [email]"
     - "Login API success"
     - "Auth check after login"
     - "Redirecting to dashboard..."
   - Should redirect to /dashboard

4. **Check Console Logs**
   Look for these logs in order:
   ```
   Login: attempting with [email]
   Login API success: { user: {...}, hasToken: true }
   Login successful, waiting for cookie to be set...
   Auth check after login: { authenticated: true, ... }
   Redirecting to dashboard...
   Middleware: Token verification { pathname: '/dashboard', hasToken: true, isAuthenticated: true }
   ```

5. **If Still Redirecting to Login**
   Check these:
   - Is the cookie being set? (DevTools -> Application -> Cookies)
   - Is the token valid? (Check console for "Auth check" result)
   - Is middleware seeing the token? (Check server console for "Middleware:" logs)

## Common Issues

### Issue: Cookie not being set
**Solution**: Make sure you're using `credentials: 'include'` in fetch requests

### Issue: Token invalid
**Solution**: Check JWT_SECRET in .env file matches between API and middleware

### Issue: Middleware not seeing cookie
**Solution**: Restart dev server to pick up middleware changes

### Issue: Still redirecting to login
**Solution**: Check browser console and server console for specific error messages

## Manual Cookie Test

If automatic login fails, you can manually test the cookie:

1. Login and copy the token from console
2. Open DevTools -> Application -> Cookies
3. Manually add a cookie:
   - Name: `token`
   - Value: [paste token]
   - Path: `/`
   - HttpOnly: checked
4. Navigate to /dashboard
5. Should work if middleware is functioning

## Next Steps if Issue Persists

1. Check server console for middleware logs
2. Check browser console for login flow logs
3. Verify cookie is in browser (DevTools -> Application -> Cookies)
4. Test the /api/auth/check endpoint directly
5. Share console logs for further debugging
