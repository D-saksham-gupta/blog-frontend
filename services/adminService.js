import api from "../lib/api";

export const adminService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  // Get pending blogs
  getPendingBlogs: async (params = {}) => {
    const response = await api.get("/admin/blogs/pending", { params });
    return response.data;
  },

  // Get all blogs (admin)
  getAllBlogsAdmin: async (params = {}) => {
    const response = await api.get("/admin/blogs", { params });
    return response.data;
  },

  // Approve blog
  approveBlog: async (blogId) => {
    const response = await api.put(`/admin/blogs/${blogId}/approve`);
    return response.data;
  },

  // Reject blog
  rejectBlog: async (blogId, reason) => {
    const response = await api.put(`/admin/blogs/${blogId}/reject`, { reason });
    return response.data;
  },

  // Delete blog permanently
  deleteBlogPermanently: async (blogId) => {
    const response = await api.delete(`/admin/blogs/${blogId}`);
    return response.data;
  },

  // Get all users
  getAllUsers: async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Toggle user active status
  toggleUserActive: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle-active`);
    return response.data;
  },

  // Delete comment (admin)
  deleteComment: async (commentId) => {
    const response = await api.delete(`/admin/comments/${commentId}`);
    return response.data;
  },
};
