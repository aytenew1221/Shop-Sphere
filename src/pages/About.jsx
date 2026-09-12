import React from "react";

function About() {
  return (
    <section className="section">
      <div className="container about">
        <div className="page-heading">
          <h1>About ShopSphere</h1>
        </div>

        <div className="about-card">
          <h2>🇪🇹 Built for Ethiopia</h2>

          <p>
            ShopSphere is a React-based online shopping application designed
            around the Ethiopian shopping experience.
          </p>

          <p>
            The application allows customers to browse products, search and
            filter products, view product details, add products to a shopping
            cart and complete a simple checkout process.
          </p>

          <h2>Our Goal</h2>

          <p>
            Our goal is to demonstrate how modern React concepts can be used to
            build a complete, reusable and responsive e-commerce application.
          </p>

          {/* <h2>Technologies</h2>

          <ul>
            <li>React</li>
            <li>React Router</li>
            <li>JavaScript</li>
            <li>Context API</li>
            <li>LocalStorage</li>
            <li>Responsive CSS</li>
            <li>JSON data</li>
          </ul> */}
        </div>
      </div>
    </section>
  );
}

export default About;
