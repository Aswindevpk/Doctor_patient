import './ArticleFilterMenu.css'

const ArticleFilterMenu = ({ filters, activeFilter, setActiveFilter }) => {
  return (
    <div className="filter-menu">
      {filters.map((filter) => (
        <div
          key={filter.id}
          className={filter === activeFilter ? 'active' : ''}
          onClick={() => setActiveFilter(filter)}
        >
          {filter.name}
        </div>
      ))}
    </div>
  );
};

export default ArticleFilterMenu;
