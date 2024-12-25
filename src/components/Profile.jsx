import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../contexts/AdminContext.jsx";
import { Mail, Phone, MapPin, Cake, User, ShieldCheck, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Card = ({ className, children }) => (
  <div className={`bg-[#493939] shadow-lg rounded-xl transition-transform duration-300 hover:scale-[1.02] ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 border-b border-[#FF9321]/30">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-6 space-y-4">{children}</div>
);

const ProfileCard = ({ title, children }) => (
  <Card className="w-full max-w-3xl mx-auto my-6">
    <CardHeader>
      <h3 className="text-2xl font-bold text-[#FF9321] text-center">
        {title}
      </h3>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const ProfileItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-4 p-3 rounded-lg transition-colors duration-200 hover:bg-white/5">
    <div className="mt-1">
      <Icon className="w-6 h-6 text-[#FF9321]" />
    </div>
    <div className="flex-1">
      <p className="font-medium text-[#FF9321] text-sm uppercase tracking-wide mb-1">{label}</p>
      <p className="text-gray-300 text-lg">{value || "N/A"}</p>
    </div>
  </div>
);

const Profile = () => {
  const { admin, token, logout } = useContext(AdminContext);
  const [profile, setProfile] = useState(admin);
  const [loading, setLoading] = useState(!admin);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    // Add other fields as necessary
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!admin && token) {
        try {
          const response = await axios.get("/api/admin/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProfile(response.data);
          setFormData({
            name: response.data.name || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            address: response.data.address || "",
            // Initialize other fields
          });
          setLoading(false);
        } catch (err) {
          console.error("Error fetching profile:", err);
          if (err.response && err.response.status === 401) {
            toast.error("Session expired. Please log in again.");
            logout();
          } else {
            setError("Failed to load profile data.");
            setLoading(false);
          }
        }
      }
    };

    fetchProfile();
  }, [admin, token, logout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "/api/admin/updateProfile", // Update with your actual API endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(response.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to update profile.");
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col bg-[#322323] min-h-screen py-12 px-6">
        <div className="max-w-4xl mx-auto bg-[#493939] shadow-xl rounded-xl overflow-hidden animate-pulse">
          <div className="bg-[#FF9321] p-8 text-center">
            <p className="text-white text-xl">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col bg-[#322323] min-h-screen py-12 px-6">
        <div className="max-w-4xl mx-auto bg-[#493939] shadow-xl rounded-xl overflow-hidden">
          <div className="bg-[#FF9321] p-8 text-center">
            <p className="text-white text-xl">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const convertDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-[#493939] shadow-xl rounded-xl overflow-hidden mb-8 transform transition-transform duration-300 hover:scale-[1.02]">
          <div className="bg-[#FF9321] p-8 text-center relative">
            <div className="relative inline-block">
              <img
                className="h-40 w-40 rounded-full border-4 border-white mx-auto mb-6 shadow-lg transition-transform duration-300 hover:scale-105"
                src={profile.avatar ? `/avatars/${profile.avatar}` : "/default-avatar.png"}
                alt={profile.name}
              />
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">{profile.name}</h1>
            <p className="text-white/90 text-xl font-medium">{profile.role}</p>
          </div>

          <div className="p-8 space-y-6">
            <ProfileCard title="Personal Information">
              <ProfileItem icon={User} label="Admin ID" value={profile.adminId} />
              <ProfileItem icon={User} label="Name" value={profile.name} />
              <ProfileItem
                icon={Calendar}
                label="Last Update"
                value={convertDate(profile.lastUpdateDate)}
              />
              <ProfileItem icon={ShieldCheck} label="Role" value={profile.role} />
            </ProfileCard>

            <ProfileCard title="Contact Information">
              <ProfileItem icon={Mail} label="Email" value={profile.email} />
              <ProfileItem icon={Phone} label="Phone" value={profile.phone} />
              <ProfileItem icon={MapPin} label="Address" value={profile.address} />
            </ProfileCard>
          </div>

          {/* Edit Profile Button */}
          <div className="flex justify-center mt-8">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-[#FF9321] text-white rounded-lg shadow-md hover:bg-[#e5831f] transition-colors duration-300"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <div className="max-w-4xl mx-auto bg-[#493939] shadow-xl rounded-xl overflow-hidden p-8 mt-8">
              <h2 className="text-2xl font-bold text-[#FF9321] mb-4">Edit Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-[#322323] text-white border border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-[#322323] text-white border border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-[#322323] text-white border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-[#322323] text-white border border-gray-600"
                    />
                  </div>
                  {/* Add more fields as needed */}
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FF9321] text-white rounded-lg shadow-md hover:bg-[#e5831f] transition-colors duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
