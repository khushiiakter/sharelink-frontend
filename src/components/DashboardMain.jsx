import { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BsFillTrash3Fill } from "react-icons/bs";
import { TiEdit } from "react-icons/ti";
import { FiCopy } from "react-icons/fi";
import { AuthContext } from "../provider/AuthProvider";
import useLink from "./useLink";
import LinkModal from "./LinkModal";
import AnalyticsPage from "../pages/AnalyticsPage";

const DashboardMain = () => {
  const { user } = useContext(AuthContext);
  const [links, refetch] = useLink();
  const [selectedLink, setSelectedLink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Ensure `links` is always an array
  const safeLinks = Array.isArray(links) ? links : [];

  // Mutation for adding a new link
  const addLinkMutation = useMutation({
    mutationFn: async (newLink) => {
      const formData = new FormData();
      formData.append("userId", newLink.userId);
      formData.append("userEmail", newLink.userEmail);
      formData.append("title", newLink.title);
      formData.append("visibility", newLink.visibility);
      formData.append("password", newLink.password);
      formData.append("expiration", newLink.expiration);
      formData.append("file", newLink.file); // Append the file

      return await axios.post("https://sharelink-server-sandy.vercel.app/links", formData);
    },
    onSuccess: () => {
      refetch();
      Swal.fire("Success!", "Link created successfully.", "success");
      setIsModalOpen(false);
    },
    onError: () => Swal.fire("Error!", "Failed to create link.", "error"),
  });

  // Mutation for updating a link (metadata only)
  const updateLinkMutation = useMutation({
    mutationFn: async (updatedLink) => {
      const { _id, ...linkData } = updatedLink;
      return await axios.put(`https://sharelink-server-sandy.vercel.app/links/${_id}`, linkData);
    },
    onSuccess: () => {
      refetch();
      Swal.fire("Updated!", "Link updated successfully.", "success");
      setIsModalOpen(false);
      setIsEditing(false);
    },
    onError: () => Swal.fire("Error!", "Failed to update link.", "error"),
  });

  // Mutation for deleting a link
  const deleteLinkMutation = useMutation({
    mutationFn: async (linkId) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`https://sharelink-server-sandy.vercel.app/links/${linkId}`);
        refetch();
        Swal.fire("Deleted!", "Your link has been deleted.", "success");
      }
    },
    onError: () => Swal.fire("Error!", "Failed to delete link.", "error"),
  });

  // Handle opening modal for adding a new link
  const handleAddLink = () => {
    setSelectedLink(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Handle opening modal for editing a link
  const handleEditLink = (link) => {
    setSelectedLink(link);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Copy share URL to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire("Copied!", "Share link copied to clipboard.", "success");
  };

  return (
    <div className="md:p-4 container mx-auto">
      <div className="flex justify-center mb-4">
        <button
          onClick={handleAddLink}
          className="md:text-xl px-5 py-3 text-black bg-gray-200 font-bold hover:bg-gray-300 rounded-full"
        >
          Add New Link
        </button>
      </div>

      {/* Links List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {safeLinks.map((link) => {
          const shareUrl = `https://sharelink-server-sandy.vercel.app/links/${link._id}`;
          return (
            <div key={link._id} className="p-4 border rounded-lg shadow-md">
              <h3 className="font-bold">{link.title}</h3>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="border p-1 flex-1 text-sm rounded"
                />
                <button onClick={() => copyToClipboard(shareUrl)}>
                  <FiCopy size={20} className="text-blue-500" />
                </button>
              </div>
              <p className="mt-2">Visibility: {link.visibility}</p>
              <p>Expiration: {link.expiration || "N/A"}</p>
              <div className="flex justify-between border-t pt-1.5 mt-2">
                <AnalyticsPage linkId={link._id}></AnalyticsPage>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => handleEditLink(link)}
                    className="text-xl text-gray-600 hover:text-red-700"
                  >
                    <TiEdit size={20} />
                  </button>
                  <button
                    onClick={() => deleteLinkMutation.mutate(link._id)}
                    className="text-lg text-gray-600 hover:text-red-700"
                  >
                    <BsFillTrash3Fill size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Link Modal */}
      {isModalOpen && (
        <LinkModal
          link={selectedLink}
          onClose={() => setIsModalOpen(false)}
          onSave={(linkData) =>
            isEditing
              ? updateLinkMutation.mutate(linkData)
              : addLinkMutation.mutate(linkData)
          }
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default DashboardMain;