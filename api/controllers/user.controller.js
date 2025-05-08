import { Webhook } from "svix";
import { models } from "../models/Sequelize-mysql.js"; // Đảm bảo đường dẫn đúng
import { Clerk } from '@clerk/clerk-sdk-node';


export const handleClerkWebhook = async (req, res) => {
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
    const payload = req.body;
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook Controller (Verify Error):", err.message);
    return res.status(400).json({ success: false, message: err.message });
  }

  try {
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(`Webhook Controller: Received: Type=${eventType}, ID=${id}, Data:`, JSON.stringify(evt.data, null, 2));

    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        public_metadata,
        created_at,
        birthday,
        gender: clerkGender,
      } = evt.data;

      let dbUserRole = 'seeker';
      if (public_metadata?.isAdmin === true) {
          dbUserRole = 'admin';
      } else if (public_metadata?.isSeller === true) {
          dbUserRole = 'employer';
      }

      const userData = {
        clerk_id: id,
        user_role: dbUserRole,
        country: public_metadata?.country || "Việt Nam",
        description: public_metadata?.description || null,
        registration_date: new Date(created_at).toISOString().slice(0, 10),
        date_of_birth: birthday
          ? new Date(birthday).toISOString().slice(0, 10)
          : null,
        gender: clerkGender === "male" ? 1 : clerkGender === "female" ? 2 : 0,
        contact_number: public_metadata?.contactNumber || null,
      };

      // Chỉ giữ lại các trường có giá trị (không phải undefined) để upsert
      Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key]);

      await models.User.upsert(userData);

      console.log(`Webhook Controller (${eventType}): User ${id} processed, Upsert result:`, userData);
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
        const affectedRows = await models.User.destroy({
          where: { clerk_id }
        });
        console.log(
          `Webhook Controller (${eventType}): User ${clerk_id} deleted from database. Rows: ${affectedRows}`
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
    console.error("Webhook Controller (Event Handling Error):", err.message, err.stack);
    return res.status(200).send("Acknowledged (Server processing error)");
  }
};


// Tạo user mới qua Clerk API
export const createUser = async (req, res, next) => {
  try {
    const { email, username, password, publicMetadata } = req.body || {};

    // Kiểm tra các trường bắt buộc
    if (!email || !username || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields: email, username, or password' });
    }

    const clerkClient = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
    const newUser = await clerkClient.users.createUser({
      emailAddress: [email],
      username,
      password,
      publicMetadata: publicMetadata || { userTypeId: 1, isSeller: false, country: 'Việt Nam' },
    });

    console.log(`User created via API: clerk_id=${newUser.id}`);
    return res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error('Error creating user:', {
      message: err.message,
      status: err.status,
      errors: err.errors || err.response?.data || 'No additional error details'
    });
    return res.status(err.status || 500).json({
      success: false,
      message: 'Error creating user',
      error: err.message,
      details: err.errors || err.response?.data || 'No additional error details'
    });
  }
};


// Cập nhật user qua Clerk API
export const updateUser = async (req, res, next) => {
  try {
    const { clerkId } = req.params;
    const { email, username, publicMetadata } = req.body;

    if (!email && !username && !publicMetadata) {
      return res.status(400).json({ success: false, message: 'No fields provided to update' });
    }

    const clerkClient = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
    const updatedUser = await clerkClient.users.updateUser(clerkId, {
      ...(email && { emailAddress: [email] }),
      ...(username && { username }),
      ...(publicMetadata && { publicMetadata }),
    });

    console.log(`User updated via API: clerk_id=${clerkId}`);
    return res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(`Error updating user ${req.params.clerkId}:`, err.message);
    return next(err);
  }
};

// Xóa user qua Clerk API
export const deleteUser = async (req, res, next) => {
  try {
    const { clerkId } = req.params;

    const clerkClient = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY }); 
    await clerkClient.users.deleteUser(clerkId);

    console.log(`User deleted via API: clerk_id=${clerkId}`);
    return res.status(200).json({ success: true, message: `User ${clerkId} deleted` });
  } catch (err) {
    console.error(`Error deleting user ${req.params.clerkId}:`, err.message);
    return next(err);
  }
};




