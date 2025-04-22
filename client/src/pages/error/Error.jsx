import React from "react";
import { Link } from "react-router-dom";
import "./Error.scss";

function ErrorPage() {
  return (
    <div className="error-page">
      <h1>404 - Không tìm thấy trang</h1>
      <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" className="home-link">
        Quay lại trang chủ
      </Link>
    </div>
  );
}

export default ErrorPage;