const User = require('../models/User');
const Book = require('../models/Book');

const getSellerProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name city createdAt');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found',
      });
    }

    const books = await Book.find({ seller: user._id, status: 'available' }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: {
        seller: user,
        activeListings: books,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSellerProfile,
};
