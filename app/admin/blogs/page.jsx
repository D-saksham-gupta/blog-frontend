"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { adminService } from "../../../services/adminService";

export default function AdminAllBlogs() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/");
      return;
    }

    fetchBlogs();
  }, [statusFilter, currentPage, isAuthenticated, isAdmin, router]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllBlogsAdmin({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
        page: currentPage,
        limit: 10,
      });
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
      setTotalBlogs(data.total);
    } catch (err) {
      console.error("Fetch blogs error:", err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const handleDelete = async (blogId) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this blog? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await adminService.deleteBlogPermanently(blogId);
      alert("Blog deleted successfully");
      fetchBlogs();
    } catch (err) {
      console.error("Delete blog error:", err);
      alert("Failed to delete blog");
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      published: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Published",
      },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    };
    const statusConfig = config[status] || config.pending;
    return (
      <span
        className={`${statusConfig.bg} ${statusConfig.text} px-3 py-1 rounded-full text-xs font-bold uppercase`}
      >
        {statusConfig.label}
      </span>
    );
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
              <h1 className="text-3xl font-black text-black">All Blogs</h1>
              <p className="text-gray-600 mt-1">Manage all blog posts</p>
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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-300 text-white px-4 py-1 rounded-lg hover:bg-rose-400"
                >
                  🔍
                </button>
              </div>
            </form>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Results Info */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {blogs.length} of {totalBlogs} blogs
          </div>
        </div>

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
            <p className="text-gray-600">No blogs found</p>
          </div>
        ) : (
          <>
            {/* Blogs Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blog
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blogs.map((blog) => (
                      <tr key={blog._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={
                                blog.coverImage ||
                                "https://via.placeholder.com/60"
                              }
                              alt={blog.title}
                              className="w-16 h-16 rounded object-cover mr-4"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/60?text=No+Image";
                              }}
                            />
                            <div>
                              <p className="font-semibold text-black line-clamp-1">
                                {blog.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {blog.category} •{" "}
                                {new Date(blog.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-black">
                            {blog.author?.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            @{blog.author?.username}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(blog.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>👁 {blog.views}</div>
                          <div>♥ {blog.likesCount}</div>
                          <div>💬 {blog.commentsCount}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/blogs/${blog.slug}`}
                              target="_blank"
                              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDelete(blog._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
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
    </div>
  );
}
