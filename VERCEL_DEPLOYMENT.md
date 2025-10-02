# Vercel Deployment Guide

## Automatic Deployment (Recommended)

### Step 1: Connect to Vercel

1. Visit [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your `vealthx-defi` repository

### Step 2: Configure Project

**Project Settings:**
- Framework Preset: Vite
- Root Directory: `./`
- Build Command: `cd vealthfx/frontend && npm install && npm run build`
- Output Directory: `vealthfx/frontend/dist`
- Install Command: `cd vealthfx/frontend && npm install`

### Step 3: Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_COINGECKO_API_KEY=your_api_key
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your site will be live at: `https://vealthx-defi.vercel.app/`

---

## Manual Deployment (CLI)

### Install Vercel CLI

```bash
npm install -g vercel
```

### Login to Vercel

```bash
vercel login
```

### Deploy

```bash
# From project root
cd "d:\Dev Projects\VealthX-Defi Project"

# Deploy to production
vercel --prod
```

---

## Continuous Deployment

Once connected to Vercel:

✅ **Automatic Deployments:**
- Every push to `main` branch → Production deployment
- Every pull request → Preview deployment
- Automatic builds and updates

✅ **Custom Domain (Optional):**
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain (e.g., vealthx.com)
3. Configure DNS records
4. SSL automatically enabled

---

## Vercel Configuration

The `vercel.json` file in the root directory contains:

```json
{
  "buildCommand": "cd vealthfx/frontend && npm install && npm run build",
  "outputDirectory": "vealthfx/frontend/dist",
  "devCommand": "cd vealthfx/frontend && npm run dev",
  "installCommand": "cd vealthfx/frontend && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Troubleshooting

### Build Fails

**Issue:** Build command not finding files  
**Solution:** Ensure `vercel.json` has correct paths

**Issue:** Module not found  
**Solution:** Check `package.json` dependencies are complete

### Environment Variables

**Issue:** API not working in production  
**Solution:** Add environment variables in Vercel Dashboard

### Routing Issues

**Issue:** 404 on page refresh  
**Solution:** Verify `rewrites` in `vercel.json`

---

## Post-Deployment

### Update URLs

After deployment, update these files:

1. **README.md** - Change demo link to Vercel URL
2. **DOCUMENTATION.md** - Update deployment instructions
3. **Social Media** - Share new Vercel URL

### Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Edge caching
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Analytics

---

## Links

- **Your Live App:** https://vealthx-defi.vercel.app/
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs

---

**Deployment Status:** 🟢 Ready for Deployment

Your VealthX Protocol is configured and ready to go live on Vercel! 🚀
