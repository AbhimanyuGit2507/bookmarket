const Book = require('../models/Book');

const getBooks = async (req, res, next) => {
  try {
    const {
      search,
      genre,
      condition,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 9,
      status,
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    if (search && search.trim() !== '') {
      const sanitized = search.trim();
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { author: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
        { isbn: { $regex: sanitized, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
    const skip = (pageNum - 1) * limitNum;

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('seller', 'name city phoneOrWhatsApp email')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        total,
        page: pageNum,
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      'seller',
      'name city phoneOrWhatsApp email'
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      isbn,
      genre,
      condition,
      price,
      originalPrice,
      description,
      coverImage,
      city,
    } = req.body;

    if (!title || !author || !genre || !condition || price === undefined || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, author, genre, condition, price, description)',
      });
    }

    const book = await Book.create({
      title,
      author,
      isbn: isbn || '',
      genre,
      condition,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : 0,
      description,
      coverImage:
        coverImage && coverImage.trim() !== ''
          ? coverImage.trim()
          : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      city: city || req.user.city,
      seller: req.user._id,
      status: 'available',
    });

    const populatedBook = await Book.findById(book._id).populate(
      'seller',
      'name city phoneOrWhatsApp email'
    );

    res.status(201).json({
      success: true,
      data: populatedBook,
    });
  } catch (error) {
    next(error);
  }
};

const updateBookStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['available', 'reserved', 'sold'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'available', 'reserved', or 'sold'",
      });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this listing',
      });
    }

    book.status = status;
    await book.save();

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing',
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book listing removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getMyListings = async (req, res, next) => {
  try {
    const books = await Book.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });

    const totalActive = books.filter((b) => b.status === 'available').length;
    const totalSold = books.filter((b) => b.status === 'sold').length;
    const estimatedRevenue = books
      .filter((b) => b.status === 'sold')
      .reduce((sum, b) => sum + (b.price || 0), 0);

    res.status(200).json({
      success: true,
      data: books,
      stats: {
        totalListings: books.length,
        totalActive,
        totalSold,
        estimatedRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBookStatus,
  deleteBook,
  getMyListings,
};
