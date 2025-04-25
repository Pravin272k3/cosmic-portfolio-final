# Deploying to Netlify

This guide will help you deploy your Cosmic Portfolio to Netlify.

## Prerequisites

1. A [Netlify account](https://app.netlify.com/signup)
2. A [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register)
3. A [Cloudinary account](https://cloudinary.com/users/register/free)

## Setup MongoDB Atlas

1. Create a new cluster (the free tier is sufficient)
2. Set up database access (create a user with password)
3. Set up network access (allow access from anywhere for simplicity)
4. Get your connection string

## Setup Cloudinary

1. Navigate to your dashboard to get your cloud name, API key, and API secret

## Deployment Steps

### 1. Connect Your Repository to Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure build settings:
   - Build command: `npm run netlify-build`
   - Publish directory: `.next`

### 2. Set Environment Variables

In your Netlify site settings, go to "Environment variables" and add the following:

```
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=cosmic-portfolio
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
ADMIN_EMAIL=sharma272k3@gmail.com
ADMIN_PASSWORD=27april2003
```

### 3. Deploy Your Site

1. Click "Deploy site"
2. Wait for the build to complete
3. Your site should now be live at the provided Netlify URL

## Troubleshooting

If you encounter issues with the admin functionality:

1. Check the Netlify function logs in the Netlify dashboard
2. Verify that all environment variables are set correctly
3. Make sure your MongoDB Atlas cluster is accessible from Netlify
4. Check that your Cloudinary credentials are correct

## Accessing the Admin Panel

The admin panel is available at `/admin` on your Netlify site. Use the following credentials to log in:

- Email: sharma272k3@gmail.com
- Password: 27april2003
