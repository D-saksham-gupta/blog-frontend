import Link from "next/link";
import { useRouter } from "next/navigation";

const BlogItem = ({
  title,
  description,
  category,
  image,
  author,
  authorImg,
  id,
  likes,
  comments,
  views,
  date,
  status,
  showStatus,
  blogId,
  rejectionReason,
  isDeleted,
}) => {
  const router = useRouter();

  const getStatusBadge = () => {
    if (!showStatus) return null;

    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending Approval",
      },
      published: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Published",
      },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div
        className={`absolute top-4 left-4 ${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}
      >
        {config.label}
      </div>
    );
  };

  const handleEdit = () => {
    router.push(`/blogs/edit/${id}`);
  };

  return (
    <article className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 hover:-translate-y-2 flex flex-col">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-contain hover:scale-105 transition-transform duration-300 ${
            rejectionReason && "opacity-25"
          }`}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
        {rejectionReason && (
          <span className="flex justify-center items-center">
            Blog Rejected
          </span>
        )}
        {getStatusBadge()}

        <span className="absolute top-4 right-4 bg-rose-300 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col grow">
        <h2 className="text-xl font-bold text-black mb-3 line-clamp-2 leading-tight hover:text-rose-300 transition-colors">
          {rejectionReason ? (
            <div className="font-thin text-center">
              Blog Rejected with Reason: <br />{" "}
              <span className="text-red-700 text-3xl font-bold">
                {rejectionReason}
              </span>
            </div>
          ) : (
            <span>{title}</span>
          )}
        </h2>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed grow">
          {rejectionReason ? (
            ""
          ) : (
            <span dangerouslySetInnerHTML={{ __html: description }} />
          )}
        </p>

        {/* Author Info & Action Buttons */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={
                authorImg ||
                "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
              }
              alt={author}
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/40?text=?";
              }}
            />
            <div>
              <p className="font-semibold text-sm text-black">{author}</p>
              <p className="text-xs text-gray-500">{date}</p>
            </div>
          </div>

          {/* Show Edit button for My Blogs, otherwise Read More */}
          {showStatus ? (
            !rejectionReason &&
            !isDeleted && (
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all duration-300"
              >
                Edit
              </button>
            )
          ) : (
            <Link
              href={`/blogs/${id}`}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-300 hover:text-black transition-all duration-300 hover:translate-x-1"
            >
              Read More
            </Link>
          )}
        </div>
        {/* Stats */}
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-gray-600 flex items-center gap-1">
            <span>👁</span> {views?.toLocaleString() || 0}
          </span>
          <span className="text-gray-600 flex items-center gap-1">
            <span>♥</span> {likes?.toLocaleString() || 0}
          </span>
          <span className="text-gray-600 flex items-center gap-1">
            <span>💬</span> {comments?.toLocaleString() || 0}
          </span>
        </div>
      </div>
    </article>
  );
};
export default BlogItem;
