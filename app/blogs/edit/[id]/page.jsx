"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import { blogService } from "../../../../services/blogService";
import RichTextEditor from "../../../../components/RichTextEditor";
//import ImageUpload from '@/components/ImageUpload';

export default function page() {
  const router = useRouter();
  const params = useParams();

  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImage: "",
    category: "Technology",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [originalBlog, setOriginalBlog] = useState(null);

  const categories = [
    "Technology",
    "Lifestyle",
    "Travel",
    "Food",
    "Health",
    "Business",
    "Entertainment",
    "Education",
    "Sports",
    "Other",
  ];

  // Fetch blog data
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (params.id) {
      fetchBlog();
    }
  }, [params.id, isAuthenticated]);

  const fetchBlog = async () => {
    try {
      setFetchLoading(true);
      // First, get user's blogs to find the one with this ID
      // const myBlogs = await blogService.getMyBlogs();
      const data = await blogService.getBlogBySlug(params.id);
      console.log(data);
      const blog = data.blog;

      console.log(blog);
      //console.log(blogId);

      if (!blog) {
        setError("Blog not found or you do not have permission to edit it.");
        // setTimeout(() => router.push("/home"), 2000);
        return;
      }

      setOriginalBlog(blog);
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt || "",
        coverImage: blog.coverImage || "",
        category: blog.category,
        tags: blog.tags?.join(", ") || "",
      });
    } catch (err) {
      console.error("Fetch blog error:", err);
      setError("Failed to load blog data");
    } finally {
      setFetchLoading(false);
    }
  };

  // Update character and word count
  useEffect(() => {
    setCharCount(formData.content.length);
    setWordCount(formData.content.trim().split(/\s+/).filter(Boolean).length);
  }, [formData.content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add this handler
  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value,
    });
  };

  const handleCoverImageUpload = (imageUrl) => {
    setFormData({
      ...formData,
      coverImage: imageUrl,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (formData.title.trim().length < 5) {
      setError("Title must be at least 5 characters long");
      setLoading(false);
      return;
    }

    if (formData.content.trim().length < 50) {
      setError("Content must be at least 50 characters long");
      setLoading(false);
      return;
    }

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const blogData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        coverImage: formData.coverImage.trim() || undefined,
        category: formData.category,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };
      console.log(originalBlog._id);
      const response = await blogService.updateBlog(originalBlog._id, blogData);

      if (response.success) {
        alert(response.message || "Blog updated successfully!");
        router.push("/home");
      }
    } catch (err) {
      console.error("Update blog error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update blog. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
      router.push("/home");
    }
  };

  const handleDelete = async () => {
    try {
      await blogService.deleteBlog(originalBlog._id);
      alert("Blog deleted successfully");
      router.push("/home");
    } catch (err) {
      setError("Failed to delete blog");
    }
  };

  if (!isAuthenticated()) {
    return null;
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-300 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-white to-red-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2">Edit Blog</h1>
          <p className="text-gray-600">Update your blog content</p>
        </div>

        {/* Status Notice */}
        {originalBlog && (
          <div
            className={`mb-6 border-l-4 p-4 rounded ${
              originalBlog.status === "pending"
                ? "bg-yellow-50 border-yellow-500"
                : originalBlog.status === "rejected"
                ? "bg-red-50 border-red-500"
                : "bg-green-50 border-green-500"
            }`}
          >
            <p className="text-sm font-semibold">
              Status: <span className="uppercase">{originalBlog.status}</span>
            </p>
            {originalBlog.status === "rejected" &&
              originalBlog.rejectionReason && (
                <p className="text-sm text-red-800 mt-2">
                  <strong>Rejection Reason:</strong>{" "}
                  {originalBlog.rejectionReason}
                </p>
              )}
            {originalBlog.status === "published" && (
              <p className="text-sm text-gray-700 mt-2">
                Note: Editing will send this blog back for approval.
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title for your blog..."
              required
              minLength="5"
              maxLength="200"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image URL */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
            />
            {/* Image Preview */}
            {formData.coverImage && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Preview:
                </p>
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Excerpt (Optional)
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="A brief summary of your blog..."
              rows="3"
              maxLength="300"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.excerpt.length}/300 characters
            </p>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your blog content here..."
            />
            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
              <span>
                {charCount} characters • {wordCount} words
              </span>
              <span
                className={
                  charCount < 50
                    ? "text-red-500 font-semibold"
                    : "text-green-600"
                }
              >
                {charCount < 50
                  ? `${50 - charCount} more characters needed`
                  : "Minimum reached ✓"}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="programming, web development, react"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Delete Blog
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || charCount < 50}
                className="px-6 py-3 bg-rose-300 text-white rounded-lg font-semibold hover:bg-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Blog"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
