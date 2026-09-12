import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <h3>🛍️ ShopSphere Ethiopia</h3>

        <p>Your local online shopping destination in Ethiopia.</p>

        <p>📍 Addis Ababa, Ethiopia</p>

        <p>📞 +251 900 000 000</p>

        <p className="copyright">
          © {new Date().getFullYear()} ShopSphere Ethiopia. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
