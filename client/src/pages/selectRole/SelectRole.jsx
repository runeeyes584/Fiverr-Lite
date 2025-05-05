import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectRole.scss";

const SelectRole = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      if (user.publicMetadata && typeof user.publicMetadata.isSeller !== 'undefined') {
        console.log("Vai trò đã được chọn, chuyển hướng về trang chủ...");
        navigate("/");
      }
    }
  }, [user, isLoaded, navigate]);

  const handleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      alert("Vui lòng chọn một vai trò.");
      return;
    }
    setIsLoading(true);

    try {
      // Đảm bảo bạn điền đầy đủ các thông tin cần thiết cho fetch
      const res = await fetch("http://localhost:8800/api/role/set-role", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           userId: user.id,
           role: selectedRole,
         }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Chọn vai trò thành công!");
        navigate("/");
      } else {
        alert("Lỗi: " + (data.message || data.error || "Không thể cập nhật vai trò."));
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      alert("Đã xảy ra lỗi kết nối đến máy chủ.");
    } finally {
        setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="select-role-wrapper">Đang tải...</div>;
  }

  if (!user) {
      return <div className="select-role-wrapper">Vui lòng đăng nhập...</div>;
  }

  // Phần JSX để hiển thị giao diện chọn vai trò
  // Giả định rằng phần này đã được bạn viết đầy đủ
  return (
    <div className="select-role-wrapper">
       <div className="select-role-container">
         <h1>Bạn muốn trở thành?</h1>
         <p className="subtitle">
           Chọn vai trò phù hợp với mục đích sử dụng của bạn trên nền tảng này.
         </p>

         <div className="role-options">
           <div
             className={`role-option ${selectedRole === "seller" ? "selected" : ""}`}
             onClick={() => handleSelect("seller")}
           >
             <div className="icon-placeholder">🛒</div>
             <span>Người bán</span>
           </div>

           <div
             className={`role-option ${selectedRole === "buyer" ? "selected" : ""}`}
             onClick={() => handleSelect("buyer")}
           >
             <div className="icon-placeholder">🛍️</div>
             <span>Người mua</span>
           </div>
         </div>

         <button
             className="continue-button"
             onClick={handleContinue}
             disabled={!selectedRole || isLoading}
         >
           {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
         </button>
       </div>
     </div>
  );
};

export default SelectRole;