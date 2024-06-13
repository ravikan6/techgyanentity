import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: false
    },
    storage: {
        type: String,
        required: true
    }
});

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    },
    privacy: {
        type: String,
        default: 'public'
    },
    meta: {
        slug: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        premium: {
            type: Boolean,
            default: false
        },
    },
    tags: {
        type: [String],
        default: []
    },
    image: {
        type: imageSchema,
        required: true
    }
});


const blogModel = mongoose?.model?.Blog || mongoose.model('Blog', blogSchema);

export { blogModel };