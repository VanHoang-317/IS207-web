-- ============================================================
-- FLUER - Script setup database + promote admin
-- Cách dùng:
--   1. Đăng ký tài khoản tại http://localhost:3000/register trước
--   2. Sửa biến :user_email phía dưới thành email của bạn
--   3. Chạy file này trong pgAdmin Query Tool (F5)
--   4. Logout & Login lại trên website để JWT có role='admin'
-- ============================================================

-- ===== Phần 1: Tạo bảng (chạy schema gốc) =====
-- Mở file schema.sql cùng thư mục và chạy trước nếu chưa có bảng:
-- D:\TỔNG HỢP\IS207\fluer\fluer\backend\src\models\schema.sql

-- ===== Phần 2: Kiểm tra bảng đã tồn tại =====
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ===== Phần 3: Xem các user hiện có =====
SELECT id, name, email, role, created_at
FROM users
ORDER BY created_at DESC;

-- ===== Phần 4: Promote tài khoản lên admin =====
-- !!! ĐỔI EMAIL BÊN DƯỚI THÀNH EMAIL ĐÃ ĐĂNG KÝ CỦA BẠN !!!
UPDATE users
SET role = 'admin'
WHERE email = 'nminhthoi53@gmail.com';

-- ===== Phần 5: Verify đã thành admin =====
SELECT email, role
FROM users
WHERE email = 'nminhthoi53@gmail.com';
-- Nếu role = 'admin' → OK, sang website logout + login lại
