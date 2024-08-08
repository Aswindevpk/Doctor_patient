import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import "./BlogView.css";

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [topics, setTopics] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/blog/categories/");
        const fetchedTags = response.data.data;
        setTopics(fetchedTags);

      } catch (error) {
        console.error("There was an error fetching the tags!", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const getBlog = async () => {
      try {
        const response = await api.get(`/blog/article/${id}/`);
        const fetchedBlog = response.data.data;
        setBlog(fetchedBlog);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    getBlog();
  }, [id]);

  let image_url = blog ? `https://aswin.pythonanywhere.com/${blog.image}` : "";

  if (!blog) {
    return <div>No blog found</div>;
  }


  return (
    <div className="blog-container">
      <h1>{blog.title}</h1>
      <div className="blog-meta">
        <span>By {blog.author.username}</span>
        <span> | </span>
        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
        <p className="blog-summary">{blog.summary}</p>
      </div>
      <div className="image-container">
        {image_url && (
          <img src={image_url} alt={blog.title} className="blog-image" />
        )}
      </div>
      <div className="blog-content">{blog.content}</div>
    </div>
  );
};

export default BlogView;
