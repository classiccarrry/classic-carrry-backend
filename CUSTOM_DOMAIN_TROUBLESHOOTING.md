# Custom Domain Troubleshooting Guide

## Issue: Can't access backend from custom domain

### Step 1: Verify Environment Variables on Render

1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Check that `USER_URL` is set correctly:

```
USER_URL=https://yourdomain.com
```

**Important**: 
- Include `https://` protocol
- NO trailing slash
- Use the exact domain (with or without www)

Example:
```
✅ CORRECT: https://classiccarrry.com
✅ CORRECT: https://www.classiccarrry.com
❌ WRONG: classiccarrry.com (missing protocol)
❌ WRONG: https://classiccarrry.com/ (trailing slash)
```

### Step 2: Redeploy Backend

After updating environment variables:
1. Go to **Manual Deploy** in Render dashboard
2. Click **Deploy latest commit**
3. Wait for deployment to complete (2-3 minutes)

### Step 3: Test CORS from Browser Console

Open your custom domain in browser, then open Developer Console (F12) and run:

```javascript
fetch('https://your-backend.onrender.com/api/health', {
  method: 'GET',
  headers: {
    'Origin': 'https://yourdomain.com'
  }
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

### Step 4: Check Backend Logs

1. Go to Render dashboard → Your service → **Logs**
2. Look for CORS messages:
   - `CORS rejected origin: https://yourdomain.com`
   - Check what domains are in "Allowed domains" list

### Step 5: Verify Domain Format

Make sure your domain in Render environment variables matches EXACTLY how the browser sends it:

**Check browser's Origin header:**
1. Open your custom domain
2. Open DevTools (F12) → Network tab
3. Refresh page
4. Click any API request
5. Look at **Request Headers** → **Origin**
6. Copy the EXACT value

**Update Render environment variable to match:**
```
USER_URL=<paste exact origin here>
```

### Step 6: Common Issues & Solutions

#### Issue: "Not allowed by CORS" error

**Solution 1: Check protocol**
```bash
# If your site uses HTTPS, use:
USER_URL=https://yourdomain.com

# If HTTP (not recommended):
USER_URL=http://yourdomain.com
```

**Solution 2: Check www subdomain**
```bash
# If browser shows www:
USER_URL=https://www.yourdomain.com

# If no www:
USER_URL=https://yourdomain.com
```

**Solution 3: Add both versions**
```bash
USER_URL=https://yourdomain.com
CUSTOM_DOMAIN_1=https://www.yourdomain.com
```

#### Issue: Environment variables not updating

**Solution:**
1. Delete the old variable
2. Add it again with correct value
3. Click **Save Changes**
4. **Manual Deploy** → Deploy latest commit

#### Issue: Works on Vercel but not custom domain

**Cause:** Vercel domains (*.vercel.app) are automatically allowed

**Solution:** 
1. Ensure custom domain is in environment variables
2. Redeploy backend
3. Clear browser cache (Ctrl+Shift+Delete)

### Step 7: Quick Test Commands

**Test 1: Check if backend is accessible**
```bash
curl https://your-backend.onrender.com/api/health
```
Should return: `{"status":"OK","message":"Server is running",...}`

**Test 2: Test CORS with your domain**
```bash
curl -H "Origin: https://yourdomain.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     --verbose \
     https://your-backend.onrender.com/api/health
```

Look for in response:
```
Access-Control-Allow-Origin: https://yourdomain.com
```

### Step 8: Temporary Solution (Testing Only)

If you need to test immediately, temporarily allow all origins:

**⚠️ NOT RECOMMENDED FOR PRODUCTION**

In Render environment, add:
```
NODE_ENV=development
```

This will allow all origins. Remove this after testing!

### Step 9: DNS & Vercel Configuration

Make sure your custom domain is properly configured:

**In Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS instructions

**DNS Records (at your domain registrar):**
```
Type: CNAME
Name: @ (or www)
Value: cname.vercel-dns.com
```

Wait 5-10 minutes for DNS propagation.

### Step 10: Clear All Caches

1. **Browser cache**: Ctrl+Shift+Delete → Clear all
2. **Vercel cache**: Redeploy your frontend
3. **Render cache**: Redeploy your backend
4. **DNS cache**: 
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac/Linux
   sudo dscacheutil -flushcache
   ```

### Step 11: Verify Frontend API URL

Check your frontend `.env` file:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

Make sure it's pointing to the correct backend URL.

### Step 12: Check Browser Console

Open your custom domain and check console for errors:

**Common errors:**

1. **"Failed to fetch"**
   - Backend is down or URL is wrong
   - Check backend URL in `.env`

2. **"CORS policy"**
   - Domain not in backend environment variables
   - Follow steps 1-2 above

3. **"net::ERR_NAME_NOT_RESOLVED"**
   - DNS not configured properly
   - Check Step 9

### Final Checklist

- [ ] Custom domain added to Vercel
- [ ] DNS configured correctly
- [ ] `USER_URL` set in Render with `https://` and no trailing slash
- [ ] Backend redeployed after env variable change
- [ ] Frontend redeployed with correct API URL
- [ ] Browser cache cleared
- [ ] Tested CORS with curl command
- [ ] Checked Render logs for CORS messages

### Still Not Working?

**Debug mode:**

1. Check Render logs in real-time
2. Open your custom domain
3. Watch for "CORS rejected origin" messages
4. Compare rejected origin with your USER_URL value
5. They must match EXACTLY

**Get help:**
- Check Render logs: Dashboard → Service → Logs
- Check browser console: F12 → Console tab
- Check network requests: F12 → Network tab

### Contact Support

If still having issues, provide:
1. Your custom domain URL
2. Backend URL (Render)
3. Screenshot of Render environment variables
4. Screenshot of browser console error
5. Render logs showing CORS rejection

---

**Quick Fix Summary:**

1. Set `USER_URL=https://yourdomain.com` in Render (exact format)
2. Redeploy backend on Render
3. Clear browser cache
4. Test again

Most issues are solved by ensuring the domain format matches exactly!
