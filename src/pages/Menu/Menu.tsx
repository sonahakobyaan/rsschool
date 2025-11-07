const Menu = () => {
    return (
    <div className="sections">
      <section className="top">
        <h2 className="about-h1">
          Behind each of our cups hides an
          <span className="accent">amazing surprise</span>
        </h2>
        <div id="categories-container"></div>
      </section>
      <section className="data">
        <div className="loader" id="coffee-loader"></div>
        <div className="about-h1" id="failed_load"></div>
        <div className="data-container">
          <div className="loader-fail-container"></div>
        </div>
      </section>
    </div>
    )
}

export default Menu;