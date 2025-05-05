
// import { Webhook } from 'svix';
// import UserModel from '../models/user.model.js'; // Import UserModel
// import { db } from '../server.js'; // Import kết nối db từ server.js

// export const handleClerkWebhook = async (req, res) => {

//     // --- Bắt đầu: Xác minh chữ ký Webhook ---

//     // 1. Lấy các header Svix cần thiết
//     const svix_id = req.headers["svix-id"];
//     const svix_timestamp = req.headers["svix-timestamp"];
//     const svix_signature = req.headers["svix-signature"];

//     // 2. Kiểm tra sự tồn tại của header
//     if (!svix_id || !svix_timestamp || !svix_signature) {
//         console.error("Lỗi Webhook: Thiếu header Svix");
//         return res.status(400).send("Lỗi: Thiếu header Svix");
//     }

//     // 3. Lấy Webhook Secret từ biến môi trường
//     const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
//     if (!WEBHOOK_SECRET) {
//         console.error("Lỗi Webhook: Thiếu CLERK_WEBHOOK_SIGNING_SECRET trong env");
//         return res.status(500).send("Lỗi cấu hình máy chủ");
//     }

//     // 4. Khởi tạo đối tượng Svix Webhook
//     const wh = new Webhook(WEBHOOK_SECRET);
//     let evt;

//     // 5. Xác minh chữ ký payload
//     try {
//         evt = wh.verify(req.body, { // req.body là raw body
//             "svix-id": svix_id,
//             "svix-timestamp": svix_timestamp,
//             "svix-signature": svix_signature,
//         });
//     } catch (err) {
//         // Trả về lỗi 400 nếu xác minh thất bại
//         console.error('Lỗi Webhook Controller (Verify):', err.message);
//         return res.status(400).json({ success: false, message: err.message });
//     }

//     // --- Bắt đầu: Xử lý sự kiện dựa trên loại ---
//     try {
//         const { id } = evt.data; // id ở đây là clerk_id
//         const eventType = evt.type;
//         console.log(`Webhook Controller: Đã nhận: Loại=${eventType}, ID=${id}`);

//         // --- Logic xử lý sự kiện User Create / Update ---
//         if (eventType === 'user.created' || eventType === 'user.updated') {
//             // 1. Trích xuất dữ liệu người dùng từ payload
//             const {
//                 email_addresses, primary_email_address_id, username, public_metadata, image_url, created_at, birthday, gender: clerkGender
//             } = evt.data;

//             // 2. Lấy thông tin email chính
//             const primaryEmail = email_addresses?.find(e => e.id === primary_email_address_id) || email_addresses?.[0];
//             const email = primaryEmail?.email_address;

//             // 3. Kiểm tra dữ liệu bắt buộc
//             if (!id || !email || !username) {
//                 console.error(`Webhook Controller (${eventType}): Thiếu clerk_id, email hoặc username.`);
//                 return res.status(200).send('Acknowledged (Thiếu dữ liệu bắt buộc)');
//             }

//             // 4. Chuẩn bị dữ liệu để lưu vào DB
//             const userData = {
//                 clerk_id: id,
//                 user_type_id: public_metadata?.userTypeId || 1, // Lấy từ metadata hoặc mặc định
//                 email: email,
//                 username: username,
//                 country: public_metadata?.country || 'Việt Nam', // Lấy từ metadata hoặc mặc định
//                 description: public_metadata?.description || null, // Lấy từ metadata hoặc mặc định
//                 is_seller: public_metadata?.isSeller ? 1 : 0, // Lấy từ metadata hoặc mặc định
//                 user_image: image_url || null,
//                 registration_date: new Date(created_at).toISOString().slice(0, 10),
//                 date_of_birth: birthday ? new Date(birthday).toISOString().slice(0, 10) : null,
//                 gender: clerkGender === 'male' ? 1 : (clerkGender === 'female' ? 2 : 0), // Ánh xạ giới tính
//                 contact_number: public_metadata?.contactNumber || null, // Lấy từ metadata hoặc mặc định
//                 is_active: 1, // Mặc định active
//             };

//             // 5. Tạo câu lệnh SQL (INSERT...ON DUPLICATE KEY UPDATE)
//             const sql = `
//                 INSERT INTO ${UserModel.tableName} (
//                     clerk_id, user_type_id, email, username, country, description,
//                     is_seller, user_image, registration_date, date_of_birth, gender,
//                     contact_number, is_active, created_at, updated_at
//                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//                 ON DUPLICATE KEY UPDATE
//                     email = VALUES(email), username = VALUES(username), country = VALUES(country),
//                     description = VALUES(description), is_seller = VALUES(is_seller),
//                     user_image = VALUES(user_image), date_of_birth = VALUES(date_of_birth),
//                     gender = VALUES(gender), contact_number = VALUES(contact_number),
//                     user_type_id = VALUES(user_type_id), is_active = 1, updated_at = NOW();`;

//             const values = [
//                 userData.clerk_id, userData.user_type_id, userData.email, userData.username,
//                 userData.country, userData.description, userData.is_seller, userData.user_image,
//                 userData.registration_date, userData.date_of_birth, userData.gender,
//                 userData.contact_number, userData.is_active
//             ];

//             // 6. Thực thi truy vấn DB
//             db.query(sql, values, (err, results) => {
//                 if (err) {
//                     console.error(`Webhook Controller (${eventType}): Lỗi DB user ${id}:`, err);
//                     // Gửi 200 để Clerk không retry vì lỗi phía bạn
//                     return res.status(200).send('Acknowledged (Lỗi cơ sở dữ liệu)');
//                 }
//                 console.log(`Webhook Controller (${eventType}): User ${id} đã xử lý. Rows: ${results.affectedRows}`);
//                 // Gửi phản hồi thành công
//                 res.status(200).json({ success: true, message: "Webhook xử lý và cập nhật DB thành công" });
//             });
//         }

//         // --- Logic xử lý sự kiện User Delete ---
//         else if (eventType === 'user.deleted') {
//             // 1. Trích xuất dữ liệu cần thiết
//             const { id: clerk_id, deleted } = evt.data;

//             // 2. Kiểm tra clerk_id
//             if (!clerk_id) {
//                 console.error(`Webhook Controller (${eventType}): Thiếu clerk_id.`);
//                 return res.status(200).send('Acknowledged (Thiếu dữ liệu)');
//             }

//             // 3. Kiểm tra cờ 'deleted'
//             if (deleted) {
//                 // 4. Tạo câu lệnh SQL (UPDATE is_active = 0)
//                 const sql = `UPDATE ${UserModel.tableName} SET is_active = 0, updated_at = NOW() WHERE clerk_id = ?`;
//                 // 5. Thực thi truy vấn DB
//                 db.query(sql, [clerk_id], (err, results) => {
//                     if (err) {
//                         console.error(`Webhook Controller (${eventType}): Lỗi DB khi xóa/disable user ${clerk_id}:`, err);
//                         return res.status(200).send('Acknowledged (Lỗi cơ sở dữ liệu)');
//                     }
//                     console.log(`Webhook Controller (${eventType}): User ${clerk_id} đã xóa/disable. Rows: ${results.affectedRows}`);
//                     res.status(200).json({ success: true, message: 'Webhook xử lý xóa user thành công.' });
//                 });
//             } else {
//                 // Trường hợp nhận event user.deleted nhưng flag deleted=false (hiếm gặp)
//                 console.log(`Webhook Controller (${eventType}): Nhận sự kiện xóa ${clerk_id} nhưng flag 'deleted' không true.`);
//                 res.status(200).json({ success: true, message: 'Webhook nhận (sự kiện xóa không cần hành động).' });
//             }
//         }

//         // --- Xử lý các loại sự kiện khác (nếu cần) ---
//         else {
//             console.log(`Webhook Controller: Bỏ qua sự kiện chưa xử lý: ${eventType}`);
//             res.status(200).json({ success: true, message: 'Webhook nhận (sự kiện không cần xử lý).' });
//         }

//     } catch (err) {
//         console.error('Lỗi Webhook Controller (Event Handling):', err.message);
//         res.status(200).send('Acknowledged (Lỗi xử lý phía máy chủ)');
//     }
// };

import { Webhook } from "svix";
import { models } from "../models/Sequelize-mysql.js";

export const handleClerkWebhook = async (req, res) => {
  // Xác minh chữ ký Webhook
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Webhook Error: Missing Svix headers");
    return res.status(400).send("Error: Missing Svix headers");
  }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("Webhook Error: Missing CLERK_WEBHOOK_SIGNING_SECRET in env");
    return res.status(500).send("Server configuration error");
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(req.body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook Controller (Verify Error):", err.message);
    return res.status(400).json({ success: false, message: err.message });
  }

  // Xử lý sự kiện
  try {
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(`Webhook Controller: Received: Type=${eventType}, ID=${id}`);

    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        email_addresses,
        primary_email_address_id,
        username,
        public_metadata,
        image_url,
        created_at,
        birthday,
        gender: clerkGender,
      } = evt.data;

      const primaryEmail =
        email_addresses?.find((e) => e.id === primary_email_address_id) ||
        email_addresses?.[0];
      const email = primaryEmail?.email_address;

      if (!id || !email || !username) {
        console.error(
          `Webhook Controller (${eventType}): Missing clerk_id, email, or username`
        );
        return res.status(200).send("Acknowledged (Missing required data)");
      }

      const userData = {
        clerk_id: id,
        user_type_id: public_metadata?.userTypeId || 1,
        email,
        username,
        country: public_metadata?.country || "Việt Nam",
        description: public_metadata?.description || null,
        is_seller: !!public_metadata?.isSeller,
        user_image: image_url || null,
        registration_date: new Date(created_at).toISOString().slice(0, 10),
        date_of_birth: birthday
          ? new Date(birthday).toISOString().slice(0, 10)
          : null,
        gender: clerkGender === "male" ? 1 : clerkGender === "female" ? 2 : 0,
        contact_number: public_metadata?.contactNumber || null,
        is_active: true,
      };

      await models.User.upsert(userData);

      console.log(`Webhook Controller (${eventType}): User ${id} processed`);
      return res.status(200).json({
        success: true,
        message: "Webhook processed and DB updated successfully",
      });
    }

    if (eventType === "user.deleted") {
      const { id: clerk_id, deleted } = evt.data;

      if (!clerk_id) {
        console.error(`Webhook Controller (${eventType}): Missing clerk_id`);
        return res.status(200).send("Acknowledged (Missing data)");
      }

      if (deleted) {
        await models.User.update(
          { is_active: false },
          { where: { clerk_id } }
        );
        console.log(
          `Webhook Controller (${eventType}): User ${clerk_id} deleted/disabled`
        );
        return res.status(200).json({
          success: true,
          message: "Webhook processed: User deletion successful",
        });
      }

      console.log(
        `Webhook Controller (${eventType}): Received delete event for ${clerk_id} but 'deleted' flag is not true`
      );
      return res.status(200).json({
        success: true,
        message: "Webhook received (No action needed for delete event)",
      });
    }

    console.log(`Webhook Controller: Ignored unhandled event: ${eventType}`);
    return res.status(200).json({
      success: true,
      message: "Webhook received (No action needed for event)",
    });
  } catch (err) {
    console.error("Webhook Controller (Event Handling Error):", err.message);
    return res.status(200).send("Acknowledged (Server processing error)");
  }
};