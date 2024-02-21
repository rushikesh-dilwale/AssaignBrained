// src/components/FormComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const FormComponent = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
      });
      

  const [postData, setPostData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Check if formData is null or undefined before accessing properties
      if (!formData || !formData.name || !formData.description || !formData.image) {
        console.error('Form data is incomplete');
        // Show an alert to the user
        alert('Form data is incomplete. Please fill in all fields.');
        return;
      }
  
      const formDataToSend = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.image ? `images/${formData.image.name}` : '', // Check if formData.image is available
      };
  
      if (selectedPost) {
        // Update existing post
        await axios.put(`http://localhost:5001/api/posts/${selectedPost._id}`, formDataToSend);
      } else {
        // Create a new post
        await axios.post('http://localhost:5001/api/posts', formDataToSend);
      }
  
      // Refresh the posted data after submission
      fetchPostedData();
  
      // Reset the form
      setFormData({
        name: '',
        description: '',
        image: null,
      });
      setSelectedPost(null);
    } catch (error) {
      console.error('Error uploading data:', error);
      // Show an alert to the user
      alert('Error uploading data. Please try again later.');
    }
  };
  
  
  const fetchPostedData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/posts');
      setPostData(response.data);
    } catch (error) {
      console.error('Error fetching posted data:', error);
    }
  };

  const handleUpdateClick = (post) => {
    setFormData({
      name: post.name,
      description: post.description,
      image: null,
    });
    setSelectedPost(post);
  };

  const handleDeleteClick = async (postId) => {
    try {
      await axios.delete(`http://localhost:5001/api/posts/${postId}`);
      // Refresh the posted data after deletion
      fetchPostedData();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {
    // Fetch posted data on component mount
    fetchPostedData();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        <br />
        <button type="submit">{selectedPost ? 'Update' : 'Upload'}</button>
      </form>

      <div>
        <h2>Posted Data</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {postData.map((post) => (
              <tr key={post._id}>
                <td>{post.name}</td>
                <td>{post.description}</td>
                <td>{post.imageUrl}</td>
                <td>
                  <button onClick={() => handleUpdateClick(post)}>Update</button>
                  <button onClick={() => handleDeleteClick(post._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormComponent;
