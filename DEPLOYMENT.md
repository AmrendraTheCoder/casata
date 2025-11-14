# YieldShift - Deployment Guide

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:5173
```

---

## 🌐 Page Navigation

- **Home/Dashboard**: `http://localhost:5173` or `http://localhost:5173/#home`
- **How to Use**: `http://localhost:5173/#how-to-use`
- **Vocabulary**: `http://localhost:5173/#vocabulary`

---

## 📦 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

---

## 🌍 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Follow prompts**:
   - Link to project
   - Configure build settings (automatically detected)
   - Deploy!

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Option 2: Netlify

1. **Install Netlify CLI**:
```bash
npm i -g netlify-cli
```

2. **Deploy**:
```bash
netlify deploy --prod
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Update package.json**:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/yieldshift"
}
```

3. **Deploy**:
```bash
npm run deploy
```

### Option 4: Static Hosting (S3, GCS, etc.)

1. **Build the project**:
```bash
npm run build
```

2. **Upload `dist/` folder** to your hosting provider

3. **Configure**:
   - Set index.html as the entry point
   - Configure 404 redirects to index.html for SPA routing

---

## 🔧 Environment Variables

Create a `.env` file for production:

```env
# API Endpoints (when ready)
VITE_DEFILLAMA_API=https://api.llama.fi
VITE_ALCHEMY_API_KEY=your_alchemy_key
VITE_ML_SERVICE_URL=https://your-ml-service.com

# Chain IDs
VITE_ETHEREUM_CHAIN_ID=1
VITE_ARBITRUM_CHAIN_ID=42161
VITE_BASE_CHAIN_ID=8453

# Feature Flags
VITE_ENABLE_WALLET_CONNECT=true
VITE_ENABLE_DEMO_MODE=true
```

---

## 🐛 Common Deployment Issues

### Issue: White screen after deployment
**Solution**: Check that base path is configured correctly in `vite.config.js`

### Issue: Routes not working (404 on refresh)
**Solution**: Add redirects/rewrites to route all requests to index.html

### Issue: Build fails
**Solution**: 
- Ensure all dependencies are in `package.json`
- Check Node version (requires Node 16+)
- Run `npm install` to ensure all packages are installed

### Issue: Environment variables not working
**Solution**: Ensure all env vars are prefixed with `VITE_`

---

## 📊 Performance Optimization

### Already Implemented:
- ✅ Code splitting with React lazy loading
- ✅ Optimized images and assets
- ✅ Minified CSS/JS in production
- ✅ Tree-shaking unused code

### Additional Optimizations:
1. **Enable Gzip/Brotli compression** on your hosting
2. **Add CDN** for static assets
3. **Implement service worker** for offline support (PWA)
4. **Add image optimization** (WebP format)
5. **Lazy load heavy components** (charts, modals)

---

## 🔐 Security Checklist

- ✅ No API keys in client-side code
- ✅ HTTPS enforced
- ✅ Read-only wallet permissions
- ✅ Input validation
- ✅ XSS protection (React built-in)
- ⏳ Rate limiting on API calls (to be added)
- ⏳ CORS configuration (when backend is added)

---

## 🧪 Testing Before Deployment

```bash
# Run linter
npm run lint

# Build production
npm run build

# Test production build locally
npm run preview

# Check bundle size
npm run build -- --mode production --analyze
```

**Manual Testing Checklist**:
- [ ] Connect MetaMask wallet
- [ ] View dashboard with positions
- [ ] Click on position card
- [ ] Open migration opportunity modal
- [ ] Navigate to How to Use page
- [ ] Navigate to Vocabulary page
- [ ] Test on mobile (responsive)
- [ ] Test on different browsers

---

## 📈 Monitoring & Analytics

### Recommended Services:
1. **Google Analytics** - User behavior tracking
2. **Sentry** - Error monitoring
3. **Vercel Analytics** - Performance metrics
4. **Web Vitals** - Core performance metrics

### Add Google Analytics:
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🎯 Post-Deployment Steps

1. **Verify all pages load correctly**
2. **Test wallet connection**
3. **Check mobile responsiveness**
4. **Verify navigation works**
5. **Test on different browsers** (Chrome, Firefox, Safari, Brave)
6. **Check console for errors**
7. **Run Lighthouse audit** (should score 90+)
8. **Set up monitoring/analytics**

---

## 🔄 CI/CD Setup (Optional)

### GitHub Actions Example:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🌟 Going Live Checklist

### Pre-Launch:
- [ ] All features tested
- [ ] Mobile responsive
- [ ] Browser compatibility tested
- [ ] Performance optimized
- [ ] SEO meta tags added
- [ ] Favicon added
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Analytics configured

### Launch:
- [ ] Deploy to production
- [ ] Test production URL
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate
- [ ] Submit to Web3 directories
- [ ] Share on social media

### Post-Launch:
- [ ] Monitor error logs
- [ ] Track user analytics
- [ ] Gather user feedback
- [ ] Plan next iteration
- [ ] Regular dependency updates

---

## 📞 Support & Maintenance

### Regular Maintenance:
- **Weekly**: Check error logs
- **Bi-weekly**: Update dependencies
- **Monthly**: Performance audit
- **Quarterly**: Security audit

### Dependency Updates:
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update to latest (with breaking changes)
npm install package@latest
```

---

## 🎉 You're Ready to Deploy!

Your YieldShift application is production-ready with:
- ✅ Beautiful dark theme UI
- ✅ Complete navigation system
- ✅ Wallet integration
- ✅ Educational resources
- ✅ Responsive design
- ✅ Optimized performance

Choose your deployment method above and go live! 🚀

For questions or issues, refer to:
- `FEATURES.md` - Complete feature documentation
- `README.md` - Project overview
- `QUICKSTART.md` - Quick development guide

