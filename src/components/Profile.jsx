import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../contexts/AdminContext.jsx";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
} from "lucide-react";
import axios from "../api/axios";
import { toast } from "react-toastify";

/* ———— tiny utility so we don’t repeat the url ———— */
const API_ME = "/admin/me";

const Card = ({ className, children }) => (
  <div className={`bg-[#493939] shadow-lg rounded-xl hover:scale-[1.02] transition-transform duration-300 ${className}`}>{children}</div>
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
      <h3 className="text-2xl font-bold text-[#FF9321] text-center">{title}</h3>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const ProfileItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200">
    <Icon className="w-6 h-6 text-[#FF9321] mt-1" />
    <div className="flex-1">
      <p className="uppercase text-sm tracking-wide font-medium text-[#FF9321] mb-1">{label}</p>
      <p className="text-lg text-gray-300">{value || "N/A"}</p>
    </div>
  </div>
);

const Profile = () => {
  const { admin, token, logout } = useContext(AdminContext);

  const [profile, setProfile] = useState(admin);
  const [loading, setLoading] = useState(!admin);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  /* ---------- FETCH PROFILE ---------- */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        logout();
        return;
      }
      if (admin) {
        setProfile(admin);
        setFormData({
          name: admin.name || "",
          email: admin.email || "",
          phone: admin.phone || "",
          address: admin.address || "",
        });
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(API_ME, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          logout();
        } else {
          setError("Failed to load profile data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [admin, token, logout]);

  /* ---------- FORM HANDLERS ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

 /* ---------- FORM SUBMIT ---------- */
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!token) {
    toast.error("Authentication required. Please log in again.");
    logout();
    return;
  }

  // 🔹 build a payload containing ONLY the fields the user actually filled in
  const payload = Object.entries(formData)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .reduce((obj, [k, v]) => ({ ...obj, [k]: v.trim?.() ?? v }), {});

  if (Object.keys(payload).length === 0) {
    toast.info("Nothing to update.");
    setIsEditing(false);
    return;
  }

  setSaving(true);
  try {
    // the API accepts PATCH for updates
    const { data } = await axios.patch("/admin/me", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setProfile(data);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  } catch (err) {
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Failed to update profile.";
    toast.error(msg);
  } finally {
    setSaving(false);
  }
};


  /* ---------- HELPERS ---------- */
  const formatDate = (iso) => {
    if (!iso) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  };

  /* ---------- RENDER ---------- */
  if (loading) {
    return (
      <div className="w-full flex flex-col bg-[#322323] min-h-screen py-12 px-6">
        <div className="max-w-4xl mx-auto bg-[#493939] shadow-xl rounded-xl overflow-hidden animate-pulse">
          <div className="bg-[#FF9321] p-8 text-center">
            <p className="text-white text-xl">Loading profile…</p>
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

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-screen py-12 px-6">
      <div className="max-w-4xl w-full mx-auto bg-[#493939] shadow-xl rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
        {/* ---------- HEADER ---------- */}
        <div className="bg-[#FF9321] p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">{profile.name}</h1>
          <p className="text-white/90 text-xl font-medium">{profile.role}</p>
        </div>

        {/* ---------- DETAILS ---------- */}
        <div className="p-8 space-y-6">
          <ProfileCard title="Personal Information">
            <ProfileItem icon={User} label="Admin ID" value={profile.adminId} />
            <ProfileItem icon={User} label="Name" value={profile.name} />
            <ProfileItem
              icon={Calendar}
              label="Last Update"
              value={formatDate(profile.updatedAt || profile.lastUpdateDate)}
            />
            <ProfileItem icon={ShieldCheck} label="Role" value={profile.role} />
          </ProfileCard>

          <ProfileCard title="Contact Information">
            <ProfileItem icon={Mail} label="Email" value={profile.email} />
            <ProfileItem icon={Phone} label="Phone" value={profile.phone} />
            <ProfileItem icon={MapPin} label="Address" value={profile.address} />
          </ProfileCard>
        </div>

        {/* ---------- EDIT BUTTON ---------- */}
        {!isEditing && (
          <div className="flex justify-center mt-4 mb-8">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-[#FF9321] text-white rounded-lg shadow-md hover:bg-[#e5831f] transition-colors duration-300"
            >
              Edit Profile
            </button>
          </div>
        )}

        {/* ---------- EDIT FORM ---------- */}
        {isEditing && (
          <div className="max-w-4xl mx-auto bg-[#493939] shadow-xl rounded-xl overflow-hidden p-8">
            <h2 className="text-2xl font-bold text-[#FF9321] mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-1">Name</label>
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
                <label className="block text-gray-300 mb-1">Email</label>
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
                <label className="block text-gray-300 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#322323] text-white border border-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#322323] text-white border border-gray-600"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg shadow-md transition-colors duration-300 ${
                    saving
                      ? "bg-[#FF9321]/70 cursor-not-allowed"
                      : "bg-[#FF9321] hover:bg-[#e5831f]"
                  } text-white`}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
