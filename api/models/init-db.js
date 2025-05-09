import { models, sequelize } from "./Sequelize-mysql.js";

async function initDb() {
  try {
    await sequelize.authenticate();
    console.log("Kết nối MySQL thành công");

    await sequelize.sync({ force: true}); //force true để xóa và tạo lại tất cả các bảng, có thể thay đổi thành false nếu không muốn xóa dữ liệu cũ
    console.log("Tạo database thành công");

    // Tạo job_type
    const jobTypes = await models.JobType.bulkCreate([
      { job_type: "Full-time" },
      { job_type: "Part-time" },
    ]);

    // Tạo category
    const categories = await models.Category.bulkCreate([
      {
        "name": "Web Development",
        "desc": "Build stunning websites",
        "img": "."
      },
      {
        "name": "Graphic Illustration",
        "desc": "Create unique artwork",
        "img": "https://images.unsplash.com/photo-1546410531-bb4ca2f6e5c8"
      },
      {
        "name": "SEO Services",
        "desc": "Boost your rankings",
        "img": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
      },
      {
        "name": "Social Media Management",
        "desc": "Enhance your online reach",
        "img": "https://images.unsplash.com/photo-1611162617210-7b540f1e4b3e"
      },
      {
        "name": "Animation Design",
        "desc": "Bring ideas to life",
        "img": "https://images.unsplash.com/photo-1620207418302-439b387441b0"
      },
      {
        "name": "Content Creation",
        "desc": "Engage with quality content",
        "img": "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
      },
      {
        "name": "E-commerce Solutions",
        "desc": "Grow your online store",
        "img": "https://images.unsplash.com/photo-1556740738-b6a63e27c4df"
      },
      {
        "name": "UI/UX Design",
        "desc": "Design user-friendly interfaces",
        "img": "https://images.unsplash.com/photo-1593642634367-d91a5d8e3525"
      },
      {
        "name": "Voice Acting",
        "desc": "Voice your brand",
        "img": "https://images.unsplash.com/photo-1508704019882-f9cf40e769ab"
      },
      {
        "name": "Mobile App Development",
        "desc": "Create powerful apps",
        "img": "https://images.unsplash.com/photo-1580894732444-8ecded7900cd"
      },
      {
        "name": "Video Editing",
        "desc": "Polish your videos",
        "img": "https://images.unsplash.com/photo-1545231027-637d2f6211f8"
      },
      {
        "name": "Copywriting",
        "desc": "Write compelling copy",
        "img": "https://images.unsplash.com/photo-1508780709619-79562169bc64"
      },
      {
        "name": "Game Development",
        "desc": "Build immersive games",
        "img": "https://images.unsplash.com/photo-1511884642898-4c92249e20b6"
      },
      {
        "name": "Interior Design",
        "desc": "Transform your space",
        "img": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
      },
      {
        "name": "Event Planning",
        "desc": "Plan memorable events",
        "img": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
      },
    ]);

    // Tạo skills
    await models.Skills.bulkCreate([
      { name: "JavaScript" },
      { name: "Graphic Design" },
    ]);

    // Tạo user_account
    const users = await models.User.bulkCreate([
      {
        clerk_id: "user_1",
        country: "Việt Nam",
        registration_date: "2025-01-01",
        is_seller: true,
        user_role: "employer",
      },
      {
        clerk_id: "user_2",
        country: "USA",
        registration_date: "2025-01-02",
        is_seller: true,
        user_role: "employer",
      },
      {
        clerk_id: "user_3",
        country: "India",
        registration_date: "2025-01-03",
        is_seller: false,
        user_role: "seeker",
      },
    ]);

    // Tạo gigs
    const gigs = await models.Gig.bulkCreate([
      {
        seller_clerk_id: users[0].clerk_id,
        category_id: categories[0].id,
        job_type_id: jobTypes[0].id,
        title: "Web Development Service",
        description: "Build a responsive website",
        starting_price: 200.0,
        delivery_time: 5,
        gig_image: "https://example.com/gig1.jpg",
        city: "Hanoi",
        country: "Việt Nam",
        status: "active",
      },
      {
        seller_clerk_id: users[0].clerk_id,
        category_id: categories[0].id,
        job_type_id: jobTypes[1].id,
        title: "API Integration",
        description: "Integrate APIs for your app",
        starting_price: 150.0,
        delivery_time: 3,
        gig_image: "https://example.com/gig2.jpg",
        city: "Hanoi",
        country: "Việt Nam",
        status: "active",
      },
      {
        seller_clerk_id: users[1].clerk_id,
        category_id: categories[1].id,
        job_type_id: jobTypes[0].id,
        title: "Graphic Design",
        description: "Create stunning visuals",
        starting_price: 100.0,
        delivery_time: 4,
        gig_image: "https://example.com/gig3.jpg",
        city: "New York",
        country: "USA",
        status: "active",
      },
    ]);

    // Tạo orders
    await models.Order.bulkCreate([
      {
        gig_id: gigs[0].id,
        buyer_clerk_id: users[2].clerk_id,
        seller_clerk_id: users[0].clerk_id,
        order_status: "completed",
        total_price: 200.0,
        order_date: "2025-01-04",
      },
      {
        gig_id: gigs[2].id,
        buyer_clerk_id: users[2].clerk_id,
        seller_clerk_id: users[1].clerk_id,
        order_status: "pending",
        total_price: 100.0,
        order_date: "2025-01-05",
      },
    ]);

    // Tạo reviews
    await models.Review.bulkCreate([
      {
        order_id: 1,
        gig_id: gigs[0].id,
        reviewer_clerk_id: users[2].clerk_id,
        rating: 5,
        comment: "Amazing web development service!",
      },
      {
        order_id: 2,
        gig_id: gigs[2].id,
        reviewer_clerk_id: users[2].clerk_id,
        rating: 4,
        comment: "Great graphic design!",
      },
    ]);

    // Tạo seeker_skills
    await models.SeekerSkill.bulkCreate([
      { clerk_id: users[2].clerk_id, skill_id: 1 }, // user_3 with JavaScript skill
      { clerk_id: users[2].clerk_id, skill_id: 2 }, // user_3 with Graphic Design skill
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