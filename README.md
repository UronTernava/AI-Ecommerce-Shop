# AI-Shop

AI-Shop is a modern, intelligent ecommerce platform built with React that leverages artificial intelligence to provide personalized product recommendations. It features a beautiful, accessible UI, AI-powered product suggestions, user authentication, and a responsive design with smooth animations and transitions.

## Features

- **AI-Powered Product Recommendations**: Smart product suggestions based on user preferences and behavior
- **Modern UI/UX**: Beautiful glassmorphism design with smooth animations and transitions
- **User Authentication**: Complete auth system (register, login, forgot password)
- **Product Management**: Detailed product pages with images, descriptions, and specifications
- **Wishlist & Recently Viewed**: Track favorite products and browsing history
- **Responsive Design**: Optimized for all devices with professional layout
- **Dark/Light Mode**: Toggle between themes with high contrast and accessibility
- **Hot Deals Section**: Featured promotional products with discounts
- **About Us**: Team showcase with professional profiles
- **Contact & Support**: User-friendly contact forms and support resources

## Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Animations**: Framer Motion
- **Icons**: React Icons (Feather Icons)
- **State Management**: React Context API
- **Build Tool**: Vite

## Setup (Development Only)

**Note**: This project is proprietary. Cloning, using, or modifying this code is strictly prohibited without written permission from Uron Tërnava.

1. Clone the repository (if you have permission):
   ```bash
   git clone https://github.com/UronTernava/AI-Ecommerce-Shop.git
   ```

2. Navigate to the project directory:
   ```bash
   cd AI-Ecommerce-Shop
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173` (or the port shown in terminal)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── sections/       # Main page sections
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── AboutUs.jsx
│   │   ├── ContactUs.jsx
│   │   └── Footer.jsx
│   ├── ProductCard.jsx
│   ├── LoadingScreen.jsx
│   └── WishListButton.jsx
├── pages/              # Page components
│   ├── ProductsPage.jsx
│   └── auth/          # Authentication pages
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── utils/              # Utility functions
└── assets/             # Images and static assets
```

## Key Features Explained

### AI-Suggested Products
- Personalized product recommendations based on user preferences
- Visual product cards with pricing and descriptions
- Eco-friendly and tech-level tags for product categorization

### Hot Deals This Week
- Featured promotional products with discount percentages
- Animated hover effects and smooth transitions
- Responsive grid layout for optimal viewing

### User Authentication
- Secure login and registration system
- Password recovery functionality
- User profile management
- Protected routes and session handling

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Smooth scrolling navigation
- Optimized for all screen sizes
- Accessibility features included

## Legal and Resources

- [Terms of Service](./LICENSE) - Usage terms and conditions
- [Privacy Policy](./LICENSE) - Data protection and privacy information
- [Support](mailto:hello@aishop.app) - Technical support and inquiries

## License

This project is proprietary. No use, distribution, or modification is allowed without explicit written permission. See [LICENSE](./LICENSE) for details.

## Author & Contact

**Uron Tërnava**

- **GitHub**: [@UronTernava](https://github.com/UronTernava)
- **Instagram**: [@uronternava](https://instagram.com/uronternava)
- **LinkedIn**: [Uron Tërnava](https://linkedin.com/in/uronternava)
- **Email**: uronternava1@gmail.com
- **Phone**: +38345848061 (WhatsApp and Viber)

For business inquiries, contact: hello@aishop.app

---

**Copyright © 2025 Uron Tërnava. All rights reserved.**

// for backend and database

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(100),
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Wishlist table
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_user_product (user_id, product_id)
);