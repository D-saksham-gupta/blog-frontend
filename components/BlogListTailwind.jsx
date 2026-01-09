import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BlogItem from "../components/BlogItem";
import { blogService } from "../services/blogService";
import { useAuth } from "../context/AuthContext";

import Link from "next/link";

function BlogsListTailwind() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [activeFilter, setActiveFilter] = useState("all");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const categories = [
    "All",
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
    fetchBlogs();
  }, [activeFilter, selectedCategory, sortBy, currentPage, searchQuery]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError("");

    try {
      let data;

      if (activeFilter === "my-blogs") {
        if (!isAuthenticated()) {
          router.push("/login");
          return;
        }
        data = await blogService.getMyBlogs({
          page: currentPage,
          limit: 10,
          status: "all",
          isDeleted: false,
        });
      } else {
        const params = {
          page: currentPage,
          limit: 10,
          sort: sortBy,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          search: searchQuery || undefined,
        };
        data = await blogService.getAllBlogs(params);
      }

      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
      setTotalBlogs(data.total);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    setSidebarOpen(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWriteBlog = () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    router.push("/create");
  };

  const handleMyProfile = () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    router.push("/profile");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-white to-red-50">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-20 left-0 right-0 bg-transparent border-b border-gray-200 px-4 py-4 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? (
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-transparent bg-opacity-50 z-30 top-28"
          onClick={closeSidebar}
        ></div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside
            className={`fixed lg:static inset-0 top-28 left-0 w-64 lg:w-auto lg:col-span-1 transition-transform duration-300 z-40 ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="lg:sticky lg:top-28 bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-fit">
              {/* Navigation Links */}
              <nav className="space-y-2 mb-6">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeFilter === "all"
                      ? "bg-rose-300 text-white"
                      : "text-black hover:bg-gray-100 hover:text-rose-300"
                  }`}
                >
                  All Blogs
                </button>
                {isAuthenticated() && (
                  <button
                    onClick={() => handleFilterChange("my-blogs")}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeFilter === "my-blogs"
                        ? "bg-rose-300 text-white"
                        : "text-black hover:bg-gray-100 hover:text-rose-300"
                    }`}
                  >
                    My Blogs
                  </button>
                )}
                {isAuthenticated() && (
                  <button
                    onClick={handleMyProfile}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium text-black hover:text-rose-300 hover:bg-gray-100 transition-all duration-300"
                  >
                    My Profile
                  </button>
                )}
              </nav>

              {/* Write Blog Button */}
              <button
                onClick={handleWriteBlog}
                className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-rose-300 hover:text-black transition-all duration-300 mb-6"
              >
                ✎ Write Blog
              </button>

              {/* Divider */}
              <div className="h-px bg-gray-200 mb-6"></div>

              {/* Categories Filter */}
              {activeFilter === "all" && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                    Categories
                  </h4>
                  <div className="space-y-2 max-h-60 lg:max-h-none overflow-y-auto lg:overflow-visible">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          handleCategoryChange(category);
                          closeSidebar();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                          selectedCategory === category
                            ? "bg-rose-100 text-rose-600 font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-gray-200 mb-6"></div>

              {/* Options Section */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  Options
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#settings"
                      className="text-gray-600 text-sm hover:text-rose-300 transition-colors"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#notifications"
                      className="text-gray-600 text-sm hover:text-rose-300 transition-colors"
                    >
                      Notifications
                    </a>
                  </li>
                  <li>
                    <a
                      href="#bookmarks"
                      className="text-gray-600 text-sm hover:text-rose-300 transition-colors"
                    >
                      Bookmarks
                    </a>
                  </li>
                  <li>
                    <a
                      href="#help"
                      className="text-gray-600 text-sm hover:text-rose-300 transition-colors"
                    >
                      Help & Support
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      className="text-gray-600 text-sm hover:text-rose-300 transition-colors"
                    >
                      About Blogger
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl font-black text-black mb-3 tracking-tight">
                {activeFilter === "my-blogs" ? "My Blogs" : "Discover Stories"}
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                {activeFilter === "my-blogs"
                  ? "Manage and edit your published articles"
                  : "Explore insightful articles from writers around the world"}
              </p>
            </div>

            {/* Search and Sort Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-300 text-white px-4 py-2 rounded-lg hover:bg-rose-400 transition-colors"
                  >
                    🔍
                  </button>
                </div>
              </form>

              {/* Sort Dropdown */}
              {activeFilter === "all" && (
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="views">Most Viewed</option>
                  <option value="likes">Most Liked</option>
                  <option value="comments">Most Commented</option>
                </select>
              )}
            </div>

            {/* Results Info */}
            <div className="mb-6 text-sm text-gray-600">
              Showing {blogs.length} of {totalBlogs} blogs
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
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
            ) : (
              <>
                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {blogs.map((blog) => (
                    <BlogItem
                      key={blog._id}
                      id={blog.slug}
                      image={
                        blog.coverImage || "https://via.placeholder.com/400x300"
                      }
                      title={blog.title}
                      description={blog.excerpt || blog.content}
                      blogId={blog._id}
                      category={blog.category}
                      author={blog.author?.fullName || blog.author?.username}
                      authorImg={
                        blog.author?.profileImage ||
                        "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
                      }
                      likes={blog.likesCount}
                      comments={blog.commentsCount}
                      views={blog.views}
                      date={new Date(
                        blog.publishedAt || blog.createdAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      status={blog.status}
                      rejectionReason={blog.rejectionReason || null}
                      showStatus={activeFilter === "my-blogs"}
                    />
                  ))}
                </div>

                {/* Empty State */}
                {blogs.length === 0 && !loading && (
                  <div className="text-center py-16">
                    <p className="text-xl text-gray-600 mb-4">
                      {activeFilter === "my-blogs"
                        ? "You haven't written any blogs yet."
                        : "No blogs found."}
                    </p>
                    {activeFilter === "my-blogs" && (
                      <button
                        onClick={handleWriteBlog}
                        className="bg-rose-300 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-400 transition-colors"
                      >
                        Write Your First Blog
                      </button>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-2 flex-wrap justify-center">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          return (
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                          );
                        })
                        .map((page, index, array) => {
                          const showEllipsis =
                            index > 0 && page - array[index - 1] > 1;

                          return (
                            <div key={page} className="flex items-center gap-2">
                              {showEllipsis && (
                                <span className="px-2 text-gray-500">...</span>
                              )}
                              <button
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                  currentPage === page
                                    ? "bg-rose-300 text-white font-semibold"
                                    : "border border-gray-300 hover:bg-gray-100"
                                }`}
                              >
                                {page}
                              </button>
                            </div>
                          );
                        })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default BlogsListTailwind;
