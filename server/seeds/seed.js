require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookmarket';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('Cleared existing Users and Books.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.create([
      {
        name: 'Alex Turner',
        email: 'seller@bookmarket.com',
        password: hashedPassword,
        phoneOrWhatsApp: '+14155552671',
        city: 'San Francisco, CA',
      },
      {
        name: 'Maya Lin',
        email: 'buyer@bookmarket.com',
        password: hashedPassword,
        phoneOrWhatsApp: '+12065558914',
        city: 'Seattle, WA',
      },
    ]);

    const sellerId = users[0]._id;
    const buyerId = users[1]._id;

    const sampleBooks = [
      {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        isbn: '9781449373320',
        genre: 'Engineering & CS',
        condition: 'Like New',
        price: 32,
        originalPrice: 49,
        description:
          'The definitive guide to distributed systems architecture, storage engines, replication, partitioning, and stream processing. Pristine condition with no markings or dog-ears.',
        coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'San Francisco, CA',
        seller: sellerId,
      },
      {
        title: 'Structure and Interpretation of Computer Programs',
        author: 'Harold Abelson, Gerald Jay Sussman',
        isbn: '9780262510875',
        genre: 'Engineering & CS',
        condition: 'Gently Used',
        price: 28,
        originalPrice: 65,
        description:
          'Classic MIT textbook on computer science fundamentals using Scheme. Spine has minimal shelf wear, pages are crisp and unmarked.',
        coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'San Francisco, CA',
        seller: sellerId,
      },
      {
        title: 'Dune (Deluxe Hardcover Edition)',
        author: 'Frank Herbert',
        isbn: '9780593099322',
        genre: 'Fiction & Sci-Fi',
        condition: 'Brand New',
        price: 25,
        originalPrice: 40,
        description:
          'Frank Herbert’s masterpiece science fiction epic set on the desert planet Arrakis. Deluxe collector edition with poster pull-out and gilded edges. Still shrink-wrapped.',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'San Francisco, CA',
        seller: sellerId,
      },
      {
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        isbn: '9780593135204',
        genre: 'Fiction & Sci-Fi',
        condition: 'Like New',
        price: 15,
        originalPrice: 28,
        description:
          'A lone astronaut must save the Earth from an extinction-level atmospheric catastrophe. Read once over a weekend, essentially flawless paperback copy.',
        coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
        status: 'reserved',
        city: 'Seattle, WA',
        seller: buyerId,
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '9780735211292',
        genre: 'Non-Fiction',
        condition: 'Gently Used',
        price: 12,
        originalPrice: 27,
        description:
          'Tiny changes, remarkable results. Proven frameworks for building good habits and breaking bad ones. Very light highlighting in chapter 2 only.',
        coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'San Francisco, CA',
        seller: sellerId,
      },
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        isbn: '9780374533557',
        genre: 'Non-Fiction',
        condition: 'Heavily Read',
        price: 8,
        originalPrice: 22,
        description:
          'Nobel laureate Daniel Kahneman on behavioral economics, system 1 vs system 2 cognition, and cognitive biases. Cover shows gentle bends, binding is rock solid.',
        coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Seattle, WA',
        seller: buyerId,
      },
      {
        title: 'Watchmen (International Edition)',
        author: 'Alan Moore & Dave Gibbons',
        isbn: '9781779501127',
        genre: 'Comics & Manga',
        condition: 'Brand New',
        price: 22,
        originalPrice: 35,
        description:
          'The Hugo Award-winning graphic novel that redefined superhero storytelling. Complete unread edition with pristine full-color offset printing.',
        coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'San Francisco, CA',
        seller: sellerId,
      },
      {
        title: 'Berserk Deluxe Volume 1',
        author: 'Kentaro Miura',
        isbn: '9781506711980',
        genre: 'Comics & Manga',
        condition: 'Like New',
        price: 34,
        originalPrice: 50,
        description:
          'Oversized 7x10 inch leatherette hardcover collecting issues 1-3 of Miura’s dark fantasy masterpiece. Beautiful shelf presence with red ribbon bookmark.',
        coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80',
        status: 'sold',
        city: 'Seattle, WA',
        seller: buyerId,
      },
      {
        title: 'Cracking the Coding Interview (6th Edition)',
        author: 'Gayle Laakmann McDowell',
        isbn: '9780984782857',
        genre: 'Exam Prep',
        condition: 'Like New',
        price: 26,
        originalPrice: 45,
        description:
          '189 programming questions and solutions covering Big O, data structures, dynamic programming, and systems design. Unmarked and clean spine.',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'San Francisco, CA',
        seller: sellerId,
      },
      {
        title: 'The Official Guide to the GRE General Test',
        author: 'Educational Testing Service (ETS)',
        isbn: '9781259862410',
        genre: 'Exam Prep',
        condition: 'Gently Used',
        price: 18,
        originalPrice: 40,
        description:
          'Authentic past test questions and authentic scoring criteria direct from the test makers. Includes practice test papers without pencil marks.',
        coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Seattle, WA',
        seller: buyerId,
      },
    ];

    await Book.insertMany(sampleBooks);
    console.log(`Successfully seeded ${sampleBooks.length} realistic book listings.`);

    console.log('\n--- Seed Verification ---');
    console.log('Demo Seller: seller@bookmarket.com / password123');
    console.log('Demo Buyer:  buyer@bookmarket.com / password123');
    console.log('-------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
