import React, { useState ,useEffect} from 'react';
import './WriteBlog.css';
import { api,formApi} from '../../services/api';
import { Toaster, toast } from "sonner";
import { useParams } from 'react-router-dom';

const BlogForm = () => {
  const { id } = useParams(); 
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [formData, setFormData] = useState({
    title: '',
    category: '1',
    content: '',
    summary:'',
    image:null,
  });
  const [imageurl, setImageurl] = useState(null);
  const [categories,setCategories] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageurl(URL.createObjectURL(event.target.files[0]));
      setFormData({...formData,image:file})
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/blog/categories/");
        const fetchedTags = response.data.data;
        setCategories(fetchedTags);
        setFormData({...formData,category:categories[0].id})
      } catch (error) {
        console.error("There was an error fetching the tags!", error);
      }
    };
    fetchCategories();

    if (id){
      const getBlog = async () => {
        try {
          const response = await api.get(`/blog/article/${id}/`);
          const fetchedBlog = response.data.data;
          setFormData({
            title:fetchedBlog.title,
            image:fetchedBlog.image,
            category:fetchedBlog.category,
            content:fetchedBlog.content,
            summary:fetchedBlog.summary,
          })
          let image_url = fetchedBlog ? `https://aswin.pythonanywhere.com/${fetchedBlog.image}` : '';
          setImageurl(image_url)
        } catch (error) {
          console.error('Error fetching blog:', error);
        }
      };
      getBlog();
    }


  }, []);

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({
      ...formData,
      [name] : value,
    });
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    if (id){
      formDataToSend.append("title",formData.title)
      formDataToSend.append("category",formData.category)
      formDataToSend.append("content",formData.content)
      formDataToSend.append("summary",formData.summary)
      formDataToSend.append('is_published', status);
      if(formData.image instanceof File){
        formDataToSend.append("image",formData.image)
      }

      try {
        const response = await formApi.patch(`/blog/article/${id}/`, formDataToSend);
        if (response.status === 200){
          toast.success('Blog Saved')
          await sleep(2000);
          //reload the page for fresh input
          window.location.reload();
        }
      } catch (error) {
        toast.error('error occured')
        console.error(`Error ${status} blog:`, error);
      }

    }
    else{
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      formDataToSend.append('is_published', status);
  
      try {
        const response = await formApi.post('/blog/articles/', formDataToSend);
        if (response.status === 201){
          toast.success('Blog Saved')
          await sleep(2000);
          //reload the page for fresh input
          window.location.reload();
        }
      } catch (error) {
        console.error(`Error ${status} blog:`, error);
      }
    }
  };


  return (
    <div className="form-container">
      <Toaster richColors position="top-center" />
      <form id="blog-form" onSubmit={(e) => handleSubmit(e, true)}>
        <h2>Create a New Blog</h2>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} required>
            {categories.map((category)=>(
              <option id={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="content">Summary</label>
          <textarea id="summary" name="summary" rows="10" value={formData.summary} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows="20" value={formData.content} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className='blog-image-preview'>
            <img src={imageurl} alt="" />
        </div>
        <div className="button-group">
          <button type="button" onClick={(e) => handleSubmit(e, false)}>Save as Draft</button>
          <button type="submit">Publish</button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
