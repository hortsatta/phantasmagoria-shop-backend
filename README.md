phantasmagoria-shop-backend
======================
A GraphQL API for the [phantasmagoria-shop-frontend](https://github.com/hortsatta/phantasmagoria-shop-frontend#readme) project, using Strapi and Node.js.

## :comet: Prerequisites
- [Cloudinary](https://cloudinary.com/) for image upload.
- [Stripe](https://cloudinary.com/) to emulate credit card payment.

## :comet: Getting Started
On your favourite terminal:

1. Clone the repository
```bash
> git clone git@github.com:hortsatta/phantasmagoria-shop-backend.git
```
2. Navigate to project folder
```bash
> cd phantasmagoria-shop-backend
```
3. Install project dependencies
```bash
> npm install
```
4. Create an `.env` file on your project's root folder and insert the following lines. You can find the following variables on your Cloudinary and Stripe account.
```bash
CLOUDINARY_NAME=#cloudinaryName
CLOUDINARY_KEY=#cloudinaryKey
CLOUDINARY_SECRET=#cloudinarySecret
STRIPE_SECRET_KEY=#stripeSecretKey
```
5. Run the project.
```bash
> npm run develop
```
6. Open the Strapi admin panel on your browser and navigate to `Settings > Users & Permissions Plugin > Roles` and add a new administrator role.
