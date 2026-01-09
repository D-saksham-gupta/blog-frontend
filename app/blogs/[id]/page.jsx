"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./blogPage.css";
import Image from "next/image";
import Link from "next/link";
import { blogService } from "../../../services/blogService";
import { commentService } from "../../../services/commentService";
import { useAuth } from "../../../context/AuthContext";

const page = () => {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Blog State
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Like State
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likePending, setLikePending] = useState(false);

  // Comments State
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Related Blogs State
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Fetch blog data
  useEffect(() => {
    if (params.id) {
      fetchBlogData();
    }
  }, [params.id]);

  // Fetch comments when blog is loaded
  useEffect(() => {
    if (blog) {
      fetchComments();
      fetchRelatedBlogs();
    }
  }, [blog]);

  const fetchBlogData = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await blogService.getBlogBySlug(params.id);
      setBlog(data.blog);
      setLikeCount(data.blog.likesCount);

      // Check if current user has liked this blog
      if (isAuthenticated() && data.blog.likes) {
        setIsLiked(data.blog.likes.includes(user._id));
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to load blog. It may not exist or has been removed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const data = await commentService.getComments(blog._id, {
        page: 1,
        limit: 50,
        sort: "-createdAt",
      });
      setComments(data.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const data = await blogService.getRelatedBlogs(blog._id, 3);
      setRelatedBlogs(data.blogs);
    } catch (err) {
      console.error("Error fetching related blogs:", err);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (likePending) return;

    setLikePending(true);
    const previousState = isLiked;
    const previousCount = likeCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      await blogService.toggleLike(blog._id);
    } catch (err) {
      console.error("Error toggling like:", err);
      // Revert on error
      setIsLiked(previousState);
      setLikeCount(previousCount);
    } finally {
      setLikePending(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (!newComment.trim()) return;

    setCommentSubmitting(true);

    try {
      const data = await commentService.createComment(blog._id, {
        content: newComment,
      });

      // Add new comment to the list
      setComments([data.comment, ...comments]);
      setNewComment("");
      setShowCommentForm(false);

      // Update blog comment count
      setBlog({ ...blog, commentsCount: blog.commentsCount + 1 });
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleCommentLike = async (commentId, currentLikes) => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    try {
      await commentService.toggleCommentLike(commentId);

      // Update comment in the list
      setComments(
        comments.map((comment) => {
          if (comment._id === commentId) {
            const isLiked = comment.likes?.includes(user._id);
            return {
              ...comment,
              likes: isLiked
                ? comment.likes.filter((id) => id !== user._id)
                : [...(comment.likes || []), user._id],
              likesCount: isLiked
                ? comment.likesCount - 1
                : comment.likesCount + 1,
            };
          }
          return comment;
        })
      );
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await commentService.deleteComment(commentId);

      // Remove comment from list
      setComments(comments.filter((comment) => comment._id !== commentId));

      // Update blog comment count
      setBlog({ ...blog, commentsCount: blog.commentsCount - 1 });
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-black px-4">
        <div className="max-w-md w-full rounded-2xl border border-rose-200/30 bg-black/80 p-8 text-center shadow-xl backdrop-blur">
          {/* Emoji */}
          <div className="mb-4 text-5xl">🔒✨</div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-rose-200">Login Required</h2>

          {/* Subtitle */}
          <p className="mt-3 text-sm text-rose-200/80">
            Please login first to read this amazing blog 📝💖
          </p>

          {/* Divider */}
          <div className="my-6 h-px w-full bg-rose-200/20"></div>

          {/* Login Button */}
          <Link
            href={"/login"}
            className="group inline-flex items-center justify-center gap-2 rounded-xl
                 bg-rose-200 px-6 py-3 font-semibold text-black
                 transition-all duration-300 hover:bg-rose-300 hover:scale-105
                 focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            🚀 Login Now
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-300 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Blog not found"}
          </h2>
          <Link
            href="/home"
            className="bg-rose-300 text-white px-6 py-3 rounded-lg hover:bg-rose-400 transition-colors"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <article className="blog-article">
        <div className="blog-header">
          <div className="blog-category">{blog.category}</div>
          <h1 className="blog-title">{blog.title}</h1>
          <div className="blog-meta">
            <div className="author-info">
              <img
                width={50}
                height={50}
                src={
                  blog.author?.profileImage ||
                  "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
                }
                alt={blog.author?.fullName || "Author"}
                className="author-avatar"
              />
              <div>
                <p className="author-name">
                  {blog.author?.fullName || blog.author?.username}
                </p>
                <p className="blog-date">
                  {new Date(
                    blog.publishedAt || blog.createdAt
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            {blog.status === "published" && (
              <div className="blog-stats">
                <span className="stat">
                  👁 {blog.views?.toLocaleString()} views
                </span>

                <span className="stat">♥ {likeCount} likes</span>
                <span className="stat">💬 {blog.commentsCount} comments</span>
                <span className="stat">📖 {blog.readTime} min read</span>
              </div>
            )}
          </div>
        </div>

        {blog.coverImage && (
          <img
            width={1200}
            height={600}
            src={blog.coverImage}
            alt={blog.title}
            className="blog-hero-image"
          />
        )}

        <div className="blog-content">
          {/* Blog Content - Render HTML or formatted text */}
          <div
            dangerouslySetInnerHTML={{ __html: blog.content }}
            className="prose prose-lg max-w-none"
          />

          <div className="blog-actions">
            {blog.status === "published" && (
              <button
                className={`like-button ${isLiked ? "liked" : ""}`}
                onClick={handleLike}
                disabled={likePending}
              >
                <span className="heart-icon">♥</span>
                <span>{likeCount}</span>
              </button>
            )}
            {blog.status === "published" && (
              <button
                className="comment-button"
                onClick={() => setShowCommentForm(!showCommentForm)}
              >
                <span>💬 Comment</span>
              </button>
            )}
            {blog.status === "published" && (
              <button className="share-button" onClick={handleShare}>
                <span>🔗 Share</span>
              </button>
            )}
          </div>
        </div>
      </article>

      <aside className="blog-sidebar">
        <div className="author-card">
          <img
            width={80}
            height={80}
            src={
              blog.author?.profileImage ||
              "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
            }
            alt={blog.author?.fullName || "Author"}
            className="author-card-image m-auto"
          />
          <h3 className="author-card-name">
            {blog.author?.fullName || blog.author?.username}
          </h3>
          <p className="author-card-bio">
            {blog.author?.bio || "Passionate writer and storyteller"}
          </p>
          {/* You can add follow functionality later */}
          {/* <button className="follow-button">Follow</button> */}
        </div>

        {relatedBlogs.length > 0 && blog.status === "published" && (
          <div className="related-posts">
            <h3 className="related-posts-title">Related Articles</h3>
            <ul className="related-posts-list">
              {relatedBlogs.map((relatedBlog) => (
                <li key={relatedBlog._id}>
                  <Link href={`/blogs/${relatedBlog.slug}`}>
                    {relatedBlog.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {blog.status === "published" && (
        <section className="comments-section">
          <div className="comments-container">
            <h2 className="comments-title">Comments ({blog.commentsCount})</h2>

            {showCommentForm && (
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <div className="comment-form-header">
                  <img
                    src={
                      user?.profileImage ||
                      "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
                    }
                    alt="You"
                    className="comment-avatar"
                  />
                  <div className="comment-form-inputs">
                    <textarea
                      className="comment-textarea"
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows="3"
                      disabled={commentSubmitting}
                    />
                    <div className="comment-form-actions">
                      <button
                        type="submit"
                        className="comment-submit-btn"
                        disabled={commentSubmitting || !newComment.trim()}
                      >
                        {commentSubmitting ? "Posting..." : "Post Comment"}
                      </button>
                      <button
                        type="button"
                        className="comment-cancel-btn"
                        onClick={() => {
                          setShowCommentForm(false);
                          setNewComment("");
                        }}
                        disabled={commentSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {!showCommentForm && (
              <button
                className="add-comment-btn"
                onClick={() => {
                  if (!isAuthenticated()) {
                    router.push("/login");
                    return;
                  }
                  setShowCommentForm(true);
                }}
              >
                Add a comment...
              </button>
            )}

            {commentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-300 mx-auto"></div>
              </div>
            ) : (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <img
                      src={
                        comment.user?.profileImage ||
                        "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
                      }
                      alt={comment.user?.fullName || "User"}
                      className="comment-avatar"
                    />
                    <div className="comment-content">
                      <div className="comment-header">
                        <h4 className="comment-author">
                          {comment.user?.fullName || comment.user?.username}
                          {comment.isEdited && (
                            <span className="text-xs text-gray-500 ml-2">
                              (edited)
                            </span>
                          )}
                        </h4>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <p className="comment-text">{comment.content}</p>
                      <div className="comment-actions">
                        <button
                          className={`comment-like-btn ${
                            comment.likes?.includes(user?._id) ? "liked" : ""
                          }`}
                          onClick={() =>
                            handleCommentLike(comment._id, comment.likesCount)
                          }
                        >
                          ♥ {comment.likesCount || 0}
                        </button>
                        {/* Reply functionality can be added later */}
                        {/* <button className="comment-reply-btn">Reply</button> */}

                        {/* Delete button if user owns the comment */}
                        {user?._id === comment.user?._id && (
                          <button
                            className="comment-delete-btn text-red-500 hover:text-red-700 ml-2"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default page;
