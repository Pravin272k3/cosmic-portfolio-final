This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Database Setup (Required for Vercel Deployment)

This project uses MongoDB for data storage and Cloudinary for image uploads. Follow these steps to set up your database:

1. **MongoDB Atlas Setup**:
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Create a new cluster (the free tier is sufficient)
   - Set up database access (create a user with password)
   - Set up network access (allow access from anywhere for simplicity)
   - Get your connection string

2. **Cloudinary Setup**:
   - Create a free account at [Cloudinary](https://cloudinary.com/users/register/free)
   - Navigate to your dashboard to get your cloud name, API key, and API secret

3. **Install Dependencies**:
   ```bash
   node install-db-deps.js
   ```

### Deployment Steps

1. Create a Vercel account if you don't have one
2. Connect your GitHub repository to Vercel
3. Set up the following environment variables in the Vercel dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `MONGODB_DB` - Your database name
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` - Your EmailJS public key
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID` - Your EmailJS service ID
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` - Your EmailJS template ID
   - `NODE_ENV=production`
4. Deploy your application

### Admin Access

After deployment, you can access the admin panel at:
- URL: `https://your-vercel-domain.vercel.app/admin`
- Email: `sharma272k3@gmail.com`
- Password: `27april2003`

### Important Notes

- The admin functionality uses cookies for authentication, which are configured to work in a production environment
- File uploads (artwork images) are stored in Cloudinary, which is accessible from serverless environments
- Data is stored in MongoDB, which is accessible from serverless environments
- This setup ensures your admin functionality works properly on Vercel's serverless platform

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
