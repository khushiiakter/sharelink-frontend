import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useMutation} from "@tanstack/react-query";

import { BsFillTrash3Fill } from "react-icons/bs";
import { TiEdit } from "react-icons/ti";
import { AuthContext } from "../provider/AuthProvider";
import useLink from "./useLink";
import LinkModal from "./LinkModal";

const DashboardMain = () => {
  const { user } = useContext(AuthContext);
  
  const [links, refetch] = useLink();
  const [selectedLink, setSelectedLink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  

  // Mutation for adding a new link
  const addLinkMutation = useMutation({
    mutationFn: async (newLink) => {
      return await axios.post("http://localhost:5000/links", newLink, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      refetch();
      Swal.fire("Success!", "Link created successfully.", "success");
      setIsModalOpen(false);
    },
    onError: () => Swal.fire("Error!", "Failed to create link.", "error"),
  });
  

  // Mutation for updating a link
  const updateLinkMutation = useMutation({
    mutationFn: async (updatedLink) => {
      const { _id, ...linkData } = updatedLink;
      return await axios.put(`http://localhost:5000/links/${_id}`, linkData);
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
        await axios.delete(`http://localhost:5000/links/${linkId}`);
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

  return (
    <div className="md:p-4 container mx-auto">
      <div className="flex justify-center">
        <button
          onClick={handleAddLink}
          className="md:text-xl px-5 py-3 text-black bg-gray-200 font-bold hover:bg-gray-300 rounded-full md:px-5 hover:border-white mb-4 sm:w-auto"
        >
          Add New Link
        </button>
      </div>

      {/* Links List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {links?.map((link) => (
          <div key={link._id} className="p-4 border rounded-lg shadow-md">
            <h3>{link.title}</h3>
            <a href={link.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              {link.fileUrl}
            </a>
            <p>Visibility: {link.visibility}</p>
            <p>Expiration: {link.expiration || "N/A"}</p>
            <div className="flex justify-between mt-2">
              <button onClick={() => handleEditLink(link)} className="text-yellow-500">
                <TiEdit size={20} />
              </button>
              <button onClick={() => deleteLinkMutation.mutate(link._id)} className="text-red-500">
                <BsFillTrash3Fill size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Link Modal */}
      {isModalOpen && (
        <LinkModal
          link={selectedLink}
          onClose={() => setIsModalOpen(false)}
          onSave={(link) =>
            isEditing ? updateLinkMutation.mutate(link) : addLinkMutation.mutate(link)
          }
        />
      )}
    </div>
  );
};

export default DashboardMain;
