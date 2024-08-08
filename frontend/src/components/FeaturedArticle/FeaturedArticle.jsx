import React, { useContext } from "react";
import "./FeaturedArticle.css";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { api } from "../../services/api";
import AuthContext from "../../context/AuthContext";
import { Toaster, toast } from "sonner";

const FeaturedArticle = ({ blog }) => {
  const {user} = useContext(AuthContext)
  const formattedDate = format(new Date(blog.created_at), "MMM d"); // Format date as 'Feb 9'
  const navigate = useNavigate();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  

  let blog_img = blog ? `https://aswin.pythonanywhere.com/${blog.image}` : "";

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}/`);
  };

  const handleEdit = (id) => {
    navigate(`/write/${id}/`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/blog/article/${id}`);
      if(response.status === 200){
        toast.error('Blog Deleted Successfully.')
        await sleep(2000);
        navigate("/");
      }
    } catch (error) {
      console.error("There was an error fetching the blogs!", error);
    }
  };

  const truncateSummary = (summary, wordLimit) => {
    const words = summary.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return summary;
  };

  return (
    <div className="FeaturedArticle">
      <Toaster richColors position="top-center" />
      <div className="FeaturedArticle__content">
        <div className="FeaturedArticle__content-author">
          <span className="FeaturedArticle__content-author__name">
            Author :{blog.author.username}
          </span>
        </div>
        <div
          onClick={() => {
            handleBlogClick(blog.id);
          }}
        >
          <h2 className="FeaturedArticle__content-title">{blog.title}</h2>
          <p className="FeaturedArticle__content-short">{truncateSummary(blog.summary,15)}</p>
        </div>
        <div className="FeaturedArticle__content-footer">
          <div className="blog__actions-left">
            <span>{formattedDate}</span>
          </div>
          {user.user_type==='doctor'?(
          <div className="blog-actions">
            <button onClick={(e) => {handleDelete(blog.id);}}className="action-link">Delete</button>
            <button onClick={(e) => {handleEdit(blog.id);}}className="action-link">Edit</button>
          </div>
          ):(
            <></>
          )}
        </div>
      </div>
      <div className="FeaturedArticle__image">
        <img src={blog_img} alt="article" />
      </div>
    </div>
  );
};

export default FeaturedArticle;
