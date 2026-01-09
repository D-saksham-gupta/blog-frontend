import api from "../lib/api";

export const commentService = {
  // Get comments for a blog
  getComments: async (blogId, params = {}) => {
    const response = await api.get(`/comments/${blogId}`, { params });
    return response.data;
  },

  // Create comment
  createComment: async (blogId, commentData) => {
    const response = await api.post(`/comments/${blogId}`, commentData);
    return response.data;
  },

  // Update comment
  updateComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Toggle comment like
  toggleCommentLike: async (commentId) => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data;
  },
};
