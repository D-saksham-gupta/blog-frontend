"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { adminService } from "../../../services/adminService";
import Loading from "./loading";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user is admin
  if (!isAdmin()) {
    return (
      <div className="flex justify-center gap-5 items-center flex-col bg-black w-full h-[800px]">
        <h1 className="flex justify-center items-center text-2xl bg-black text-rose-400">
          This route is restricted to Admin Only
        </h1>
        <Link
          className="flex bg-rose-400 rounded-xl text-black p-4"
          href={"/home"}
        >
          Go back to Home
        </Link>
      </div>
    );
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    if (!isAdmin) {
      router.push("/login");
      return;
    }

    fetchStats();
  }, [isAuthenticated, isAdmin, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      console.log(data);
      setStats(data.stats);
      console.log(stats);
    } catch (err) {
      console.error("Fetch stats error:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated() || !isAdmin()) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-black">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your blogging platform
              </p>
            </div>
            <Link
              href="/home"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back to Home
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link
            href="/admin/blogs/pending"
            className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-yellow-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-semibold uppercase">
                  Pending
                </p>
                <p className="text-3xl font-black text-yellow-700 mt-2">
                  {stats?.blogs.pending || 0}
                </p>
                <p className="text-yellow-600 text-sm mt-1">Awaiting Review</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </Link>

          <Link
            href="/admin/blogs"
            className="bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-green-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold uppercase">
                  Published
                </p>
                <p className="text-3xl font-black text-green-700 mt-2">
                  {stats?.blogs.published || 0}
                </p>
                <p className="text-green-600 text-sm mt-1">Total Blogs</p>
              </div>
              <div className="text-4xl text-rose-900">✓</div>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold uppercase">
                  Users
                </p>
                <p className="text-3xl font-black text-blue-700 mt-2">
                  {stats?.users.total || 0}
                </p>
                <p className="text-blue-600 text-sm mt-1">Registered Users</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Link>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-semibold uppercase">
                  Comments
                </p>
                <p className="text-3xl font-black text-purple-700 mt-2">
                  {stats?.engagement.totalComments || 0}
                </p>
                <p className="text-purple-600 text-sm mt-1">Total Comments</p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* New This Week */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-black mb-4">
              📊 This Week's Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">New Users</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {/* +{stats?.recentActivity.newUsersThisWeek || 0} */}0
                  </p>
                </div>
                <div className="text-3xl">👤</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">New Blogs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {/* +{stats?.recentActivity.newBlogsThisWeek || 0} */}
                    +0
                  </p>
                </div>
                <div className="text-3xl">📝</div>
              </div>
            </div>
          </div>

          {/* Status Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-black mb-4">
              📈 Blog Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Approval</span>
                <span className="font-bold text-yellow-600">
                  {stats?.blogs.pending || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats?.blogs.total
                        ? (stats.blogs.pending / stats.blogs.total) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Published</span>
                <span className="font-bold text-green-600">
                  {stats?.blogs.published || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats?.blogs.total
                        ? (stats.blogs.published / stats.blogs.total) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rejected</span>
                <span className="font-bold text-red-600">
                  {stats?.blogs.rejected || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats?.blogs.total
                        ? (stats.blogs.rejected / stats.blogs.total) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Authors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-black mb-4">
              🏆 Top Authors
            </h3>
            {stats?.topAuthors && stats.topAuthors.length > 0 ? (
              <div className="space-y-3">
                {stats.topAuthors.map((author, index) => (
                  <div
                    key={author._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-400">
                        #{index + 1}
                      </span>
                      <img
                        src={
                          "https://www.computerhope.com/issues/pictures/image-photo-picture.png"
                        }
                        alt={author.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-black">
                          {author.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{author.username}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-rose-300">
                        {author.blogCount}
                      </p>
                      <p className="text-xs text-gray-500">blogs</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No data available
              </p>
            )}
          </div>

          {/* Popular Blogs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-black mb-4">
              🔥 Popular Blogs
            </h3>
            {stats?.popularBlogs && stats.popularBlogs.length > 0 ? (
              <div className="space-y-3">
                {stats.popularBlogs.map((blog, index) => (
                  <div
                    key={blog._id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Link href={`/blogs/${blog.slug}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-black line-clamp-1 hover:text-rose-300">
                            {blog.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            by {blog.author?.fullName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-rose-300">
                            {blog.views?.toLocaleString()} views
                          </p>
                          <p className="text-xs text-gray-500">
                            {blog.likesCount} ♥ {blog.commentsCount} 💬
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No data available
              </p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-black mb-4">
            ⚡ Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/blogs/pending"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-rose-300 hover:bg-rose-50 transition-all text-center"
            >
              <div className="text-3xl mb-2">📋</div>
              <p className="font-semibold text-sm">Review Blogs</p>
            </Link>
            <Link
              href="/admin/blogs"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-rose-300 hover:bg-rose-50 transition-all text-center"
            >
              <div className="text-3xl mb-2">📝</div>
              <p className="font-semibold text-sm">All Blogs</p>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-rose-300 hover:bg-rose-50 transition-all text-center"
            >
              <div className="text-3xl mb-2">👥</div>
              <p className="font-semibold text-sm">Manage Users</p>
            </Link>
            <button
              onClick={fetchStats}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-rose-300 hover:bg-rose-50 transition-all text-center"
            >
              <div className="text-3xl mb-2">🔄</div>
              <p className="font-semibold text-sm">Refresh</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
