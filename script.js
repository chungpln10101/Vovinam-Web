// 1. TÍNH NĂNG THÊM GIỎ HÀNG
let soLuongGioHang = 0;
const danhSachNutThem = document.querySelectorAll('.btn-add-cart');
const hienThiSoLuong = document.querySelector('.cart-count');

if (danhSachNutThem.length > 0) {
    danhSachNutThem.forEach(nut => {
        nut.addEventListener('click', function() {
            soLuongGioHang++;
            hienThiSoLuong.innerText = soLuongGioHang;
            alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
        });
    });
}

// 2. TÍNH NĂNG ĐIỂM DANH
const danhSachNutDiemDanh = document.querySelectorAll('.btn-status');
if (danhSachNutDiemDanh.length > 0) {
    danhSachNutDiemDanh.forEach(nut => {
        nut.addEventListener('click', function() {
            if (this.classList.contains('present')) {
                this.classList.remove('present');
                this.classList.add('absent');
                this.innerText = 'Vắng';
            } else {
                this.classList.remove('absent');
                this.classList.add('present');
                this.innerText = 'Có mặt';
            }
        });
    });
}

// 3. TÍNH NĂNG LỌC SẢN PHẨM
function locSanPham(loaiSanPham, nutDuocBam) {
    const danhSachSanPham = document.querySelectorAll('.product-card');
    danhSachSanPham.forEach(sanPham => {
        const nhanSanPham = sanPham.getAttribute('data-category');
        if (loaiSanPham === 'tat-ca' || nhanSanPham === loaiSanPham) {
            sanPham.style.display = 'block';
        } else {
            sanPham.style.display = 'none';
        }
    });

    const cacNut = document.querySelectorAll('.categories button');
    cacNut.forEach(nut => nut.classList.remove('active'));
    nutDuocBam.classList.add('active');
}

// 4. TÍNH NĂNG TÌM KIẾM
function timKiemSanPham() {
    let tuKhoa = document.getElementById('oTimKiem').value.toLowerCase();
    let danhSachSanPham = document.querySelectorAll('.product-card');
    
    danhSachSanPham.forEach(sanPham => {
        let tenSanPham = sanPham.querySelector('h3').innerText.toLowerCase();
        if (tenSanPham.includes(tuKhoa)) {
            sanPham.style.display = "block";
        } else {
            sanPham.style.display = "none";
        }
    });
}

// ========================================================
// XỬ LÝ ĐĂNG KÝ VÀ ĐĂNG NHẬP VỚI GOOGLE SHEETS
// ========================================================

// BẠN HÃY DÁN ĐƯỜNG LINK MỚI COPY TRÊN GOOGLE VÀO ĐÂY:
const MANG_LUOI_GOOGLE = 'https://script.google.com/macros/s/AKfycbzR2qq52Umui1UC0FeunIbkhuDNBde8tdOM4Q5AmKnXKWvLtcJeelNvcNfBRV5a1PhWfw/exec';

// 1. XỬ LÝ FORM ĐĂNG KÝ
const formDangKy = document.getElementById('formDangKyMoi');
if (formDangKy) {
    formDangKy.addEventListener('submit', function(e) {
        e.preventDefault();

        const hoTen = document.getElementById('dkHoTen').value.trim();
        const soDienThoai = document.getElementById('dkSoDienThoai').value.trim();
        const taiKhoan = document.getElementById('dkTaiKhoan').value.trim();
        const matKhau = document.getElementById('dkMatKhau').value;
        const nhapLaiMatKhau = document.getElementById('dkNhapLaiMatKhau').value;
        const cauLacBo = document.getElementById('dkCauLacBo').value;

        if (!cauLacBo) {
            alert("❌ Vui lòng chọn Câu lạc bộ của bạn!");
            return;
        }

        // Kiểm tra khớp mật khẩu
        if (matKhau !== nhapLaiMatKhau) {
            alert("❌ Hai mật khẩu không khớp nhau!");
            return;
        }

        const nutBam = formDangKy.querySelector('.btn-auth');
        nutBam.innerText = "Đang tạo tài khoản...";
        nutBam.disabled = true;

        const data = new URLSearchParams();
        data.append('action', 'register');
        data.append('hoTen', hoTen);
        data.append('soDienThoai', soDienThoai);
        data.append('taiKhoan', taiKhoan);
        data.append('matKhau', matKhau);
        data.append('clb', cauLacBo);

        fetch(MANG_LUOI_GOOGLE, { method: 'POST', body: data })
        .then(res => res.text())
        .then(ketQua => {
            if (ketQua === "TaiKhoanTonTai") {
                alert("⚠️ Tên tài khoản này đã có người sử dụng. Vui lòng chọn tên khác!");
            } else if (ketQua === "DangKyThanhCong") {
                alert("✅ Đăng ký thành công! Hãy đăng nhập để sử dụng.");
                window.location.href = 'dangnhap.html'; // Chuyển sang trang đăng nhập
            }
        })
        .catch(err => alert("Lỗi mạng! Không thể kết nối tới máy chủ."))
        .finally(() => {
            nutBam.innerText = "HOÀN TẤT ĐĂNG KÝ";
            nutBam.disabled = false;
        });
    });
}

// 2. XỬ LÝ FORM ĐĂNG NHẬP
const formDangNhap = document.getElementById('formDangNhap');
if (formDangNhap) {
    formDangNhap.addEventListener('submit', function(e) {
        e.preventDefault();

        const taiKhoan = document.getElementById('dnTaiKhoan').value.trim();
        const matKhau = document.getElementById('dnMatKhau').value;

        const nutBam = formDangNhap.querySelector('.btn-auth');
        nutBam.innerText = "Đang kiểm tra...";
        nutBam.disabled = true;

        const data = new URLSearchParams();
        data.append('action', 'login');
        data.append('taiKhoan', taiKhoan);
        data.append('matKhau', matKhau);

        fetch(MANG_LUOI_GOOGLE, { method: 'POST', body: data })
        .then(res => res.text())
        .then(ketQua => {
            if (ketQua === "SaiThongTin") {
                alert("❌ Sai tài khoản hoặc mật khẩu!");
            } else if (ketQua.includes("DangNhapThanhCong")) {
                const phanTach = ketQua.split("|");
                const tenNguoiDung = phanTach[1];
                const avatar = phanTach[2];
                const clbCuaNguoiDung = phanTach[3]; 
                const vaiTroNguoiDung = phanTach[4]; // <-- Lấy quyền Vai trò từ Google

                // BẬT HỘP THOẠI KIỂM TRA XEM GOOGLE GỬI GÌ VỀ
                alert(`✅ Đăng nhập thành công!\n👤 Tên: ${tenNguoiDung}\n🥋 CLB: ${clbCuaNguoiDung}\n👑 Vai trò lấy được: ${vaiTroNguoiDung}`);
                
                localStorage.setItem("daDangNhap", "true");
                localStorage.setItem("tenDangNhap", tenNguoiDung);
                localStorage.setItem("taiKhoanDangNhap", taiKhoan);
                localStorage.setItem("avatarDangNhap", avatar);
                localStorage.setItem("clbDangNhap", clbCuaNguoiDung); 
                localStorage.setItem("vaiTroDangNhap", vaiTroNguoiDung); // <-- Lệnh lưu quyền Admin
                
                window.location.href = 'index.html'; 
            }
        })
        .catch(err => alert("Lỗi mạng! Không thể kết nối tới máy chủ."))
        .finally(() => {
            nutBam.innerText = "ĐĂNG NHẬP NGAY";
            nutBam.disabled = false;
        });
    });
}

// ========================================================
// SỰ KIỆN TỰ ĐỔI THÔNG TIN SẢN PHẨM THEO ID (TRANG CHI TIẾT)
// ========================================================

// 1. Kho dữ liệu sản phẩm (Tí nữa tài khoản Admin sẽ chỉnh sửa trực tiếp vào kho này)
const khoSanPham = {
    "vo-phuc": {
        ten: "Võ Phục Vovinam Chuẩn Form",
        gia: "170.000 VNĐ",
        loai: "Võ phục",
        anh: "vo-phuc.jpg",
        moTa: "Võ phục Vovinam chất liệu vải Kaki bền bỉ, thấm hút mồ hôi cực tốt. Đường may chắc chắn, form áo chuẩn theo quy định của Liên đoàn Vovinam Việt Võ Đạo. Thích hợp cho võ sinh tập luyện cường độ cao và thi đấu."
    },
    "dai-vang": {
        ten: "Đai Vàng Vovinam Các Cấp",
        gia: "170.000 VNĐ",
        loai: "Phụ kiện",
        anh: "dai-vang.jpg",
        moTa: "Đai vàng dành cho võ sinh Vovinam đã qua kỳ thi thăng cấp đai chuẩn. Chất liệu vải mềm, bên trong có lớp lót dày dặn, đường chỉ may chần song song cực kỳ chắc chắn và đẹp mắt, không bị rách khi thắt."
    },
    "lam-dai": {
        ten: "Lam Đai Vovinam (Đai Xanh)",
        gia: "170.000 VNĐ",
        loai: "Phụ kiện",
        anh: "lam-dai.jpg",
        moTa: "Lam đai nhập khẩu, màu xanh dương chuẩn theo quy định võ phục. Vải dày, bền màu, không bị phai khi giặt. Thích hợp cho các bạn môn sinh mới nhập môn hoặc thăng cấp lớp Lam đai."
    },
    "kiem-nhom": {
        ten: "Kiếm Nhôm Vovinam Tập Luyện",
        gia: "170.000 VNĐ",
        loai: "Binh Khí",
        anh: "kiem-nhom.jpg",
        moTa: "Binh khí kiếm nhôm mô phỏng dành riêng cho các bài quyền Vovinam (như Tinh hoa lưỡng nghi kiếm pháp). Kiếm được mài nhẵn các cạnh, đảm bảo an toàn tuyệt đối khi tập luyện và biểu diễn, trọng lượng vừa tay."
    }
};

// ========================================================
// CÁ NHÂN HÓA TRANG CHỦ THEO CÂU LẠC BỘ VÀ VAI TRÒ
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    const daDangNhap = localStorage.getItem("daDangNhap");
    const clbCuaToi = localStorage.getItem("clbDangNhap");
    
    // BỌC THÉP: Cạo sạch khoảng trắng và ký tự tàng hình của biến vaiTro
    let vaiTro = localStorage.getItem("vaiTroDangNhap");
    if (vaiTro) {
        vaiTro = vaiTro.trim(); 
    }

    const danhSachTheCLB = document.querySelectorAll('.clb-card');
    const tieuDeCLB = document.getElementById('tieuDeCLB');

    if (danhSachTheCLB.length > 0) {
        // 1. NẾU LÀ ADMIN ĐANG ĐĂNG NHẬP -> Hiển thị tất cả
        if (daDangNhap === "true" && vaiTro === "Admin") {
            if(tieuDeCLB) {
                tieuDeCLB.innerText = "QUẢN LÝ CÁC CÂU LẠC BỘ (QUYỀN ADMIN)";
                tieuDeCLB.style.color = "#e53e3e"; // Chữ màu đỏ
            }

            danhSachTheCLB.forEach(the => {
                the.style.display = 'block';
                the.style.transform = 'none';
                the.style.border = '2px solid #e53e3e'; // Viền đỏ
            });
        } 
        // 2. NẾU LÀ VÕ SINH BÌNH THƯỜNG ĐANG ĐĂNG NHẬP -> Lọc đúng CLB
        else if (daDangNhap === "true" && clbCuaToi && clbCuaToi !== "") {
            if(tieuDeCLB) {
                tieuDeCLB.innerText = "CÂU LẠC BỘ BẠN ĐANG THAM GIA";
                tieuDeCLB.style.color = "#0056b3"; // Chữ màu xanh
            }

            danhSachTheCLB.forEach(the => {
                if (the.getAttribute('data-name') === clbCuaToi) {
                    the.style.display = 'block';
                    the.style.transform = 'scale(1.05)';
                    the.style.border = '2px solid #0056b3';
                } else {
                    the.style.display = 'none'; // Ẩn các CLB khác
                }
            });
        } 
        // 3. NẾU CHƯA ĐĂNG NHẬP (KHÁCH VÃNG LAI) -> Hiển thị tất cả mặc định
        else {
            if(tieuDeCLB) {
                tieuDeCLB.innerText = "CÁC CÂU LẠC BỘ TRỰC THUỘC";
                tieuDeCLB.style.color = "#0056b3";
            }

            danhSachTheCLB.forEach(the => {
                the.style.display = 'block';
                the.style.transform = 'none';
                the.style.border = 'none';
            });
        }
    }
});

// ========================================================
// HỆ THỐNG QUẢN TRỊ ADMIN
// ========================================================

function kiemTraAdmin() {
    const matKhauNhap = document.getElementById('adminPassword').value;
    const matKhauDung = "vovinam2026"; // MẬT KHẨU ADMIN CỦA BẠN

    if (matKhauNhap === matKhauDung) {
        // Đúng mật khẩu: Ẩn form đăng nhập, Hiện bảng điều khiển
        document.getElementById('adminLoginBox').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        // Hiển thị danh sách sản phẩm
        hienThiBangSanPham();
    } else {
        // Sai mật khẩu: Hiện cảnh báo đỏ
        document.getElementById('adminError').style.display = 'block';
    }
}

function dangXuatAdmin() {
    // Tải lại trang để khóa lại
    window.location.reload();
}

function hienThiBangSanPham() {
    const bang = document.getElementById('bangSanPham');
    let noiDungBang = "";

    // Duyệt qua từng sản phẩm trong kho dữ liệu (khoSanPham đã tạo ở bài trước)
    for (let id in khoSanPham) {
        const sp = khoSanPham[id];
        noiDungBang += `
            <tr>
                <td><img src="${sp.anh}" alt="${sp.ten}"></td>
                <td><strong>${id}</strong></td>
                <td style="color:#0056b3; font-weight:bold;">${sp.ten}</td>
                <td style="color:#e53e3e; font-weight:bold;">${sp.gia}</td>
                <td>
                    <button class="btn-edit" onclick="suaSanPham('${id}')">✏️ Sửa đổi</button>
                </td>
            </tr>
        `;
    }
    bang.innerHTML = noiDungBang;
}

function suaSanPham(id) {
    alert("Chức năng sửa thông tin cho sản phẩm: " + khoSanPham[id].ten + " sẽ được cập nhật ở phiên bản tiếp theo!");
}

// ========================================================
// HIỂN THỊ VÀ ĐỔI ẢNH ĐẠI DIỆN TRÊN THANH MENU
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    const daDangNhap = localStorage.getItem("daDangNhap");
    const tenDangNhap = localStorage.getItem("tenDangNhap");
    const taiKhoan = localStorage.getItem("taiKhoanDangNhap");
    let avatarDangNhap = localStorage.getItem("avatarDangNhap");
    
    // Nếu chưa có ảnh, tự động tạo một ảnh có chữ cái đầu của tên (Rất chuyên nghiệp!)
    if (!avatarDangNhap || avatarDangNhap.trim() === "") {
        avatarDangNhap = `https://ui-avatars.com/api/?name=${tenDangNhap}&background=0056b3&color=fff&rounded=true&bold=true`;
    }

    const khuVucNutMenu = document.querySelector('.auth-buttons');

    if (daDangNhap === "true" && khuVucNutMenu) {
        // KIỂM TRA QUYỀN ĐỂ BỔ SUNG MENU QUẢN TRỊ CHO ADMIN
        let vaiTroCheck = localStorage.getItem("vaiTroDangNhap");
        if (vaiTroCheck) vaiTroCheck = vaiTroCheck.trim();
        
        let nutQuanLyAdmin = "";
        if (vaiTroCheck === "Admin") {
            nutQuanLyAdmin = `<a href="quanlymonsinh.html" style="color: #e53e3e; font-weight: bold;">👥 Quản lý môn sinh</a>`;
        }

        khuVucNutMenu.innerHTML = `
            <div class="user-profile-dropdown">
                <div class="user-profile-toggle">
                    <label for="avatarUpload" style="cursor: pointer;" title="Nhấn để đổi ảnh đại diện">
                        <img src="${avatarDangNhap}" alt="Avatar" class="user-avatar" id="hienThiAvatar">
                    </label>
                    <input type="file" id="avatarUpload" accept="image/*" style="display: none;" onchange="capNhatAvatar(this)">
                    
                    <span style="color: #001f3f; font-weight: 800; font-size: 15px; cursor: pointer;">
                        Chào, <span style="color: #e53e3e;">${tenDangNhap}</span> ▾
                    </span>
                </div>
                
                <div class="user-dropdown-content">
                    ${nutQuanLyAdmin}
                    <a href="doimatkhau.html">🔐 Đổi mật khẩu</a>
                    <button class="logout-btn" onclick="dangXuatTaiKhoan()">🚪 Đăng xuất</button>
                </div>
            </div>
        `;
    }
});

// Hàm thu nhỏ ảnh tối đa và gửi dạng JSON lên Google Sheets
function capNhatAvatar(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 120; // Giảm xuống 120px cho ảnh siêu nhẹ (chỉ tầm 4KB)
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Nén chất lượng xuống 60% để chuỗi ký tự ngắn lại, Google nhận cực nhanh
                const base64Avatar = canvas.toDataURL('image/jpeg', 0.6); 

                // Kiểm tra xem trình duyệt đã nhớ tài khoản chưa
                const taiKhoan = localStorage.getItem('taiKhoanDangNhap');
                if (!taiKhoan) {
                    alert("⚠️ Hãy ĐĂNG XUẤT tài khoản ra và ĐĂNG NHẬP lại một lần để kích hoạt hệ thống đổi ảnh nhé!");
                    return;
                }

                // 1. Cập nhật giao diện lập tức trên web
                document.getElementById('hienThiAvatar').src = base64Avatar;
                localStorage.setItem('avatarDangNhap', base64Avatar); 

                // 2. Đóng gói dữ liệu dạng JSON gửi lên Google
                const gói_dữ_liệu = {
                    action: 'updateAvatar',
                    taiKhoan: taiKhoan,
                    avatar: base64Avatar
                };

                fetch(MANG_LUOI_GOOGLE, { 
                    method: 'POST', 
                    body: JSON.stringify(gói_dữ_liệu) // Gửi dạng chuỗi JSON
                })
                .then(res => res.text())
                .then(ketQua => {
                    if(ketQua === "LuuAnhThanhCong") {
                        alert("🎉 Chúc mừng! Ảnh đại diện đã được lưu vào Google Sheets thành công!");
                    } else {
                        alert("Máy chủ báo lỗi: " + ketQua);
                    }
                })
                .catch(err => alert("Lỗi kết nối mạng, không thể truyền ảnh lên Google!"));
            }
        }
        reader.readAsDataURL(file);
    }
}

// Hàm xử lý khi bấm nút Đăng Xuất (Đã gộp chuẩn)
function dangXuatTaiKhoan() {
    localStorage.clear(); // Xóa sạch sành sanh mọi dữ liệu (Tên, CLB, Quyền Admin...)
    window.location.href = 'index.html';
}

// ========================================================
// XỬ LÝ LƯU DANH SÁCH ĐIỂM DANH LÊN GOOGLE SHEETS
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    // 1. Tự động điền ngày hôm nay vào ô Date
    const oNgay = document.getElementById('ngayDiemDanh');
    if (oNgay) {
        const homNay = new Date().toISOString().split('T')[0];
        oNgay.value = homNay;
    }

    // 2. Bắt sự kiện khi bấm nút Lưu Điểm Danh
    const nutLuuDiemDanh = document.querySelector('.btn-save-attendance');
    if (nutLuuDiemDanh) {
        nutLuuDiemDanh.addEventListener('click', function() {
            const clbDaChon = document.querySelector('.filter-select').value;
            const ngayDiemDanh = document.getElementById('ngayDiemDanh').value;

            if (!ngayDiemDanh) {
                alert("⚠️ Vui lòng chọn ngày điểm danh trước khi lưu!");
                return;
            }

            nutLuuDiemDanh.innerText = "⏳ Đang gửi dữ liệu...";
            nutLuuDiemDanh.disabled = true;

            const mangVoSinh = [];
            
            // Lấy trạng thái điểm danh
            const trangThaiVS1 = document.querySelector('input[name="vs1"]:checked').value;
            mangVoSinh.push({ ten: "Phùng Lữ Ngọc Chung", trangThai: trangThaiVS1 });

            const trangThaiVS2 = document.querySelector('input[name="vs2"]:checked').value;
            mangVoSinh.push({ ten: "Nguyễn Thị Cẩm Tiên", trangThai: trangThaiVS2 });

            const trangThaiVS3 = document.querySelector('input[name="vs3"]:checked').value;
            mangVoSinh.push({ ten: "Trần Gia Huy", trangThai: trangThaiVS3 });

            const goiDuLieuDiemDanh = {
                action: 'saveAttendance',
                clb: clbDaChon,
                ngay: ngayDiemDanh,
                danhSach: mangVoSinh
            };

            fetch(MANG_LUOI_GOOGLE, {
                method: 'POST',
                body: JSON.stringify(goiDuLieuDiemDanh)
            })
            .then(res => res.text())
            .then(ketQua => {
                if (ketQua === "LuuDiemDanhThanhCong") {
                    alert("🎉 Tuyệt vời! Danh sách điểm danh đã được lưu trữ an toàn trên Google Sheets!");
                } else {
                    alert("Máy chủ trả về kết quả lạ: " + ketQua);
                }
            })
            .catch(err => alert("❌ Lỗi mạng! Không thể truyền dữ liệu điểm danh đi."))
            .finally(() => {
                nutLuuDiemDanh.innerText = "💾 LƯU DANH SÁCH ĐIỂM DANH";
                nutLuuDiemDanh.disabled = false;
            });
        });
    }
});

// ========================================================
// XỬ LÝ ĐỔI MẬT KHẨU TỰ ĐỘNG NHẬN DIỆN TÀI KHOẢN
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    const txtThongBaoTaikhoan = document.getElementById('txtTenTaiKhoanHienTai');
    const formDoiMK = document.getElementById('formDoiMatKhau');
    
    // Kiểm tra xem có đang đứng ở trang Đổi mật khẩu không
    if (formDoiMK) {
        const daDangNhap = localStorage.getItem("daDangNhap");
        const taiKhoanHienTai = localStorage.getItem("taiKhoanDangNhap");

        // Nếu người dùng chưa đăng nhập mà cố tình vào trang này
        if (daDangNhap !== "true" || !taiKhoanHienTai) {
            alert("⚠️ Bạn cần đăng nhập tài khoản trước khi thực hiện đổi mật khẩu!");
            window.location.href = 'dangnhap.html';
            return;
        }

        // Hiện tên tài khoản đang đổi lên màn hình cho người dùng yên tâm
        txtThongBaoTaikhoan.innerText = `Tài khoản đang thao tác: ${taiKhoanHienTai}`;

        // Lắng nghe sự kiện bấm nút cập nhật
        formDoiMK.addEventListener('submit', function(e) {
            e.preventDefault();

            const mkMoi = document.getElementById('mkMoi').value;
            const mkMoiNhapLai = document.getElementById('mkMoiNhapLai').value;

            if (mkMoi !== mkMoiNhapLai) {
                alert("❌ Hai mật khẩu mới nhập không khớp nhau!");
                return;
            }

            const nutBam = formDoiMK.querySelector('.btn-auth');
            nutBam.innerText = "⏳ Đang cập nhật...";
            nutBam.disabled = true;

            // Đóng gói JSON gửi đi kèm action 'changePassword'
            const goiDuLieu = {
                action: 'changePassword',
                taiKhoan: taiKhoanHienTai,
                matKhauMoi: mkMoi
            };

            fetch(MANG_LUOI_GOOGLE, {
                method: 'POST',
                body: JSON.stringify(goiDuLieu)
            })
            .then(res => res.text())
            .then(ketQua => {
                if (ketQua === "DoiMatKhauThanhCong") {
                    alert("🎉 Đổi mật khẩu thành công! Hệ thống sẽ đăng xuất để bạn đăng nhập lại bằng mật khẩu mới.");
                    dangXuatTaiKhoan(); // Hàm xóa session có sẵn của bạn để ép đăng nhập lại
                } else {
                    alert("Có lỗi xảy ra từ máy chủ: " + ketQua);
                }
            })
            .catch(err => alert("Lỗi kết nối mạng, không thể gửi yêu cầu đổi mật khẩu!"))
            .finally(() => {
                nutBam.innerText = "CẬP NHẬT MẬT KHẨU";
                nutBam.disabled = false;
            });
        });
    }
});

// ========================================================
// HỆ THỐNG ĐIỀU KHIỂN TRANG QUẢN LÝ MÔN SINH (ADMIN ONLY)
// ========================================================

// 1. Chặn người dùng thường truy cập trái phép
const dangNhapCheck = localStorage.getItem("daDangNhap");
let vaiTroCheck = localStorage.getItem("vaiTroDangNhap");
if (vaiTroCheck) vaiTroCheck = vaiTroCheck.trim();

if (window.location.pathname.includes("quanlymonsinh.html")) {
    if (dangNhapCheck !== "true" || vaiTroCheck !== "Admin") {
        alert("⛔ Quyền truy cập bị từ chối! Khu vực này chỉ dành riêng cho Ban Chủ Nhiệm (Admin).");
        window.location.href = "index.html";
    }
}

// 2. Hàm gọi Google Sheets để lấy danh sách môn sinh
function taiDanhSachMonSinh() {
    const bang = document.getElementById("bodyDanhSachMonSinh");
    if (!bang) return;

    bang.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color: #64748b; font-weight: bold;">⏳ Đang đồng bộ danh sách từ Google Sheets...</td></tr>`;

    fetch(MANG_LUOI_GOOGLE, {
        method: "POST",
        body: JSON.stringify({ action: "getUsers" })
    })
    .then(res => res.json())
    .then(danhSach => {
        window.khoLuuTruMonSinh = danhSach; // Lưu vào biến tạm toàn cục để lọc
        hienThiMonSinhRaBang(danhSach);
    })
    .catch(err => {
        bang.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color: #e53e3e; font-weight: bold;">❌ Lỗi kết nối mạng, không thể tải danh sách!</td></tr>`;
    });
}

// 3. Hàm hiển thị dữ liệu ra các dòng HTML
function hienThiMonSinhRaBang(danhSach) {
    const bang = document.getElementById("bodyDanhSachMonSinh");
    if (!bang) return;

    if (danhSach.length === 0) {
        bang.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color: #64748b;">Nơi này hiện tại trống trải...</td></tr>`;
        return;
    }

    let html = "";
    const taiKhoanAdminDangDung = localStorage.getItem("taiKhoanDangNhap");

    danhSach.forEach((ms, index) => {
        // Cơ chế an toàn: Không cho phép Admin tự xóa chính mình khi đang đăng nhập
        let hanhDongNut = `<button onclick="guiLenhXoaMonSinh('${ms.taiKhoan}', '${ms.hoTen}')" style="background: #e53e3e; color: white; border: none; padding: 8px 15px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s;">❌ Xóa</button>`;
        if (ms.taiKhoan === taiKhoanAdminDangDung) {
            hanhDongNut = `<span style="color: #10b981; font-weight: bold; font-style: italic;">Bạn đang dùng</span>`;
        }

        html += `
            <tr style="border-bottom: 1px solid #e2ebf4;">
                <td style="padding: 15px; text-align: center; font-weight: bold; color: #64748b;">${index + 1}</td>
                <td style="padding: 15px; color: #001f3f;"><strong>${ms.hoTen}</strong></td>
                <td style="padding: 15px; color: #475569;">${ms.soDienThoai}</td>
                <td style="padding: 15px;"><code>${ms.taiKhoan}</code></td>
                <td style="padding: 15px;"><span style="background: #e2ebf4; color: #0056b3; padding: 5px 10px; border-radius: 6px; font-size: 13px; font-weight: 800;">${ms.clb}</span></td>
                <td style="padding: 15px;"><span style="color: ${ms.vaiTro === 'Admin' ? '#e53e3e' : '#64748b'}; font-weight: 800;">${ms.vaiTro}</span></td>
                <td style="padding: 15px; text-align: center;">${hanhDongNut}</td>
            </tr>
        `;
    });
    bang.innerHTML = html;
}

// 4. Hàm xử lý gửi lệnh xóa lên Google Sheets
function guiLenhXoaMonSinh(taiKhoanXoa, tenXoa) {
    const xacNhan = confirm(`⚠️ CẢNH BÁO TỐI CAO:\nBạn có chắc chắn muốn xóa vĩnh viễn tài khoản của môn sinh [ ${tenXoa} ] khỏi hệ thống không?\nMôn sinh này sẽ không thể đăng nhập và mọi dữ liệu liên quan sẽ bị xóa!`);
    
    if (xacNhan) {
        fetch(MANG_LUOI_GOOGLE, {
            method: "POST",
            body: JSON.stringify({ action: "deleteUser", taiKhoanXoa: taiKhoanXoa })
        })
        .then(res => res.text())
        .then(ketQua => {
            if (ketQua === "XoaUserThanhCong") {
                alert(`✅ Đã loại bỏ tài khoản môn sinh [ ${tenXoa} ] thành công khỏi Google Sheets!`);
                taiDanhSachMonSinh(); // Tải lại bảng ngay lập tức để cập nhật số liệu mới
            } else {
                alert("Máy chủ báo lỗi: " + ketQua);
            }
        })
        .catch(err => alert("❌ Thao tác thất bại do lỗi đường truyền mạng!"));
    }
}

// 5. Lắng nghe sự kiện chạy tự động khi vào trang
window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("bodyDanhSachMonSinh")) {
        taiDanhSachMonSinh(); // Chạy hàm tải dữ liệu luôn khi mở trang
        
        // Thiết lập bộ lọc khi Admin bấm chọn CLB trên Dropdown
        const thanhLoc = document.getElementById("locDanhSachCLB");
        if (thanhLoc) {
            thanhLoc.addEventListener("change", function() {
                const chonCLB = this.value;
                if (!window.khoLuuTruMonSinh) return;
                
                if (chonCLB === "tat-ca") {
                    hienThiMonSinhRaBang(window.khoLuuTruMonSinh);
                } else {
                    const danhSachDaLoc = window.khoLuuTruMonSinh.filter(ms => ms.clb === chonCLB);
                    hienThiMonSinhRaBang(danhSachDaLoc);
                }
            });
        }
    }
});