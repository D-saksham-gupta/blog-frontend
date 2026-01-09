"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../context/AuthContext";
import { adminService } from "../../../../services/adminService";

export default function PendingBlogs() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/");
      return;
    }

    fetchPendingBlogs();
  }, [currentPage, isAuthenticated, isAdmin, router]);

  const fetchPendingBlogs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPendingBlogs({
        page: currentPage,
        limit: 10,
      });
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Fetch pending blogs error:", err);
      setError("Failed to load pending blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (blogId) => {
    if (!confirm("Are you sure you want to approve this blog?")) {
      return;
    }

    try {
      setProcessingId(blogId);
      await adminService.approveBlog(blogId);
      alert("Blog approved successfully!");
      fetchPendingBlogs();
    } catch (err) {
      console.error("Approve blog error:", err);
      alert("Failed to approve blog");
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (blog) => {
    setSelectedBlog(blog);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      setProcessingId(selectedBlog._id);
      await adminService.rejectBlog(selectedBlog._id, rejectionReason);
      alert("Blog rejected successfully");
      setShowRejectModal(false);
      setSelectedBlog(null);
      setRejectionReason("");
      fetchPendingBlogs();
    } catch (err) {
      console.error("Reject blog error:", err);
      alert("Failed to reject blog");
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAuthenticated() || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-black">Pending Blogs</h1>
              <p className="text-gray-600 mt-1">
                Review and approve blog submissions
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-300"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-black mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-600">
              There are no pending blogs to review at the moment.
            </p>
          </div>
        ) : (
          <>
            {/* Blogs List */}
            <div className="space-y-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-1/3">
                      <img
                        src={
                          blog.coverImage ||
                          "https://via.placeholder.com/400x300"
                        }
                        alt={blog.title}
                        className="w-full h-64 md:h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="md:w-2/3 p-6">
                      {/* Category Badge */}
                      <span className="inline-block bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-bold uppercase mb-3">
                        {blog.category}
                      </span>

                      {/* Title */}
                      <h2 className="text-2xl font-bold text-black mb-3">
                        {blog.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {blog.excerpt || blog.content.substring(0, 150)}...
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                        <img
                          src={
                            blog.author?.profileImage ||
                            "https://via.placeholder.com/40"
                          }
                          alt={blog.author?.username}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/40?text=?";
                          }}
                        />
                        <div>
                          <p className="font-semibold text-sm text-black">
                            {blog.author?.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            @{blog.author?.username} • {blog.author?.email}
                          </p>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        <span>
                          📅 {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <span>📖 {blog.readTime} min read</span>
                        <span>🏷️ {blog.tags?.length || 0} tags</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Link
                          href={`/blogs/${blog.slug}`}
                          target="_blank"
                          className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                        >
                          👁️ Preview
                        </Link>
                        <button
                          onClick={() => handleApprove(blog._id)}
                          disabled={processingId === blog._id}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {processingId === blog._id
                            ? "⏳ Processing..."
                            : "✓ Approve"}
                        </button>
                        <button
                          onClick={() => openRejectModal(blog)}
                          disabled={processingId === blog._id}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-black mb-4">Reject Blog</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this blog:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedBlog(null);
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={
                  !rejectionReason.trim() || processingId === selectedBlog?._id
                }
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50"
              >
                {processingId === selectedBlog?._id
                  ? "Processing..."
                  : "Reject Blog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
