const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const products = [
    {
        name: "Shu Uemura Essence Absolue Nourishing Protective Hair Oil",
        slug: "shu-uemura-essence-absolue-nourishing-protective-hair-oil",
        description: "Tinh dầu dưỡng tóc bảo vệ chuyên sâu từ Shu Uemura, giàu dưỡng chất giúp tóc mềm mượt, bóng khỏe và chống lại tác động từ nhiệt và môi trường.",
        price: 1600000,
        discount_price: null,
        stock: 200,
        images: ["https://www.shuuemuraartofhair-usa.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-shu-master-catalog/default/dw6a95c2b9/2023/essence-absolue/hair-oil/alts/shu-uemura-art-of-hair-nourishing-protecting-hair-oil-benefits.jpg?sw=1152&sh=1152&sm=cut&sfrm=jpg&q=70"],
        category: "hair-care",
        ingredients: "",
        tag: null
    },
    {
        name: "Phục hồi tóc Olaplex No.3 Hair Perfector",
        slug: "phc-hi-tc-olaplex-no3-hair-perfector",
        description: "Sản phẩm phục hồi tóc hư tổn do hóa chất, tái tạo liên kết tóc bị đứt gãy, giúp tóc chắc khỏe và giảm gãy rụng hiệu quả.",
        price: 800000,
        discount_price: null,
        stock: 500,
        images: ["https://tse4.mm.bing.net/th/id/OIP.a2I7rxh60S1kz_rHrXwWfgHaHh?pid=Api&h=220&P=0"],
        category: "hair-care",
        ingredients: "",
        tag: null
    },
    {
        name: "Gel dưỡng Laneige Water Bank Blue Hyaluronic Gel Cream (50ml)",
        slug: "gel-dng-laneige-water-bank-blue-hyaluronic-gel-cream50ml",
        description: "Gel dưỡng cấp nước chứa hyaluronic acid thế hệ mới; phù hợp da dầu, hỗn hợp. Kết cấu nhẹ như gel giúp da luôn căng mọng suốt cả ngày.",
        price: 900000,
        discount_price: null,
        stock: 500,
        images: ["https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3knywl5xkwx8f"],
        category: "skin-care",
        ingredients: "",
        tag: null
    },
    {
        name: "Bộ gội xả Tsubaki Premium",
        slug: "b-gi-x-tsubaki-premium",
        description: "Bộ gội xả giàu tinh chất hoa trà; dưỡng tóc mềm mượt, phù hợp tóc khô xơ. Hương thơm tinh tế đặc trưng từ Nhật Bản.",
        price: 320000,
        discount_price: null,
        stock: 500,
        images: ["https://bizweb.dktcdn.net/100/431/784/products/4-7add8594-67c9-4739-ba54-2b7eefc2b9a4.png?v=1700273215017"],
        category: "hair-care",
        ingredients: "",
        tag: null
    },
    {
        name: "La Mer Crème de la Mer Moisturizing Cream",
        slug: "la-mer-crme-de-la-mer-moisturizing-cream",
        description: "Kem dưỡng phục hồi cao cấp giàu Miracle Broth™, dành cho da khô và nhạy cảm. Làm dịu, phục hồi và tái tạo da tổng thể.",
        price: 3000000,
        discount_price: null,
        stock: 200,
        images: ["https://www.spacenk.com/on/demandware.static/-/Library-Sites-spacenk-global/default/dwf91b7989/creme-de-la-mer-moisturizing-cream-review-space-nk.jpg"],
        category: "skin-care",
        ingredients: "",
        tag: null
    },
    {
        name: "Nước dưỡng tóc Double Rich Balancing Water Double Repair (250ml)",
        slug: "nc-dng-tc-double-rich-balancing-water-double-repair250ml",
        description: "Nước dưỡng tóc dạng xịt; cân bằng độ ẩm, phục hồi tóc yếu, dễ gãy. Tiện dụng khi dùng hàng ngày.",
        price: 65000,
        discount_price: null,
        stock: 500,
        images: ["https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lthiysmwygp6fd"],
        category: "hair-care",
        ingredients: "",
        tag: null
    },
    {
        name: "Tinh dầu dưỡng tóc Moroccanoil Treatment Original",
        slug: "tinh-du-dng-tc-moroccanoil-treatment-original",
        description: "Tinh dầu dưỡng tóc giàu argan oil; giảm xơ rối, tăng độ bóng mượt. Sản phẩm bestseller được các chuyên gia tóc tin dùng toàn cầu.",
        price: 700000,
        discount_price: null,
        stock: 500,
        images: ["https://salontocvip.com/upload/product/tinh-dau-duong-toc-moroccanoil-treatment-original-25ml-7199.jpg"],
        category: "hair-care",
        ingredients: "",
        tag: null
    },
    {
        name: "SK-II Facial Treatment Essence",
        slug: "sk-ii-facial-treatment-essence",
        description: '"Nước thần" chứa Pitera™, làm sáng da, cải thiện kết cấu da và giúp da trông trẻ hơn trông thấy. Sản phẩm huyền thoại của SK-II.',
        price: 1500000,
        discount_price: null,
        stock: 200,
        images: ["https://tse2.mm.bing.net/th/id/OIP.XzDJ3AOli7yyXH3rSgW5DwHaHa?pid=Api&h=220&P=0"],
        category: "skin-care",
        ingredients: "",
        tag: null
    },
    {
        name: "Ủ tóc Fino Shiseido Premium Touch",
        slug: "u-tc-fino-shiseido-premium-touch",
        description: "Mặt nạ ủ tóc giàu dưỡng chất; phục hồi tóc hư tổn, đặc biệt tóc nhuộm và khô xơ. Hàng Nhật chuẩn từ Shiseido.",
        price: 200000,
        discount_price: null,
        stock: 500,
        images: ["https://caostore.vn/wp-content/uploads/2023/03/b11e75c0df2a7911e0d1502a811c5689.jpg"],
        category: "hair-care",
        ingredients: "",
        tag: null
    },
    {
        name: "Dầu gội Moroccanoil Hydrating Shampoo",
        slug: "du-gi-moroccanoil-hydrating-shampoo",
        description: "Dầu gội dưỡng ẩm cao cấp từ Moroccanoil, dành cho tóc khô và thường. Giúp tóc mềm mượt, dễ chải và thơm lâu.",
        price: 900000,
        discount_price: null,
        stock: 500,
        images: ["http://vn.moroccanoil.com/cdn/shop/files/18_SHAMPOO_HYDRATING_250mL_v2_2dd83da6-8281-46fd-a561-7d4972645e7f.jpg?v=1687250215"],
        category: "hair-care",
        ingredients: "",
        tag: null
    },
    {
        name: "Sữa rửa mặt Ohui Miracle Moisture Cleansing Foam",
        slug: "sa-ra-mt-ohui-miracle-moisture-cleansing-foam",
        description: "Sữa rửa mặt tạo bọt, làm sạch sâu nhưng vẫn giữ ẩm; phù hợp da thường và khô. Công thức Hàn Quốc cao cấp từ Ohui.",
        price: 700000,
        discount_price: null,
        stock: 500,
        images: ["https://micofamily.vn/wp-content/uploads/2023/06/OHUI-Miracle-Moisture-Cleansing-Foam.jpg"],
        category: "skin-care",
        ingredients: "",
        tag: null
    },
    {
        name: "Nước tẩy trang Bioderma Sensibio H2O",
        slug: "nc-ty-trang-bioderma-sensibio-h20",
        description: "Nước tẩy trang nổi tiếng, công thức dành riêng cho da nhạy cảm, giúp giảm kích ứng và duy trì cân bằng da. Không cần rửa lại với nước.",
        price: 400000,
        discount_price: null,
        stock: 500,
        images: ["https://caostore.vn/wp-content/uploads/2023/03/b11e75c0df2a7911e0d1502a811c5689.jpg"],
        category: "skin-care",
        ingredients: "",
        tag: "Best Seller"
    },
    {
        name: "Kérastase Chronologiste Masque Intense Régénérant",
        slug: "krastase-chronologiste-masque-intense-rgnrant",
        description: "Mặt nạ dưỡng tóc chuyên sâu từ Kérastase, phục hồi toàn diện tóc lão hóa và hư tổn nặng, mang lại mái tóc trẻ trung và mềm mượt.",
        price: 2800000,
        discount_price: null,
        stock: 123,
        images: ["https://tse1.mm.bing.net/th/id/OIP.Tk4kesjAMcCG3wz3k3HYPgHaJQ?pid=Api&h=220&P=0"],
        category: "hair-care",
        ingredients: "",
        tag: "Best Seller"
    },
    {
        name: "Kem dưỡng Belif The True Cream Moisturizing Bomb",
        slug: "kem-dng-belif-the-true-cream-moisturizing-bomb",
        description: "Kem dưỡng ẩm mạnh mẽ, giúp da khô căng trở nên mềm mượt. Chứa thảo dược tự nhiên từ châu Âu, dưỡng ẩm 26 giờ liên tục.",
        price: 950000,
        discount_price: null,
        stock: 500,
        images: ["https://thefaceshop.com.sg/wp-content/uploads/2023/04/52101242-THE-TRUE-CREAM-MOISTURIZING-BOMB-25ml-2048x1619.jpg"],
        category: "skin-care",
        ingredients: "",
        tag: "Best Seller"
    },
    {
        name: "Nước tẩy trang L'Oreal Paris Revitalift Crystal Purifying Micellar Water (400ml)",
        slug: "nc-ty-trang-loreal-paris-revitalift-crystal-purifying-micellar-water400ml",
        description: "Tẩy trang kiêm làm sáng da, chứa nước tinh khiết và thành phần hỗ trợ kiểm soát dầu; thích hợp cho da dầu, hỗn hợp.",
        price: 250000,
        discount_price: null,
        stock: 500,
        images: ["https://adminbeauty.hvnet.vn/Upload/Files/nuoc-tay-trang-xanh.jpg"],
        category: "skin-care",
        ingredients: "",
        tag: null
    },
    {
        name: "La Mer The Tonic",
        slug: "la-mer-the-tonic",
        description: "Toner làm dịu, cân bằng da sau rửa mặt, phù hợp da nhạy cảm. Giúp da hấp thụ dưỡng chất tốt hơn và tăng sức sống cho làn da.",
        price: 2500000,
        discount_price: null,
        stock: 200,
        images: ["https://cdn.clothbase.com/uploads/19482b74-192f-47f5-92e2-29deb9fd4af5/the-essential-tonic-200-ml.jpg"],
        category: "skin-care",
        ingredients: "",
        tag: null
    },
    {
        name: "Philip B Peppermint Avocado Shampoo",
        slug: "philip-b-peppermint-avocado-shampoo",
        description: "Dầu gội làm sạch sâu, mang lại cảm giác mát lạnh và sảng khoái cho da đầu với tinh dầu bạc hà và bơ avocado dưỡng ẩm.",
        price: 1300000,
        discount_price: 1200000,
        stock: 200,
        images: ["https://www.thompsonalchemists.com/cdn/shop/files/lifestyle-Peppermint-Avocado-Shampoo-7oz-RGB-72dpi-800x1227_1800x1800.jpg?v=1694458468"],
        category: "hair-care",
        ingredients: "",
        tag: null
    },
    {
        name: "Nước tẩy trang Garnier Micellar Cleansing Water (400ml)",
        slug: "nc-ty-trang-garnier-micellar-cleansing-water400ml",
        description: "Nước tẩy trang dịu nhẹ, không cồn, phù hợp da nhạy cảm; làm sạch bụi bẩn, lớp trang điểm mà không gây khô da.",
        price: 180000,
        discount_price: null,
        stock: 500,
        images: ["https://adminbeauty.hvnet.vn/Upload/Files/a1-02112018044051.jpg"],
        category: "skin-care",
        ingredients: "",
        tag: null
    },
];

async function seedCsv() {
    const client = await pool.connect();
    let added = 0, skipped = 0;
    try {
        for (const p of products) {
            const existing = await client.query('SELECT id FROM products WHERE slug = $1', [p.slug]);
            if (existing.rows.length > 0) {
                console.log(`⏭️  Bỏ qua (đã tồn tại): ${p.name}`);
                skipped++;
                continue;
            }
            await client.query(
                `INSERT INTO products (name, slug, description, price, discount_price, stock, images, category, ingredients, tag)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [p.name, p.slug, p.description, p.price, p.discount_price, p.stock,
                 p.images, p.category, p.ingredients, p.tag]
            );
            console.log(`✅ Thêm: ${p.name}`);
            added++;
        }
        console.log(`\n🎉 Hoàn thành! Thêm mới: ${added} | Bỏ qua: ${skipped}`);
    } catch (err) {
        console.error("❌ Lỗi seed:", err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

seedCsv();



