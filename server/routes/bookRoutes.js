const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBookStatus,
  deleteBook,
  getMyListings,
  createBookInquiry,
  getMyInquiries,
  updateInquiryStatus,
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

router.get('/', getBooks);
router.get('/my/listings', protect, getMyListings);
router.get('/my/inquiries', protect, getMyInquiries);
router.get('/:id', getBookById);
router.post('/', protect, createBook);
router.post('/:id/inquire', protect, createBookInquiry);
router.patch('/:id/status', protect, updateBookStatus);
router.patch('/:bookId/inquiries/:inquiryId', protect, updateInquiryStatus);
router.delete('/:id', protect, deleteBook);

module.exports = router;
