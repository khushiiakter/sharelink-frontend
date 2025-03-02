import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

const LinkModal = ({ link, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    file: null,
    visibility: "public",
    password: "",
    expiration: "",
  });

  useEffect(() => {
    if (link) {
      setFormData(link);
    }
  }, [link]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLink = new FormData();
    newLink.append("title", formData.title);
    newLink.append("userId", user?.uid);
    newLink.append("userEmail", user?.email);
    newLink.append("file", formData.file);
    newLink.append("visibility", formData.visibility || "public");
    if (formData.visibility === "private") {
      newLink.append("password", formData.password);
    }
    if (formData.expiration) {
      newLink.append("expiration", formData.expiration);
    }
    onSave(newLink);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="w-96 p-6 bg-white rounded-md shadow-lg">
        <h2 className="text-xl font-bold text-black mb-4">
          {link ? "Edit Link" : "Add New Link"}
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <input
              type="text"
              name="title"
              placeholder="Link Title"
              maxLength="50"
              value={formData.title}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          {formData.visibility === "private" && (
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Set Password"
                value={formData.password}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <input
              type="date"
              name="expiration"
              value={formData.expiration}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="text-white hover:bg-gray-300 font-semibold bg-[#0F1035] hover:text-black p-2 rounded w-full"
            >
              {link ? "Update Link" : "Add Link"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white font-semibold p-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;
