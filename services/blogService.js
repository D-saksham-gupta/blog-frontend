import api from "../lib/api";

export const blogService = {
  // Get all blogs with filters
  getAllBlogs: async (params = {}) => {
    const response = await api.get("/blogs", { params });
    return response.data;
  },

  // Get single blog by slug
  getBlogBySlug: async (slug) => {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
  },

  // Get trending blogs
  getTrendingBlogs: async (limit = 5) => {
    const response = await api.get("/blogs/trending", { params: { limit } });
    return response.data;
  },

  // Get related blogs
  getRelatedBlogs: async (blogId, limit = 4) => {
    const response = await api.get(`/blogs/${blogId}/related`, {
      params: { limit },
    });
    return response.data;
  },

  // Get my blogs
  getMyBlogs: async (params = {}) => {
    const response = await api.get("/blogs/user/my-blogs", { params });
    return response.data;
  },

  // Create blog
  createBlog: async (blogData) => {
    const response = await api.post("/blogs", blogData);
    return response.data;
  },

  // Update blog
  updateBlog: async (blogId, blogData) => {
    const response = await api.put(`/blogs/${blogId}`, blogData);
    return response.data;
  },

  // Delete blog
  deleteBlog: async (blogId) => {
    const response = await api.delete(`/blogs/${blogId}`);
    return response.data;
  },

  // Toggle like
  toggleLike: async (blogId) => {
    const response = await api.post(`/blogs/${blogId}/like`);
    return response.data;
  },

  // Get blog stats
  getBlogStats: async (blogId) => {
    const response = await api.get(`/blogs/${blogId}/stats`);
    return response.data;
  },
};
