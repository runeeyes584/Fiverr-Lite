import { Webhook } from "svix";
import { models } from "../models/Sequelize-mysql.js"; // Đảm bảo đường dẫn đúng

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
    console.log(`Webhook Controller: Received: Type=${eventType}, ID=${id}`);

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
