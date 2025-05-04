import User from "./user.model.js";

const Conversation = null;
const Message = null;
const Review = null;
const Gig = null;
const Order = null;
// vùng cho các model sẽ được định nghĩa trong init-db.js
// export { User };
export { User, Conversation, Message, Review, Gig, Order };

//index.js, init-db.js, mySQL-db.js dành cho việc khởi tạo database và models của MySQL 
//trong trường hợp không có script của MongoDB và không cài MongoDB => xem file init-db.js