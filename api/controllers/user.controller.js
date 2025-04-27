
import { Webhook } from 'svix';
import UserModel from '../models/user.model.js';
import { db } from '../server.js';

export const handleClerkWebhook = async (req, res) => {
    // Lấy các header Svix để xác minh
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    // Nếu thiếu header, báo lỗi
    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error("Lỗi Webhook: Thiếu header Svix");
        return res.status(400).send("Lỗi: Thiếu header Svix");
    }

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!WEBHOOK_SECRET) {
        console.error("Lỗi Webhook: Thiếu CLERK_WEBHOOK_SIGNING_SECRET trong env");
        return res.status(500).send("Lỗi cấu hình máy chủ");
    }

    // Tạo instance Svix Webhook
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
        // Xác minh chữ ký webhook
        evt = wh.verify(req.body, { // req.body ở đây là raw body được cung cấp bởi middleware trong route
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });

        const { id } = evt.data; // id ở đây là clerk_id
        const eventType = evt.type;

        console.log(`Webhook Controller: Đã nhận: Loại=${eventType}, ID=${id}`);

        // --- Xử lý sự kiện và lưu vào DB ---
        if (eventType === 'user.created' || eventType === 'user.updated') {
            const { /* ... trích xuất các trường như trước ... */
                email_addresses, primary_email_address_id, username, public_metadata, image_url, created_at, birthday, gender: clerkGender
            } = evt.data;

            const primaryEmail = email_addresses?.find(e => e.id === primary_email_address_id) || email_addresses?.[0];
            const email = primaryEmail?.email_address;

            if (!id || !email || !username) {
                console.error(`Webhook Controller (${eventType}): Thiếu clerk_id, email hoặc username.`);
                return res.status(200).send('Acknowledged (Thiếu dữ liệu bắt buộc)');
            }

            const userData = {
                clerk_id: id,
                user_type_id: public_metadata?.userTypeId || 1,
                email: email,
                username: username,
                country: public_metadata?.country || 'Việt Nam',
                description: public_metadata?.description || null,
                is_seller: public_metadata?.isSeller ? 1 : 0,
                user_image: image_url || null,
                registration_date: new Date(created_at).toISOString().slice(0, 10),
                date_of_birth: birthday ? new Date(birthday).toISOString().slice(0, 10) : null,
                gender: clerkGender === 'male' ? 1 : (clerkGender === 'female' ? 2 : 0),
                contact_number: public_metadata?.contactNumber || null,
                is_active: 1,
            };

            const sql = `
                INSERT INTO ${UserModel.tableName} ( /* ... các cột như trước ... */
                    clerk_id, user_type_id, email, username, country, description,
                    is_seller, user_image, registration_date, date_of_birth, gender,
                    contact_number, is_active, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                ON DUPLICATE KEY UPDATE /* ... các cập nhật như trước ... */
                    email = VALUES(email), username = VALUES(username), country = VALUES(country),
                    description = VALUES(description), is_seller = VALUES(is_seller),
                    user_image = VALUES(user_image), date_of_birth = VALUES(date_of_birth),
                    gender = VALUES(gender), contact_number = VALUES(contact_number),
                    user_type_id = VALUES(user_type_id), is_active = 1, updated_at = NOW();`;

            const values = [ /* ... mảng values như trước ... */
                userData.clerk_id, userData.user_type_id, userData.email, userData.username,
                userData.country, userData.description, userData.is_seller, userData.user_image,
                userData.registration_date, userData.date_of_birth, userData.gender,
                userData.contact_number, userData.is_active
            ];

            db.query(sql, values, (err, results) => {
                if (err) {
                    console.error(`Webhook Controller (${eventType}): Lỗi DB user ${id}:`, err);
                    return res.status(200).send('Acknowledged (Lỗi cơ sở dữ liệu)');
                }
                console.log(`Webhook Controller (${eventType}): User ${id} đã xử lý. Rows: ${results.affectedRows}`);
                res.status(200).json({ success: true, message: "Webhook xử lý và cập nhật DB thành công" });
            });

        } else if (eventType === 'user.deleted') {
            const { id: clerk_id, deleted } = evt.data;

            if (!clerk_id) {
                console.error(`Webhook Controller (${eventType}): Thiếu clerk_id.`);
                return res.status(200).send('Acknowledged (Thiếu dữ liệu)');
            }

            if (deleted) {
                const sql = `UPDATE ${UserModel.tableName} SET is_active = 0, updated_at = NOW() WHERE clerk_id = ?`;
                db.query(sql, [clerk_id], (err, results) => {
                     if (err) {
                        console.error(`Webhook Controller (${eventType}): Lỗi DB khi xóa/disable user ${clerk_id}:`, err);
                        return res.status(200).send('Acknowledged (Lỗi cơ sở dữ liệu)');
                    }
                    console.log(`Webhook Controller (${eventType}): User ${clerk_id} đã xóa/disable. Rows: ${results.affectedRows}`);
                    res.status(200).json({ success: true, message: 'Webhook xử lý xóa user thành công.' });
                });
            } else {
                 console.log(`Webhook Controller (${eventType}): Nhận sự kiện xóa ${clerk_id} nhưng flag 'deleted' không true.`);
                 res.status(200).json({ success: true, message: 'Webhook nhận (sự kiện xóa không cần hành động).' });
            }
        } else {
            console.log(`Webhook Controller: Bỏ qua sự kiện chưa xử lý: ${eventType}`);
            res.status(200).json({ success: true, message: 'Webhook nhận (sự kiện không cần xử lý).' });
        }

    } catch (err) {
        console.error('Lỗi Webhook Controller:', err.message);
        return res.status(400).json({ // Trả về 400 nếu xác minh thất bại
            success: false,
            message: err.message,
        });
    }
};

//clerk chỉ nhận một điểm endpoint duy nhất nên tụi mình không chia route create hay update ra riêng được nha