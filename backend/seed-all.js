const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const products = [
    // ===== SKIN CARE =====
    {
        name: "Radiance Vitamin C Serum",
        slug: "radiance-vitamin-c-serum",
        description: "Serum Vitamin C nồng độ cao 20% giúp làm sáng da, mờ thâm nám và chống oxy hóa mạnh mẽ. Kết hợp với Niacinamide và Hyaluronic Acid giúp da căng mọng, đều màu sau 4 tuần sử dụng.",
        price: 485000,
        discount_price: 389000,
        stock: 42,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
            "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600"
        ]),
        category: "skin-care",
        ingredients: "Ascorbic Acid 20%, Niacinamide, Hyaluronic Acid, Ferulic Acid, Vitamin E",
        tag: "Best Seller"
    },
    {
        name: "Hydra Boost Moisturizer",
        slug: "hydra-boost-moisturizer",
        description: "Kem dưỡng ẩm 72 giờ với công nghệ Aqua-Lock tiên tiến. Chứa Ceramide và Squalane tự nhiên giúp củng cố hàng rào bảo vệ da, giữ ẩm suốt cả ngày mà không gây bết dính.",
        price: 320000,
        discount_price: null,
        stock: 35,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600"
        ]),
        category: "skin-care",
        ingredients: "Ceramide NP, Squalane, Glycerin, Shea Butter, Niacinamide",
        tag: "New"
    },
    {
        name: "Deep Clean Foam Cleanser",
        slug: "deep-clean-foam-cleanser",
        description: "Sữa rửa mặt tạo bọt mịn, làm sạch sâu lỗ chân lông mà không làm khô da. Chiết xuất Trà Xanh và Tràm Trà kháng khuẩn nhẹ, phù hợp cho da dầu mụn. pH cân bằng 5.5.",
        price: 195000,
        discount_price: 165000,
        stock: 60,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
            "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600"
        ]),
        category: "skin-care",
        ingredients: "Green Tea Extract, Tea Tree Oil, Salicylic Acid, Glycerin, Aloe Vera",
        tag: "Popular"
    },
    {
        name: "Retinol Night Repair Cream",
        slug: "retinol-night-repair-cream",
        description: "Kem dưỡng ban đêm với Retinol 0.3% và Peptide tái tạo da khi ngủ. Giảm nếp nhăn, làm đều màu da và tăng độ đàn hồi. Dùng 2-3 lần/tuần để có kết quả tối ưu.",
        price: 620000,
        discount_price: 520000,
        stock: 28,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600",
            "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600"
        ]),
        category: "skin-care",
        ingredients: "Retinol 0.3%, Peptide Complex, Bakuchiol, Ceramide, Vitamin E",
        tag: "Best Seller"
    },
    {
        name: "SPF 50+ Sunscreen Gel",
        slug: "spf50-sunscreen-gel",
        description: "Kem chống nắng dạng gel trong suốt SPF 50+ PA++++. Kết cấu nhẹ như nước, không để lại vệt trắng, kháng nước 80 phút. Bảo vệ toàn diện trước UVA/UVB và ánh sáng xanh.",
        price: 275000,
        discount_price: null,
        stock: 0,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"
        ]),
        category: "skin-care",
        ingredients: "Zinc Oxide, Titanium Dioxide, Niacinamide, Hyaluronic Acid, Aloe Vera",
        tag: null
    },
    {
        name: "Rose Toner Balancing Mist",
        slug: "rose-toner-balancing-mist",
        description: "Toner xịt nước hoa hồng Bulgaria thuần khiết kết hợp Witch Hazel và Glycerin. Cân bằng pH da sau khi rửa mặt, thu nhỏ lỗ chân lông và cấp ẩm tức thì. Dùng được cả ngày.",
        price: 240000,
        discount_price: 198000,
        stock: 50,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?w=600",
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600"
        ]),
        category: "skin-care",
        ingredients: "Rose Water, Witch Hazel, Glycerin, Allantoin, Centella Asiatica",
        tag: "New"
    },
    // ===== HAIR CARE =====
    {
        name: "Argan Oil Shampoo",
        slug: "argan-oil-shampoo",
        description: "Dầu gội không sulfate sang trọng với dầu Argan Morocco nguyên chất. Làm sạch nhẹ nhàng đồng thời dưỡng sâu từng sợi tóc, cho mái tóc mềm mượt và bóng khỏe. Phù hợp tóc khô, hư tổn hoặc đã qua xử lý hóa chất.",
        price: 320000,
        discount_price: null,
        stock: 30,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600",
            "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600"
        ]),
        category: "hair-care",
        ingredients: "Argan Oil, Coconut Oil, Vitamin E, Aloe Vera, Keratin",
        tag: "Best Seller"
    },
    {
        name: "Keratin Hair Mask",
        slug: "keratin-hair-mask",
        description: "Mặt nạ ủ tóc chuyên sâu với Keratin protein và dầu tự nhiên. Phục hồi tổn thương do nhiệt và hóa chất. Dùng mỗi tuần 1 lần để có mái tóc salon ngay tại nhà.",
        price: 450000,
        discount_price: 380000,
        stock: 20,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600",
            "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600"
        ]),
        category: "hair-care",
        ingredients: "Keratin Protein, Shea Butter, Jojoba Oil, Biotin, Silk Amino Acids",
        tag: "Popular"
    },
    {
        name: "Rosemary Growth Serum",
        slug: "rosemary-growth-serum",
        description: "Serum dưỡng tóc với chiết xuất Hương Thảo và Biotin kích thích mọc tóc dày hơn. Kết cấu nhẹ, thấm nhanh, kích hoạt nang tóc và giảm rụng tóc hiệu quả.",
        price: 395000,
        discount_price: null,
        stock: 15,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600",
            "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600"
        ]),
        category: "hair-care",
        ingredients: "Rosemary Extract, Biotin, Castor Oil, Peppermint, Caffeine",
        tag: "New"
    },
    {
        name: "Silk Protein Conditioner",
        slug: "silk-protein-conditioner",
        description: "Dầu xả hàng ngày nhẹ nhàng với protein lụa thủy phân. Gỡ rối dễ dàng, tạo độ bóng như gương và bảo vệ tóc khỏi tác động môi trường. Phù hợp mọi loại tóc.",
        price: 280000,
        discount_price: 235000,
        stock: 40,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600",
            "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600"
        ]),
        category: "hair-care",
        ingredients: "Silk Proteins, Avocado Oil, Panthenol, Green Tea Extract, Honey",
        tag: null
    },
    {
        name: "Scalp Detox Scrub",
        slug: "scalp-detox-scrub",
        description: "Tẩy tế bào chết da đầu với hạt muối biển và tinh dầu Bạc Hà. Loại bỏ gàu, bã nhờn tích tụ và kích thích tuần hoàn máu da đầu. Dùng 1-2 lần/tuần trước khi gội.",
        price: 235000,
        discount_price: null,
        stock: 25,
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600",
            "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600"
        ]),
        category: "hair-care",
        ingredients: "Sea Salt, Peppermint Oil, Tea Tree, Salicylic Acid, Zinc Pyrithione",
        tag: "New"
    },
];

async function seedAll() {
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

seedAll();
