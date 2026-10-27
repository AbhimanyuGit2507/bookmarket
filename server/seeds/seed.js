require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookmarket';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB for seeding (${mongoUri.includes('mongodb+srv') ? 'Atlas Cloud' : 'Local'})...`);

    const demoEmails = [
      'seller@bookmarket.com',
      'buyer@bookmarket.com',
      'david@bookmarket.com',
      'sarah@bookmarket.com',
    ];

    // Delete only previous demo books and demo accounts, preserving any real registered users
    const existingDemoUsers = await User.find({ email: { $in: demoEmails } });
    const demoUserIds = existingDemoUsers.map((u) => u._id);
    await Book.deleteMany({ seller: { $in: demoUserIds } });
    await User.deleteMany({ email: { $in: demoEmails } });
    console.log('Refreshed demo fixture accounts while keeping all real registered user accounts safe.');

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
      {
        name: 'David Chen',
        email: 'david@bookmarket.com',
        password: hashedPassword,
        phoneOrWhatsApp: '+15125553901',
        city: 'Austin, TX',
      },
      {
        name: 'Sarah Jenkins',
        email: 'sarah@bookmarket.com',
        password: hashedPassword,
        phoneOrWhatsApp: '+16175558420',
        city: 'Boston, MA',
      },
    ]);

    const [u1, u2, u3, u4] = users.map((u) => u._id);

    const sampleBooks = [
      // 1. Engineering & CS
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
        coverImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'San Francisco, CA',
        seller: u1,
      },
      {
        title: 'Structure and Interpretation of Computer Programs',
        author: 'Harold Abelson & Gerald Jay Sussman',
        isbn: '9780262510875',
        genre: 'Engineering & CS',
        condition: 'Gently Used',
        price: 28,
        originalPrice: 65,
        description:
          'Classic MIT textbook on computer science fundamentals using Scheme. Spine has minimal shelf wear, pages are crisp and unmarked.',
        coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Boston, MA',
        seller: u4,
      },
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        genre: 'Engineering & CS',
        condition: 'Brand New',
        price: 26,
        originalPrice: 47,
        description:
          'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Brand new unread copy, no tears or bent corners.',
        coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Austin, TX',
        seller: u3,
      },
      {
        title: 'The Pragmatic Programmer: 20th Anniversary Edition',
        author: 'David Thomas & Andrew Hunt',
        isbn: '9780135957059',
        genre: 'Engineering & CS',
        condition: 'Like New',
        price: 29,
        originalPrice: 50,
        description:
          'Fresh insights, career longevity tips, and core craftsmanship lessons for professional software engineers. Purchased last semester, immaculate condition.',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Seattle, WA',
        seller: u2,
      },
      {
        title: 'Introduction to Algorithms (CLRS 3rd Edition)',
        author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
        isbn: '9780262033848',
        genre: 'Engineering & CS',
        condition: 'Gently Used',
        price: 45,
        originalPrice: 95,
        description:
          'Standard computer science algorithms textbook. Comprehensive reference with in-depth pseudocode proofs. Solid hardcover binding, minimal highlighter in chapters 1-4.',
        coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'San Francisco, CA',
        seller: u1,
      },

      // 2. Fiction & Sci-Fi
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
        seller: u1,
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
        status: 'available',
        city: 'Seattle, WA',
        seller: u2,
      },
      {
        title: 'The Three-Body Problem',
        author: 'Cixin Liu (Translated by Ken Liu)',
        isbn: '9780765382030',
        genre: 'Fiction & Sci-Fi',
        condition: 'Like New',
        price: 13,
        originalPrice: 20,
        description:
          'Hugo Award winning hard science fiction trilogy opening novel set during China’s Cultural Revolution and a distant alien world. No creased spine.',
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Austin, TX',
        seller: u3,
      },
      {
        title: '1984 (Centennial Hardcover Collector)',
        author: 'George Orwell',
        isbn: '9780452284234',
        genre: 'Fiction & Sci-Fi',
        condition: 'Brand New',
        price: 16,
        originalPrice: 30,
        description:
          'Classic dystopian masterpiece on totalitarian control, doublethink, and the power of language. Ribbon bookmark, clothbound cover in flawless condition.',
        coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Boston, MA',
        seller: u4,
      },
      {
        title: 'Neuromancer (Sprawl Trilogy Book 1)',
        author: 'William Gibson',
        isbn: '9780441569595',
        genre: 'Fiction & Sci-Fi',
        condition: 'Gently Used',
        price: 10,
        originalPrice: 18,
        description:
          'The landmark cyberpunk novel that coined the term cyberspace and won the Hugo, Nebula, and Philip K. Dick awards. Minimal edge wear on cover.',
        coverImage: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
        status: 'reserved',
        city: 'San Francisco, CA',
        seller: u1,
      },

      // 3. Non-Fiction
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
        seller: u1,
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
        seller: u2,
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '9780062316097',
        genre: 'Non-Fiction',
        condition: 'Like New',
        price: 14,
        originalPrice: 26,
        description:
          'Explores how an insignificant ape became the ruler of planet Earth. Insightful exploration of biological evolution, cognitive revolution, and global societies.',
        coverImage: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Austin, TX',
        seller: u3,
      },
      {
        title: 'Deep Work: Rules for Focused Success in a Distracted World',
        author: 'Cal Newport',
        isbn: '9781455586691',
        genre: 'Non-Fiction',
        condition: 'Brand New',
        price: 15,
        originalPrice: 28,
        description:
          'How to cultivate intense focus in a world overflowing with digital distractions and superficial metrics. Unread paperback copy, straight spine.',
        coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Boston, MA',
        seller: u4,
      },
      {
        title: 'Zero to One: Notes on Startups, or How to Build the Future',
        author: 'Peter Thiel & Blake Masters',
        isbn: '9780804139298',
        genre: 'Non-Fiction',
        condition: 'Like New',
        price: 11,
        originalPrice: 24,
        description:
          'The great secret of our time is that there are still uncharted frontiers to explore. Clear hardcover dust jacket, completely clean margins.',
        coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'San Francisco, CA',
        seller: u1,
      },

      // 4. Comics & Manga
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
        seller: u1,
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
        status: 'available',
        city: 'Seattle, WA',
        seller: u2,
      },
      {
        title: 'Death Note Black Edition Volume 1',
        author: 'Tsugumi Ohba & Takeshi Obata',
        isbn: '9781421539645',
        genre: 'Comics & Manga',
        condition: 'Like New',
        price: 13,
        originalPrice: 22,
        description:
          'Omnibus collector edition with black page edges and color double spreads. Collects chapters 1-16. Read once, spine intact.',
        coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Austin, TX',
        seller: u3,
      },
      {
        title: 'Demon Slayer: Kimetsu no Yaiba Volume 1',
        author: 'Koyoharu Gotouge',
        isbn: '9781974700523',
        genre: 'Comics & Manga',
        condition: 'Gently Used',
        price: 8,
        originalPrice: 15,
        description:
          'Tanjiro sets out on the path of the Demon Slayer after his family is slaughtered and sister Nezuko is cursed. Great condition with crisp print.',
        coverImage: 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Boston, MA',
        seller: u4,
      },
      {
        title: 'Attack on Titan Colossal Edition 1',
        author: 'Hajime Isayama',
        isbn: '9781612629711',
        genre: 'Comics & Manga',
        condition: 'Like New',
        price: 32,
        originalPrice: 55,
        description:
          'Massive 7x10.5 inch edition printed on premium glossy paper containing the first 5 volumes of the historic dark fantasy series. Minor corner bump.',
        coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80',
        status: 'sold',
        city: 'Seattle, WA',
        seller: u2,
      },

      // 5. Exam Prep
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
        seller: u1,
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
        seller: u2,
      },
      {
        title: 'Official SAT Study Guide 2026 Edition',
        author: 'The College Board',
        isbn: '9781457312199',
        genre: 'Exam Prep',
        condition: 'Brand New',
        price: 16,
        originalPrice: 32,
        description:
          'Official practice exams for the digital SAT with step-by-step guidance, math review sections, and reading comprehension breakdowns. Unused with online code intact.',
        coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Austin, TX',
        seller: u3,
      },
      {
        title: 'FE Civil Review Manual with Practice Problems',
        author: 'Michael R. Lindeburg PE',
        isbn: '9781591264392',
        genre: 'Exam Prep',
        condition: 'Like New',
        price: 42,
        originalPrice: 88,
        description:
          'Complete fundamentals of engineering exam review. Includes equations, reference handbook index, and practice problem solutions. Heavy hardcover with tight binding.',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        status: 'available',
        city: 'Boston, MA',
        seller: u4,
      },
    ];

    await Book.insertMany(sampleBooks);
    console.log(`Successfully seeded ${sampleBooks.length} realistic book listings.`);

    console.log('\n--- Seed Verification ---');
    console.log('Demo Seller: seller@bookmarket.com / password123');
    console.log('Demo Buyer:  buyer@bookmarket.com / password123');
    console.log('David Chen:  david@bookmarket.com / password123');
    console.log('Sarah Jenkins: sarah@bookmarket.com / password123');
    console.log('-------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
