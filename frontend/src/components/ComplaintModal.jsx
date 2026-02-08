import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createComplaintAsync, updateComplaintAsync, deleteComplaintAsync } from '../store/slice/complaint';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog.jsx';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  MapPin, 
  Calendar,
  AlertCircle,
  Pencil,
  Trash2 
} from 'lucide-react';

const ComplaintModal = ({ isOpen, onClose, mode = 'create', complaintData = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    priority: 'Medium',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const categories = [
    'Infrastructure',
    'Sanitation',
    'Water Supply',
    'Electricity',
    'Road',
    'Street Light',
    'Garbage',
    'Others',
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    if (isOpen) {
      setCurrentMode(mode);
      if ((mode === 'view' || mode === 'edit') && complaintData) {
        setFormData({
          title: complaintData.title || '',
          description: complaintData.description || '',
          category: complaintData.category || '',
          address: complaintData.address || '',
          priority: complaintData.priority || 'Medium',
        });
        setExistingImages(complaintData.images || []);
      } else {
        setFormData({
          title: '',
          description: '',
          category: '',
          address: '',
          priority: 'Medium',
        });
        setExistingImages([]);
      }
      setImages([]);
      setImagePreviews([]);
    }
  }, [isOpen, mode, complaintData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + images.length + files.length;
    
    if (totalImages > 5) {
      toast.error('You can upload maximum 5 images');
      return;
    }

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.address) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('address', formData.address);
      submitData.append('priority', formData.priority);

      images.forEach((image) => {
        submitData.append('images', image);
      });

      if (currentMode === 'edit' && complaintData) {
        await dispatch(updateComplaintAsync({ id: complaintData._id, data: submitData })).unwrap();
        toast.success('Complaint updated successfully!');
      } else {
        await dispatch(createComplaintAsync(submitData)).unwrap();
        toast.success('Complaint created successfully!');
      }
      
      handleClose();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error(error || `Failed to ${currentMode === 'edit' ? 'update' : 'create'} complaint`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!complaintData) return;
    
    setLoading(true);
    try {
      await dispatch(deleteComplaintAsync(complaintData._id)).unwrap();
      toast.success('Complaint deleted successfully!');
      setDeleteConfirmOpen(false);
      handleClose();
    } catch (error) {
      toast.error(error || 'Failed to delete complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      address: '',
      priority: 'Medium',
    });
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setDeleteConfirmOpen(false);
    onClose();
  };

  const switchToEditMode = () => {
    setCurrentMode('edit');
  };

  const canEdit = () => {
    return complaintData?.status === 'Pending';
  };

  const canDelete = () => {
    return complaintData?.status === 'Pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (!isOpen) return null;

  const isViewMode = currentMode === 'view';
  const isEditMode = currentMode === 'edit';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">
              {isViewMode ? 'Complaint Details' : isEditMode ? 'Edit Complaint' : 'New Complaint'}
            </h2>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
            {isViewMode ? (
              // View Mode
              <div className="p-6 space-y-6">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getStatusColor(complaintData?.status)}`}>
                    {complaintData?.status}
                  </span>
                  <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getPriorityColor(complaintData?.priority)}`}>
                    {complaintData?.priority}
                  </span>
                  <span className="px-3 py-1 rounded-md text-sm font-medium bg-slate-50 text-slate-700 border border-slate-200">
                    {complaintData?.category}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Title</h3>
                  <p className="text-base font-medium text-slate-900">{complaintData?.title}</p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{complaintData?.description}</p>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Location</h3>
                  <p className="text-sm text-slate-700">{complaintData?.address}</p>
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                    Attachments {existingImages.length > 0 && `(${existingImages.length})`}
                  </h3>
                  {existingImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {existingImages.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
                          onClick={() => window.open(image.url, '_blank')}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-lg">
                      <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-sm text-slate-500">No images attached</p>
                    </div>
                  )}
                </div>

                {/* Admin Notes */}
                <div>
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Admin Notes</h3>
                  {complaintData?.adminNotes && complaintData.adminNotes.trim() !== '' ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">{complaintData.adminNotes}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <p className="text-sm text-slate-500">No notes from admin yet</p>
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Submitted
                    </h3>
                    <p className="text-sm text-slate-700">
                      {new Date(complaintData?.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {complaintData?.resolvedAt && (
                    <div>
                      <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Resolved
                      </h3>
                      <p className="text-sm text-slate-700">
                        {new Date(complaintData.resolvedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Edit/Create Mode - Form
              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                      placeholder="Enter complaint title"
                      required
                    />
                  </div>

                  {/* Category and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                      >
                        {priorities.map((priority) => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                      placeholder="Enter location address"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition resize-none text-sm"
                      placeholder="Describe your complaint in detail..."
                      required
                    />
                  </div>

                  {/* Existing Images (Edit Mode) */}
                  {isEditMode && existingImages.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Current Images
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {existingImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={`Existing ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {isEditMode ? 'Add Images (Max 5 total)' : 'Upload Images (Max 5)'}
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={existingImages.length + images.length >= 5}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`cursor-pointer ${existingImages.length + images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Upload className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </label>
                    </div>

                    {/* New Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : (
                      <>{isEditMode ? 'Update Complaint' : 'Create Complaint'}</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* View Mode Footer */}
          {isViewMode && (
            <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={handleClose}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm"
              >
                Close
              </button>
              <div className="flex gap-3">
                {canDelete() && (
                  <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium text-sm"
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
                {canEdit() && (
                  <button
                    onClick={switchToEditMode}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Complaint"
        message="Are you sure you want to delete this complaint? This action cannot be undone and all associated data will be permanently removed."
        confirmText="Delete Complaint"
        cancelText="Cancel"
        type="danger"
        loading={loading}
      />
    </>
  );
};

export default ComplaintModal;