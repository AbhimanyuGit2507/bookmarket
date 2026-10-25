const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBookStatus,
  deleteBook,
  getMyListings,
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

router.get('/', getBooks);
router.get('/my/listings', protect, getMyListings);
router.get('/:id', getBookById);
router.post('/', protect, createBook);
router.patch('/:id/status', protect, updateBookStatus);
router.delete('/:id', protect, deleteBook);

module.exports = router;
