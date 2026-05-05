import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios/axios";
import useAuth from "../context/AuthContext";
import NavBar from "../components/Nav_bar.jsx";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = useAuth();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    pincode: "",
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.address) {
      setAddress({
        name: user.address.name || "",
        phone: user.address.phone || "",
        addressLine: user.address.addressLine || "",
        pincode: user.address.pincode || "",
      });
    } else {
      setEditing(true); // auto-open form if no address yet
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { name, phone, addressLine, pincode } = address;
    if (!name || !phone || !addressLine || !pincode) {
      toast.warn("Please fill all address fields");
      return;
    }
    setSaving(true);
    try {
      await API.put("/user/address", address);
      await fetchUser();
      toast.success("Address saved successfully ✅");
      setEditing(false);
    } catch (e) {
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const hasAddress = user?.address?.addressLine;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="bg-white rounded-2xl shadow-sm p-4 text-center hover:shadow-md transition"
          >
            <p className="text-3xl mb-1">📦</p>
            <p className="font-medium text-gray-700 text-sm">My Orders</p>
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="bg-white rounded-2xl shadow-sm p-4 text-center hover:shadow-md transition"
          >
            <p className="text-3xl mb-1">🛒</p>
            <p className="font-medium text-gray-700 text-sm">My Cart</p>
          </button>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-800">📍 Delivery Address</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-orange-500 border border-orange-300 px-4 py-1.5 rounded-full hover:bg-orange-50 transition"
              >
                {hasAddress ? "Edit" : "Add Address"}
              </button>
            )}
          </div>

          {!editing && hasAddress ? (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-1.5">
              <p className="font-semibold text-gray-800">{user.address.name}</p>
              <p className="text-gray-600 text-sm">{user.address.addressLine}</p>
              <p className="text-gray-600 text-sm">📞 {user.address.phone}</p>
              <p className="text-gray-600 text-sm">📮 {user.address.pincode}</p>
            </div>
          ) : null}

          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleChange}
                    placeholder="Recipient name"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Full Address</label>
                <textarea
                  name="addressLine"
                  value={address.addressLine}
                  onChange={handleChange}
                  placeholder="House/Flat no., Street, Area, City, State"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
                />
              </div>

              <div className="w-1/2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60 text-sm"
                >
                  {saving ? "Saving..." : "Save Address"}
                </button>
                {hasAddress && (
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
