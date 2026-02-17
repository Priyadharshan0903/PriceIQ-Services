import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

// MongoDB connection strings
const PRODUCT_DB_URI = process.env.PRODUCT_MONGODB_URI || 'mongodb://localhost:27018/product_db';
const REVIEW_DB_URI = process.env.REVIEW_MONGODB_URI || 'mongodb://localhost:27019/review_db';

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  price: Number,
  images: [String],
  specifications: mongoose.Schema.Types.Mixed,
  stock: Number,
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: String,
  parentId: String,
}, { timestamps: true });

// Review Schema
const reviewSchema = new mongoose.Schema({
  productId: String,
  userId: String,
  rating: Number,
  title: String,
  content: String,
  helpful: Number,
}, { timestamps: true });

const reviewStatsSchema = new mongoose.Schema({
  productId: String,
  averageRating: Number,
  totalReviews: Number,
  ratingDistribution: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
  },
}, { timestamps: true });

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Connect to Product DB
    const productConn = await mongoose.createConnection(PRODUCT_DB_URI).asPromise();
    console.log('Connected to Product DB');

    const Product = productConn.model('Product', productSchema);
    const Category = productConn.model('Category', categorySchema);

    // Connect to Review DB
    const reviewConn = await mongoose.createConnection(REVIEW_DB_URI).asPromise();
    console.log('Connected to Review DB');

    const Review = reviewConn.model('Review', reviewSchema);
    const ReviewStats = reviewConn.model('ReviewStats', reviewStatsSchema);

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});
    await ReviewStats.deleteMany({});
    console.log('Cleared existing data');

    // Load data files
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf-8')
    );
    const categoriesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/categories.json'), 'utf-8')
    );
    const reviewsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/reviews.json'), 'utf-8')
    );

    // Seed categories
    await Category.insertMany(categoriesData);
    console.log(`Seeded ${categoriesData.length} categories`);

    // Seed products
    const insertedProducts = await Product.insertMany(productsData);
    console.log(`Seeded ${insertedProducts.length} products`);

    // Seed reviews
    let totalReviews = 0;
    for (const product of insertedProducts) {
      const productReviews = reviewsData[product.name];

      if (productReviews) {
        const reviewDocs = productReviews.map((review: any) => ({
          productId: product._id.toString(),
          userId: `user_${Math.random().toString(36).substr(2, 9)}`,
          rating: review.rating,
          title: review.title,
          content: review.content,
          helpful: review.helpful,
        }));

        await Review.insertMany(reviewDocs);
        totalReviews += reviewDocs.length;

        // Calculate and save review stats
        const avgRating = reviewDocs.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewDocs.length;
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviewDocs.forEach((r: any) => {
          distribution[r.rating as keyof typeof distribution]++;
        });

        await ReviewStats.create({
          productId: product._id.toString(),
          averageRating: avgRating,
          totalReviews: reviewDocs.length,
          ratingDistribution: distribution,
        });
      }
    }

    console.log(`Seeded ${totalReviews} reviews`);
    console.log('Database seeding completed successfully!');

    // Close connections
    await productConn.close();
    await reviewConn.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
