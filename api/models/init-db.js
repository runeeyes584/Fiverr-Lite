import { sequelize, models } from "./mySQL-db.js";

// THÊM DỮ LIỆU MẪU VÀO DATABASE
async function initDb() {
  try {
    // Kết nối MySQL
    await sequelize.authenticate();
    console.log("Kết nối MySQL thành công");

    // Tạo bảng
    await sequelize.sync({ force: true });
    console.log("Tạo database thành công");

   
    // 1. Tạo 10 User (5 seller, 5 buyer)
    const users = await models.User.bulkCreate([
      {
        clerk_id: "user_1",
        user_type_id: 1,
        email: "seller1@example.com",
        username: "seller1",
        country: "Việt Nam",
        registration_date: "2025-01-01",
        is_active: true,
        is_seller: true,
      },
      {
        clerk_id: "user_2",
        user_type_id: 1,
        email: "seller2@example.com",
        username: "seller2",
        country: "USA",
        registration_date: "2025-01-02",
        is_active: true,
        is_seller: true,
      },
      {
        clerk_id: "user_3",
        user_type_id: 1,
        email: "seller3@example.com",
        username: "seller3",
        country: "India",
        registration_date: "2025-01-03",
        is_active: true,
        is_seller: true,
      },
      {
        clerk_id: "user_4",
        user_type_id: 1,
        email: "seller4@example.com",
        username: "seller4",
        country: "UK",
        registration_date: "2025-01-04",
        is_active: true,
        is_seller: true,
      },
      {
        clerk_id: "user_5",
        user_type_id: 1,
        email: "seller5@example.com",
        username: "seller5",
        country: "Canada",
        registration_date: "2025-01-05",
        is_active: true,
        is_seller: true,
      },
      {
        clerk_id: "user_6",
        user_type_id: 1,
        email: "buyer1@example.com",
        username: "buyer1",
        country: "Việt Nam",
        registration_date: "2025-01-06",
        is_active: true,
        is_seller: false,
      },
      {
        clerk_id: "user_7",
        user_type_id: 1,
        email: "buyer2@example.com",
        username: "buyer2",
        country: "USA",
        registration_date: "2025-01-07",
        is_active: true,
        is_seller: false,
      },
      {
        clerk_id: "user_8",
        user_type_id: 1,
        email: "buyer3@example.com",
        username: "buyer3",
        country: "India",
        registration_date: "2025-01-08",
        is_active: true,
        is_seller: false,
      },
      {
        clerk_id: "user_9",
        user_type_id: 1,
        email: "buyer4@example.com",
        username: "buyer4",
        country: "UK",
        registration_date: "2025-01-09",
        is_active: true,
        is_seller: false,
      },
      {
        clerk_id: "user_10",
        user_type_id: 1,
        email: "buyer5@example.com",
        username: "buyer5",
        country: "Canada",
        registration_date: "2025-01-10",
        is_active: true,
        is_seller: false,
      },
    ]);

    // Lấy seller và buyer
    const sellers = users.filter((u) => u.is_seller);
    const buyers = users.filter((u) => !u.is_seller);

    // 2. Tạo 10 Gig (mỗi seller 2 gig)
    const gigs = await models.Gig.bulkCreate([
      {
        userId: sellers[0].id,
        title: "Web Development Service",
        desc: "Build a responsive website",
        cat: "development",
        price: 200.0,
        cover: "https://example.com/cover1.jpg",
        shortTitle: "Web Dev",
        shortDesc: "Responsive web development",
        deliveryTime: 5,
        revisionNumber: 2,
      },
      {
        userId: sellers[0].id,
        title: "API Integration",
        desc: "Integrate APIs for your app",
        cat: "development",
        price: 150.0,
        cover: "https://example.com/cover2.jpg",
        shortTitle: "API Integration",
        shortDesc: "Seamless API integration",
        deliveryTime: 3,
        revisionNumber: 1,
      },
      {
        userId: sellers[1].id,
        title: "Graphic Design",
        desc: "Create stunning visuals",
        cat: "design",
        price: 100.0,
        cover: "https://example.com/cover3.jpg",
        shortTitle: "Graphic Design",
        shortDesc: "Professional graphics",
        deliveryTime: 4,
        revisionNumber: 3,
      },
      {
        userId: sellers[1].id,
        title: "Logo Design",
        desc: "Design a unique logo",
        cat: "design",
        price: 80.0,
        cover: "https://example.com/cover4.jpg",
        shortTitle: "Logo Design",
        shortDesc: "Unique logo creation",
        deliveryTime: 2,
        revisionNumber: 2,
      },
      {
        userId: sellers[2].id,
        title: "Content Writing",
        desc: "Write engaging articles",
        cat: "writing",
        price: 50.0,
        cover: "https://example.com/cover5.jpg",
        shortTitle: "Content Writing",
        shortDesc: "Engaging content",
        deliveryTime: 3,
        revisionNumber: 2,
      },
      {
        userId: sellers[2].id,
        title: "SEO Writing",
        desc: "Optimize content for SEO",
        cat: "writing",
        price: 70.0,
        cover: "https://example.com/cover6.jpg",
        shortTitle: "SEO Writing",
        shortDesc: "SEO-optimized articles",
        deliveryTime: 4,
        revisionNumber: 1,
      },
      {
        userId: sellers[3].id,
        title: "Video Editing",
        desc: "Edit professional videos",
        cat: "video",
        price: 120.0,
        cover: "https://example.com/cover7.jpg",
        shortTitle: "Video Editing",
        shortDesc: "Professional video editing",
        deliveryTime: 5,
        revisionNumber: 2,
      },
      {
        userId: sellers[3].id,
        title: "Motion Graphics",
        desc: "Create motion graphics",
        cat: "video",
        price: 150.0,
        cover: "https://example.com/cover8.jpg",
        shortTitle: "Motion Graphics",
        shortDesc: "Dynamic motion graphics",
        deliveryTime: 6,
        revisionNumber: 3,
      },
      {
        userId: sellers[4].id,
        title: "Mobile App Development",
        desc: "Build a mobile app",
        cat: "development",
        price: 300.0,
        cover: "https://example.com/cover9.jpg",
        shortTitle: "Mobile App",
        shortDesc: "Custom mobile app",
        deliveryTime: 10,
        revisionNumber: 2,
      },
      {
        userId: sellers[4].id,
        title: "UI/UX Design",
        desc: "Design user-friendly interfaces",
        cat: "design",
        price: 180.0,
        cover: "https://example.com/cover10.jpg",
        shortTitle: "UI/UX Design",
        shortDesc: "User-friendly UI/UX",
        deliveryTime: 5,
        revisionNumber: 2,
      },
    ]);

    // 3. Tạo 8 Conversation
    const conversations = await models.Conversation.bulkCreate([
      {
        sellerId: sellers[0].id,
        buyerId: buyers[0].id,
        readBySeller: false,
        readByBuyer: true,
        lastMessage: "Interested in your web dev service!",
      },
      {
        sellerId: sellers[1].id,
        buyerId: buyers[1].id,
        readBySeller: true,
        readByBuyer: false,
        lastMessage: "Can you design a logo for me?",
      },
      {
        sellerId: sellers[2].id,
        buyerId: buyers[2].id,
        readBySeller: false,
        readByBuyer: false,
        lastMessage: "Need an article written.",
      },
      {
        sellerId: sellers[3].id,
        buyerId: buyers[3].id,
        readBySeller: true,
        readByBuyer: true,
        lastMessage: "Can you edit a video?",
      },
      {
        sellerId: sellers[4].id,
        buyerId: buyers[4].id,
        readBySeller: false,
        readByBuyer: true,
        lastMessage: "Interested in your mobile app service.",
      },
      {
        sellerId: sellers[0].id,
        buyerId: buyers[1].id,
        readBySeller: true,
        readByBuyer: false,
        lastMessage: "Can you integrate an API?",
      },
      {
        sellerId: sellers[1].id,
        buyerId: buyers[2].id,
        readBySeller: false,
        readByBuyer: true,
        lastMessage: "Need a graphic design.",
      },
      {
        sellerId: sellers[2].id,
        buyerId: buyers[3].id,
        readBySeller: true,
        readByBuyer: false,
        lastMessage: "Can you write SEO content?",
      },
    ]);

    // 4. Tạo 10 Message
    await models.Message.bulkCreate([
      {
        conversationId: conversations[0].id,
        userId: buyers[0].id,
        desc: "Interested in your web dev service!",
      },
      {
        conversationId: conversations[0].id,
        userId: sellers[0].id,
        desc: "Sure, let's discuss your requirements.",
      },
      {
        conversationId: conversations[1].id,
        userId: buyers[1].id,
        desc: "Can you design a logo for me?",
      },
      {
        conversationId: conversations[2].id,
        userId: buyers[2].id,
        desc: "Need an article written.",
      },
      {
        conversationId: conversations[3].id,
        userId: buyers[3].id,
        desc: "Can you edit a video?",
      },
      {
        conversationId: conversations[4].id,
        userId: buyers[4].id,
        desc: "Interested in your mobile app service.",
      },
      {
        conversationId: conversations[5].id,
        userId: buyers[1].id,
        desc: "Can you integrate an API?",
      },
      {
        conversationId: conversations[6].id,
        userId: buyers[2].id,
        desc: "Need a graphic design.",
      },
      {
        conversationId: conversations[7].id,
        userId: buyers[3].id,
        desc: "Can you write SEO content?",
      },
      {
        conversationId: conversations[7].id,
        userId: sellers[2].id,
        desc: "Yes, I can help with SEO content.",
      },
    ]);

    // 5. Tạo 8 Order
    await models.Order.bulkCreate([
      {
        gigId: gigs[0].id,
        img: "https://example.com/order1.jpg",
        title: "Web Development Order",
        price: 200.0,
        sellerId: sellers[0].id,
        buyerId: buyers[0].id,
        isCompleted: true,
        payment_intent: "payment_1",
      },
      {
        gigId: gigs[2].id,
        img: "https://example.com/order2.jpg",
        title: "Graphic Design Order",
        price: 100.0,
        sellerId: sellers[1].id,
        buyerId: buyers[1].id,
        isCompleted: false,
        payment_intent: "payment_2",
      },
      {
        gigId: gigs[4].id,
        img: "https://example.com/order3.jpg",
        title: "Content Writing Order",
        price: 50.0,
        sellerId: sellers[2].id,
        buyerId: buyers[2].id,
        isCompleted: true,
        payment_intent: "payment_3",
      },
      {
        gigId: gigs[6].id,
        img: "https://example.com/order4.jpg",
        title: "Video Editing Order",
        price: 120.0,
        sellerId: sellers[3].id,
        buyerId: buyers[3].id,
        isCompleted: false,
        payment_intent: "payment_4",
      },
      {
        gigId: gigs[8].id,
        img: "https://example.com/order5.jpg",
        title: "Mobile App Order",
        price: 300.0,
        sellerId: sellers[4].id,
        buyerId: buyers[4].id,
        isCompleted: true,
        payment_intent: "payment_5",
      },
      {
        gigId: gigs[1].id,
        img: "https://example.com/order6.jpg",
        title: "API Integration Order",
        price: 150.0,
        sellerId: sellers[0].id,
        buyerId: buyers[1].id,
        isCompleted: false,
        payment_intent: "payment_6",
      },
      {
        gigId: gigs[3].id,
        img: "https://example.com/order7.jpg",
        title: "Logo Design Order",
        price: 80.0,
        sellerId: sellers[1].id,
        buyerId: buyers[2].id,
        isCompleted: true,
        payment_intent: "payment_7",
      },
      {
        gigId: gigs[5].id,
        img: "https://example.com/order8.jpg",
        title: "SEO Writing Order",
        price: 70.0,
        sellerId: sellers[2].id,
        buyerId: buyers[3].id,
        isCompleted: false,
        payment_intent: "payment_8",
      },
    ]);

    // 6. Tạo 8 Review
    await models.Review.bulkCreate([
      {
        gigId: gigs[0].id,
        userId: buyers[0].id,
        star: 5,
        desc: "Amazing web development service!",
      },
      {
        gigId: gigs[2].id,
        userId: buyers[1].id,
        star: 4,
        desc: "Great graphic design, very creative.",
      },
      {
        gigId: gigs[4].id,
        userId: buyers[2].id,
        star: 5,
        desc: "Excellent article, well-written.",
      },
      {
        gigId: gigs[6].id,
        userId: buyers[3].id,
        star: 3,
        desc: "Good video editing, but took longer than expected.",
      },
      {
        gigId: gigs[8].id,
        userId: buyers[4].id,
        star: 5,
        desc: "Fantastic mobile app development!",
      },
      {
        gigId: gigs[1].id,
        userId: buyers[1].id,
        star: 4,
        desc: "API integration was smooth.",
      },
      {
        gigId: gigs[3].id,
        userId: buyers[2].id,
        star: 5,
        desc: "Loved the logo design!",
      },
      {
        gigId: gigs[5].id,
        userId: buyers[3].id,
        star: 4,
        desc: "Good SEO content, met my needs.",
      },
    ]);

    console.log("Thêm dữ liệu mẫu thành công");
  } catch (err) {
    console.error("Lỗi khi khởi tạo database:", err.message);
    console.error("Stack trace:", err.stack);
  } finally {
    await sequelize.close();
  }
}

initDb();

//index.js, init-db.js, mySQL-db.js dành cho việc khởi tạo database và models của MySQL trong trường hợp không có script của MongoDB và không cài MongoDB
// Chạy file này để khởi thêm dữ liệu mẫu của MySQL (node models/init-db.js) vì .env nằm ngoài thư mục models