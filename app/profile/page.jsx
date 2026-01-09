"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { blogService } from "../../services/blogService";
import ImageUpload from "../../components/ImageUpload";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile form data
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    bio: "",
    profileImage: "",
  });

  // Password change form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Stats
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    pendingBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (user) {
      setFormData({
        username: user.username || "",
        fullName: user.fullName || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
      });
      fetchUserBlogs();
    }
  }, [user, isAuthenticated, router]);

  const fetchUserBlogs = async () => {
    try {
      setBlogsLoading(true);
      const data = await blogService.getMyBlogs({ limit: 100 });
      setUserBlogs(data.blogs);

      // Calculate stats
      const published = data.blogs.filter((b) => b.status === "published");
      const pending = data.blogs.filter((b) => b.status === "pending");
      const totalViews = published.reduce((sum, blog) => sum + blog.views, 0);
      const totalLikes = published.reduce(
        (sum, blog) => sum + blog.likesCount,
        0
      );

      setStats({
        totalBlogs: data.blogs.length,
        publishedBlogs: published.length,
        pendingBlogs: pending.length,
        totalViews,
        totalLikes,
      });
    } catch (err) {
      console.error("Fetch blogs error:", err);
    } finally {
      setBlogsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleProfileImageUpload = (imageUrl) => {
    setFormData({
      ...formData,
      profileImage: imageUrl,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await authService.updateProfile(formData);
      if (response.success) {
        updateUser(response.user);
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password changed successfully!");
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Change password error:", err);
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      username: user.username || "",
      fullName: user.fullName || "",
      bio: user.bio || "",
      profileImage: user.profileImage || "",
    });
    setError("");
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-white to-red-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your account and view your activity
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={
                      formData.profileImage ||
                      "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
                    }
                    alt={formData.fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-rose-200"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150?text=" +
                        formData.fullName.charAt(0);
                    }}
                  />
                  {isEditing && (
                    <div className="mt-3">
                      <ImageUpload
                        onUploadSuccess={handleProfileImageUpload}
                        buttonText="Change Photo"
                      />
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  <>
                    <h2 className="text-2xl font-bold text-black mt-4">
                      {user?.fullName}
                    </h2>
                    <p className="text-gray-500">@{user?.username}</p>
                    <p className="text-sm text-gray-600 mt-2">{user?.email}</p>
                    {user?.bio && (
                      <p className="text-sm text-gray-700 mt-4 italic">
                        {user.bio}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Member since{" "}
                        {new Date(user?.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                          user?.role === "admin"
                            ? "bg-rose-100 text-rose-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {user?.role === "admin" ? "⭐ Admin" : "👤 User"}
                      </span>
                    </div>
                  </>
                ) : (
                  <form
                    onSubmit={handleSaveProfile}
                    className="mt-4 space-y-4 text-left"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        maxLength="500"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.bio.length}/500
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-rose-300 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-400 disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-black mb-4">🔒 Security</h3>

              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-rose-300 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-400 disabled:opacity-50 text-sm"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setError("");
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column - Stats and Blogs */}
          <div className="lg:col-span-2">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-600 text-sm">Total Blogs</p>
                <p className="text-3xl font-black text-rose-300 mt-1">
                  {stats.totalBlogs}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-600 text-sm">Published</p>
                <p className="text-3xl font-black text-green-500 mt-1">
                  {stats.publishedBlogs}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-600 text-sm">Total Views</p>
                <p className="text-3xl font-black text-blue-500 mt-1">
                  {stats.totalViews}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-gray-600 text-sm">Total Likes</p>
                <p className="text-3xl font-black text-red-500 mt-1">
                  {stats.totalLikes}
                </p>
              </div>
            </div>

            {/* My Blogs Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-black">My Blogs</h3>
                <Link
                  href="/create"
                  className="bg-rose-300 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-400 transition-colors text-sm"
                >
                  ✎ Write New Blog
                </Link>
              </div>

              {blogsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-300"></div>
                </div>
              ) : userBlogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 mb-4">
                    You haven't written any blogs yet.
                  </p>
                  <Link
                    href="/create"
                    className="inline-block bg-rose-300 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-400 transition-colors"
                  >
                    Write Your First Blog
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-rose-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-black line-clamp-1">
                              {blog.title}
                            </h4>
                            {blog.status === "pending" && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                                Pending
                              </span>
                            )}
                            {blog.status === "published" && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                                Published
                              </span>
                            )}
                            {blog.status === "rejected" && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                                Rejected
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              📅 {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                            <span>👁 {blog.views}</span>
                            <span>♥ {blog.likesCount}</span>
                            <span>💬 {blog.commentsCount}</span>
                          </div>
                          {blog.status === "rejected" &&
                            blog.rejectionReason && (
                              <p className="text-sm bg-stone-900 p-4 text-red-600 mt-2">
                                <strong>Reason:</strong> {blog.rejectionReason}
                              </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {blog.status === "published" && (
                            <div className="flex flex-col gap-2 ml-4">
                              {blog.isDeleted ? (
                                <div className="text-red-600">Blog Deleted</div>
                              ) : (
                                <Link
                                  href={`/blogs/${blog.slug}`}
                                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 text-center"
                                >
                                  View
                                </Link>
                              )}
                              <Link
                                href={`/blogs/edit/${blog.slug}`}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 text-center"
                              >
                                Edit
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
