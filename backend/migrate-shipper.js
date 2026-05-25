const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('🚀 Bắt đầu migration Shipper...\n');

        // 1. Thêm cột payment_method
        await client.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'cod'
        `);
        console.log('✅ Thêm cột: payment_method');

        // 2. Thêm cột payment_status
        await client.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending'
        `);
        console.log('✅ Thêm cột: payment_status');

        // 3. Thêm cột delivery_status
        await client.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(20) DEFAULT 'not_started'
        `);
        console.log('✅ Thêm cột: delivery_status');

        // 4. Thêm cột shipper_id
        await client.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS shipper_id UUID REFERENCES users(id) ON DELETE SET NULL
        `);
        console.log('✅ Thêm cột: shipper_id');

        // 5. Thêm cột delivered_at
        await client.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE
        `);
        console.log('✅ Thêm cột: delivered_at');

        // 6. Đồng bộ dữ liệu cũ từ cột status sang payment_status + delivery_status
        console.log('\n📦 Đồng bộ dữ liệu cũ...');

        // pending → chờ xử lý, COD mặc định
        await client.query(`
            UPDATE orders SET
                payment_method  = 'cod',
                payment_status  = 'pending',
                delivery_status = 'not_started'
            WHERE status = 'pending'
              AND payment_method IS NULL
        `);

        // paid → đã thanh toán online, chờ giao
        await client.query(`
            UPDATE orders SET
                payment_method  = 'online',
                payment_status  = 'paid',
                delivery_status = 'waiting'
            WHERE status = 'paid'
              AND payment_method IS NULL
        `);

        // shipped → đang giao
        await client.query(`
            UPDATE orders SET
                payment_method  = 'online',
                payment_status  = 'paid',
                delivery_status = 'delivering'
            WHERE status = 'shipped'
              AND payment_method IS NULL
        `);

        // delivered → đã giao
        await client.query(`
            UPDATE orders SET
                payment_method  = 'online',
                payment_status  = 'paid',
                delivery_status = 'delivered',
                delivered_at    = created_at
            WHERE status = 'delivered'
              AND payment_method IS NULL
        `);

        // cancelled
        await client.query(`
            UPDATE orders SET
                payment_status  = 'cancelled',
                delivery_status = 'not_started'
            WHERE status = 'cancelled'
              AND payment_method IS NULL
        `);

        console.log('✅ Đồng bộ dữ liệu cũ xong');

        // 7. Cập nhật schema.sql comment
        console.log('\n🎉 Migration hoàn thành!');
        console.log('   Bảng orders giờ có thêm: payment_method, payment_status, delivery_status, shipper_id, delivered_at');
        console.log('\n📌 Tiếp theo: Khởi động lại backend để áp dụng thay đổi');

    } catch (err) {
        console.error('❌ Migration lỗi:', err.message);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
