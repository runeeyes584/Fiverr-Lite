# Fiverr-Lite
Đồ án cơ sở chuyên ngành CÔNG NGHỆ PHẦN MỀM. Được thực hiện bởi một sinh viên đang học và tìm tòi về React và Node JS.

# Database
- Run init-db.js to add data testing


# Webhook Setup
- Run `ngrok http 8800` to expose the server.
- Register the webhook in Clerk Dashboard with URL: `[ngrok-url]/api/users`.
- Ensure `CLERK_WEBHOOK_SIGNING_SECRET` in `.env` matches the Clerk Dashboard.
- Monitor requests at `http://localhost:4040` (ngrok dashboard).