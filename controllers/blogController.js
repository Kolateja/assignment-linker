const Blog = require('../models/blog');
const { successResponse, errorResponse } = require('../middleware/response');

// Create Blog
exports.createBlog = async (req, res) => {
    try {
        const { title, subtitle, tags, content } = req.body;
        const image = req.file ? req.file.path : null;

        const blog = await Blog.create({
            title,
            subtitle,
            tags,
            content,
            image
        });
        return successResponse(res, 'blog created', blog);
    } catch (err) {
        return errorResponse(res, 'Creation failed', err.message);
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const blogsWithImageUrl = blogs.map(blog => {
            return {
                ...blog.dataValues,
                fileUrl: blog.image ? `${baseUrl}/${blog.image.replace(/\\/g, '/')}` : null
            };
        });

        return successResponse(res, 'blogs fetched', blogsWithImageUrl);
    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
};


// Get Blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const resumeWithUrl = {
            ...blog.dataValues,
            fileUrl: blog.image ? `${baseUrl}/${blog.image.replace(/\\/g, '/')}` : null
        };

        return successResponse(res, 'blog fetched', resumeWithUrl);
    } catch (err) {
        return errorResponse(res, 'blog failed', err.message);
    }
};

// Update Blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const { title, subtitle, tags, content } = req.body;
        const image = req.file ? req.file.path : blog.image;

        await blog.update({
            title,
            subtitle,
            tags,
            content,
            image
        });

        res.status(200).json(blog);
    } catch (err) {
        return errorResponse(res, 'failed', err.message);
    }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        await blog.destroy();
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        return errorResponse(res, 'failed', err.message);
    }
};
