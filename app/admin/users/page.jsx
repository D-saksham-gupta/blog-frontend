"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { adminService } from "../../../services/adminService";

export default function AdminUsers() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/");
      return;
    }

    fetchUsers();
  }, [roleFilter, statusFilter, currentPage, isAuthenticated, isAdmin, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers({
        search: searchQuery || undefined,
        role: roleFilter || undefined,
        isActive: statusFilter || undefined,
        page: currentPage,
        limit: 20,
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsers(data.total);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleToggleActive = async (userId) => {
    if (userId === user._id) {
      alert("You cannot deactivate your own account");
      return;
    }

    try {
      await adminService.toggleUserActive(userId);
      fetchUsers();
    } catch (err) {
      console.error("Toggle user active error:", err);
      alert("Failed to update user status");
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    if (userId === user._id) {
      alert("You cannot change your own role");
      return;
    }

    const newRole = currentRole === "admin" ? "user" : "admin";

    if (
      !confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      return;
    }

    try {
      await adminService.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      console.error("Change role error:", err);
      alert("Failed to change user role");
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
              <h1 className="text-3xl font-black text-black">
                User Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage platform users and permissions
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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name, email, username..."
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

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
            >
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>

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
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Results Info */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {users.length} of {totalUsers} users
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
        ) : users.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <>
            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((userData) => (
                <div
                  key={userData._id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  {/* User Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          userData.profileImage ||
                          "https://via.placeholder.com/60"
                        }
                        alt={userData.username}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/60?text=?";
                        }}
                      />
                      <div>
                        <h3 className="font-bold text-black">
                          {userData.fullName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          @{userData.username}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {userData.isActive ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📧</span>
                      <span className="truncate">{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>🎭</span>
                      <span className="capitalize font-semibold">
                        {userData.role === "admin" ? (
                          <span className="text-rose-600">Admin</span>
                        ) : (
                          "User"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📅</span>
                      <span>
                        Joined{" "}
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {userData.bio && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {userData.bio}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(userData._id)}
                      disabled={userData._id === user._id}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        userData.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {userData.isActive ? "🔒 Deactivate" : "✓ Activate"}
                    </button>
                    <button
                      onClick={() =>
                        handleChangeRole(userData._id, userData.role)
                      }
                      disabled={userData._id === user._id}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {userData.role === "admin"
                        ? "👤 Make User"
                        : "⭐ Make Admin"}
                    </button>
                  </div>

                  {/* Current User Note */}
                  {userData._id === user._id && (
                    <p className="mt-3 text-xs text-center text-gray-500 italic">
                      This is your account
                    </p>
                  )}
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
