import React, { useEffect, useState, useContext } from "react";
import "./Homedoctor.css";
import { api } from "../../services/api";
import { FeaturedArticle, ArticleFilterMenu } from "../../components";

const Homedoctor = () => {
  let [topics, setTopics] = useState([
    { id: 1, name: "Published" },
    { id: 2, name: "Draft" },
  ]);
  const [activeFilter, setActiveFilter] = useState(topics[0]);
  let [blogs, setBlogs] = useState([]);

  // Fetch blogs for the active category whenever activeFilter changes
  useEffect(() => {
    const fetchBlogs = async (Topic) => {
      try {
        const response = await api.get(`/blog/articles/?blog_type=${Topic}`);
        const fetchedBlogs = response.data.data;
        setBlogs(fetchedBlogs);
        console.log(blogs);
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
            <FeaturedArticle blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default Homedoctor;
