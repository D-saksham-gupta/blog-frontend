"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { blogService } from "../../services/blogService";
import RichTextEditor from "../../components/RichTextEditor";
import ImageUpload from "../../components/ImageUpload";

export default function CreateBlog() {
  const router = useRouter();
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
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

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

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Update character and word count (strip HTML tags for accurate count)
  useEffect(() => {
    const stripHtml = (html) => {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    const plainText = stripHtml(formData.content);
    setCharCount(plainText.length);
    setWordCount(plainText.trim().split(/\s+/).filter(Boolean).length);
  }, [formData.content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

    if (charCount < 50) {
      setError("Content must be at least 50 characters long");
      setLoading(false);
      return;
    }

    try {
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

      const response = await blogService.createBlog(blogData);

      if (response.success) {
        alert(
          "Blog submitted successfully! It will be published after admin approval."
        );
        router.push("/home");
      }
    } catch (err) {
      console.error("Create blog error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Failed to create blog. Please try again."
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

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-white to-red-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2">
            Write a New Blog
          </h1>
          <p className="text-gray-600">
            Share your thoughts and ideas with the community
          </p>
        </div>

        {/* Notice */}
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your blog will be sent for admin approval
            before being published.
          </p>
        </div>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent text-lg"
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

          {/* Cover Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="flex items-center gap-4">
              <ImageUpload
                onUploadSuccess={handleCoverImageUpload}
                buttonText="Upload Cover Image"
              />
              <span className="text-sm text-gray-500">or</span>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="Paste image URL"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            {formData.coverImage && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Preview:
                </p>
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full max-w-2xl h-64 object-cover rounded-lg"
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
              placeholder="A brief summary of your blog (will be auto-generated if left empty)..."
              rows="3"
              maxLength="300"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.excerpt.length}/300 characters
            </p>
          </div>

          {/* Rich Text Content Editor */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your blog content here... Use the toolbar to format your text, add images, links, and more!"
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
              placeholder="programming, web development, react (separated by commas)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate tags with commas. Example: technology, coding, javascript
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
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
              className="px-6 py-3 bg-rose-300 text-white rounded-lg font-semibold hover:bg-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <span>📝</span>
                  Publish Blog
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-black mb-4">✨ Editor Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                Use the toolbar to format text - bold, italic, headings, lists,
                etc.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                Click the image icon in the toolbar to insert images directly
                into your content
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>Add links to external resources using the link button</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                Use headings to structure your content and make it more readable
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>Code blocks are available for technical content</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
