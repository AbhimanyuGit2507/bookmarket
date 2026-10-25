const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [180, 'Title cannot exceed 180 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    isbn: {
      type: String,
      trim: true,
      default: '',
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: {
        values: [
          'Engineering & CS',
          'Fiction & Sci-Fi',
          'Non-Fiction',
          'Comics & Manga',
          'Exam Prep',
        ],
        message: '{VALUE} is not a supported genre',
      },
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: ['Brand New', 'Like New', 'Gently Used', 'Heavily Read'],
        message: '{VALUE} is not a valid condition',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold'],
      default: 'available',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inquiries: [
      {
        buyer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        buyerName: {
          type: String,
          required: true,
          trim: true,
        },
        buyerEmail: {
          type: String,
          required: true,
          trim: true,
        },
        buyerPhone: {
          type: String,
          required: true,
          trim: true,
        },
        buyerCity: {
          type: String,
          default: '',
        },
        message: {
          type: String,
          default: '',
          maxlength: [1000, 'Message cannot exceed 1000 characters'],
        },
        preferredMeetup: {
          type: String,
          default: '',
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'completed', 'declined'],
          default: 'pending',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ status: 1, genre: 1, price: 1 });

module.exports = mongoose.model('Book', bookSchema);
