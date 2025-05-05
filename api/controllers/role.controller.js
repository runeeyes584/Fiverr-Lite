import { Clerk } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';
dotenv.config();

// Khởi tạo Clerk instance với secret key
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// API: POST /api/role/set-role
export const setUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: "Thiếu userId hoặc role" });
    }

    // Cập nhật role trong publicMetadata của Clerk user
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        isSeller: role === "seller"
      }
    });

    res.status(200).json({ message: "Cập nhật vai trò thành công" });

  } catch (error) {
    console.error("Lỗi cập nhật role:", error);
    res.status(500).json({ error: "Cập nhật thất bại" });
  }
};
