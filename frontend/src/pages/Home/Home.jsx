import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import {api} from "../../services/api";
import { FeaturedArticle, ArticleFilterMenu } from "../../components";

const Home = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  let [topics, setTopics] = useState([]);
  let [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/blog/categories/");
        const fetchedTags = response.data.data;
        setTopics(fetchedTags);
        setActiveFilter(fetchedTags[0]);
      } catch (error) {
        console.error("There was an error fetching the tags!", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch blogs for the active category whenever activeFilter changes
  useEffect(() => {
    const fetchBlogs = async (Topic) => {
      try {
        const response = await api.get(`/blog/articles/?category=${Topic}`);
        const fetchedBlogs = response.data.data;
        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error("There was an error fetching the blogs!", error);
      }
    };

    if (activeFilter) {
      fetchBlogs(activeFilter.name);
    }
  }, [activeFilter]);

  return (
    <div className="home">
      <div className="home__main">
        <ArticleFilterMenu
          filters={topics}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        {blogs.map((blog) => (
          <FeaturedArticle key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default Home;
