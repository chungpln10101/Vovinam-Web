// ========================================================
// HỆ THỐNG GIỎ HÀNG THÔNG MINH (LƯU TRỮ VĨNH VIỄN)
// ========================================================

// 1. Khởi tạo giỏ hàng từ bộ nhớ trình duyệt (nếu chưa có thì tạo mảng rỗng)
let gioHang = JSON.parse(localStorage.getItem('gioHangVovinam')) || [];

// 2. Hàm cập nhật số lượng nhỏ hiển thị trên nút Giỏ hàng ở Cửa hàng
function capNhatSoLuongGioHang() {
    const hienThiSoLuong = document.querySelector('.cart-count'); // Nút giỏ hàng ở cuahang.html
    if (hienThiSoLuong) {
        let tongSoLg = 0;
        gioHang.forEach(sp => tongSoLg += sp.soLuong);
        hienThiSoLuong.innerText = tongSoLg;
    }
}

// 3. Hàm Thêm sản phẩm vào giỏ (Dùng chung cho mọi nơi)
function themVaoGio(idSanPham, size = "Mặc định", soLuong = 1) {
    const spKho = khoSanPham[idSanPham];
    if (!spKho) return;

    // Kiểm tra xem món này (cùng ID, cùng Size) đã có trong giỏ chưa
    const index = gioHang.findIndex(item => item.id === idSanPham && item.size === size);
    
    if (index > -1) {
        gioHang[index].soLuong += parseInt(soLuong); // Có rồi thì cộng dồn số lượng
    } else {
        gioHang.push({
            id: idSanPham,
            ten: spKho.ten,
            gia: spKho.gia, 
            anh: spKho.anh,
            size: size,
            soLuong: parseInt(soLuong)
        });
    }
    
    // Lưu lại vào bộ nhớ và báo cáo
    localStorage.setItem('gioHangVovinam', JSON.stringify(gioHang));
    capNhatSoLuongGioHang();
    alert("🛒 Đã thêm thành công:\n" + spKho.ten + " (Size: " + size + ") vào giỏ hàng!");
}

// 4. Hàm vẽ giao diện Giỏ hàng ra trang giohang.html
function hienThiTrangGioHang() {
    const khungDanhSach = document.getElementById('danhSachTrongGio');
    const txtTongTienGoc = document.getElementById('tongTienGoc');
    const txtTongTienThanhToan = document.getElementById('tongTienThanhToan');
    
    if (!khungDanhSach) return; // Nếu không đứng ở trang Giỏ hàng thì bỏ qua

    if (gioHang.length === 0) {
        khungDanhSach.innerHTML = `<p style="text-align:center; padding: 40px; color:#64748b; font-size: 18px; font-weight:bold;">Giỏ hàng của bạn đang trống.</p>`;
        if (txtTongTienGoc) txtTongTienGoc.innerText = "0 VNĐ";
        if (txtTongTienThanhToan) txtTongTienThanhToan.innerText = "0 VNĐ";
        return;
    }

    let html = "";
    let tongTien = 0;

    gioHang.forEach((item, index) => {
        // Biến chữ "170.000 VNĐ" thành số 170000 để máy tính cộng trừ được
        let giaSo = parseInt(item.gia.replace(/\./g, '').replace(' VNĐ', ''));
        tongTien += giaSo * item.soLuong;

        html += `
            <div class="cart-item">
                <img src="${item.anh}" alt="${item.ten}">
                <div class="item-details">
                    <h3>${item.ten}</h3>
                    <p>Size: ${item.size}</p>
                    <span class="item-price">${item.gia}</span>
                </div>
                <div class="item-actions">
                    <input type="number" value="${item.soLuong}" min="1" class="cart-qty" onchange="doiSoLuongTrongGio(${index}, this.value)">
                    <button class="btn-remove" onclick="xoaKhoiGio(${index})">🗑️ Xóa bỏ</button>
                </div>
            </div>
        `;
    });

    khungDanhSach.innerHTML = html;
    
    // TÍNH TOÁN GIẢM GIÁ & TỔNG TIỀN MỚI
    let tienDuocGiam = tongTien * (phanTramGiamGia / 100);
    let tienCanThanhToan = tongTien - tienDuocGiam;

    // Hiển thị lên web
    if (txtTongTienGoc) txtTongTienGoc.innerText = tongTien.toLocaleString('vi-VN') + " VNĐ";
    
    const dongGiamGia = document.getElementById('dongGiamGia');
    const txtSoTienGiam = document.getElementById('soTienGiam');

    if (phanTramGiamGia > 0 && dongGiamGia) {
        dongGiamGia.style.display = "flex"; // Hiện dòng giảm giá lên
        txtSoTienGiam.innerText = "- " + tienDuocGiam.toLocaleString('vi-VN') + " VNĐ";
    } else if (dongGiamGia) {
        dongGiamGia.style.display = "none"; // Ẩn đi nếu không có mã
    }

    if (txtTongTienThanhToan) txtTongTienThanhToan.innerText = tienCanThanhToan.toLocaleString('vi-VN') + " VNĐ";

    // LƯU LẠI TỔNG TIỀN CUỐI CÙNG ĐỂ LÚC BẤM ĐẶT HÀNG MÓC RA DÙNG
    window.tongTienCuoiCungSo = tienCanThanhToan;
    window.tongTienCuoiCungChuoi = tienCanThanhToan.toLocaleString('vi-VN') + " VNĐ";
}

// 5. Hàm đổi số lượng khi người dùng gõ số khác
function doiSoLuongTrongGio(index, soLuongMoi) {
    if (soLuongMoi < 1) soLuongMoi = 1;
    gioHang[index].soLuong = parseInt(soLuongMoi);
    localStorage.setItem('gioHangVovinam', JSON.stringify(gioHang));
    capNhatSoLuongGioHang();
    hienThiTrangGioHang(); // Vẽ lại giao diện để tiền thay đổi tức thì
}

// 6. Hàm xóa 1 món khỏi giỏ
function xoaKhoiGio(index) {
    gioHang.splice(index, 1);
    localStorage.setItem('gioHangVovinam', JSON.stringify(gioHang));
    capNhatSoLuongGioHang();
    hienThiTrangGioHang();
}

// ==========================================
// XỬ LÝ ĐỊA CHỈ & MÃ GIẢM GIÁ (TRANG GIỎ HÀNG)
// ==========================================

let phanTramGiamGia = 0; // Biến lưu % giảm giá

// Hàm thay đổi câu hỏi địa chỉ
function thayDoiHinhThucNhan() {
    const hinhThuc = document.getElementById('dhHinhThuc').value;
    const label = document.getElementById('labelDiaChi');
    const input = document.getElementById('dhDiaChi');

    if (hinhThuc === "TaiCLB") {
        label.innerText = "Chọn CLB bạn đang theo tập:";
        input.placeholder = "VD: CLB Nguyễn Huệ, CLB Y Ngông...";
    } else {
        label.innerText = "Nhập địa chỉ nhà riêng của bạn:";
        input.placeholder = "VD: Số 123, đường ABC, xã XYZ...";
    }
}

// Hàm kiểm tra mã giảm giá
function apDungGiamGia() {
    const maNhap = document.getElementById('maGiamGiaInput').value.trim().toUpperCase();
    const thongBao = document.getElementById('thongBaoGiamGia');

    // KHO MÃ GIẢM GIÁ CỦA BẠN (Bạn có thể thêm bớt tùy ý)
    const danhSachMa = {
        "VOVINAM10": 10,  // Giảm 10%
        "EAMDROH20": 20,  // Giảm 20%
        "CHUNGDZ": 50     // Giảm 50% (Mã bí mật cho Admin)
    };

    if (maNhap === "") {
        thongBao.innerText = "Vui lòng nhập mã giảm giá!";
        thongBao.style.color = "#e53e3e";
        phanTramGiamGia = 0;
    } else if (danhSachMa[maNhap]) {
        phanTramGiamGia = danhSachMa[maNhap];
        thongBao.innerText = `✅ Áp dụng thành công! Bạn được giảm ${phanTramGiamGia}%`;
        thongBao.style.color = "#10b981";
    } else {
        thongBao.innerText = "❌ Mã giảm giá không hợp lệ hoặc đã hết hạn!";
        thongBao.style.color = "#e53e3e";
        phanTramGiamGia = 0;
    }
    
    // Gọi lại hàm hiển thị giỏ hàng để nó tính lại tiền
    hienThiTrangGioHang(); 
}

// 7. Khởi chạy các tính năng khi trang web vừa tải xong
window.addEventListener('DOMContentLoaded', function() {
    capNhatSoLuongGioHang(); // Luôn cập nhật số lượng ở mọi trang
    hienThiTrangGioHang();   // Vẽ giỏ hàng nếu đang ở trang giohang.html

    // Bắt sự kiện bấm nút Thêm vào giỏ ở TRANG CHI TIẾT
    const nutThemChiTiet = document.querySelector('.btn-add-cart-large');
    if (nutThemChiTiet && window.location.pathname.includes("chitiet.html")) {
        nutThemChiTiet.addEventListener('click', function() {
            const idSanPham = new URLSearchParams(window.location.search).get('id');
            const sizeSelect = document.getElementById('size-select');
            const size = sizeSelect ? sizeSelect.options[sizeSelect.selectedIndex].text : "Mặc định";
            const qtyInput = document.querySelector('.qty-input');
            const soLuong = qtyInput ? qtyInput.value : 1;

            themVaoGio(idSanPham, size, soLuong);
        });
    }
});


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

// 1. Kho dữ liệu sản phẩm (Cập nhật giá chuẩn khớp với Cửa hàng)
const khoSanPham = {
    "vo-phuc": {
        ten: "Võ Phục Vovinam Chuẩn Form",
        gia: "180.000 VNĐ",
        loai: "Võ phục",
        anh: "vo-phuc.jpg", // Nhớ sửa tên ảnh cho khớp với máy bạn nếu cần
        moTa: "Võ phục Vovinam chất liệu vải Kaki bền bỉ, thấm hút mồ hôi cực tốt. Đường may chắc chắn, form áo chuẩn theo quy định của Liên đoàn Vovinam Việt Võ Đạo. Thích hợp cho võ sinh tập luyện cường độ cao và thi đấu."
    },
    "dai-vang": {
        ten: "Đai Vàng Vovinam Các Cấp",
        gia: "140.000 VNĐ",
        loai: "Phụ kiện",
        anh: "dai-vang.jpg",
        moTa: "Đai vàng dành cho võ sinh Vovinam đã qua kỳ thi thăng cấp đai chuẩn. Chất liệu vải mềm, bên trong có lớp lót dày dặn, đường chỉ may chần song song cực kỳ chắc chắn và đẹp mắt, không bị rách khi thắt."
    },
    "lam-dai": {
        ten: "Lam Đai Vovinam (Đai Xanh)",
        gia: "40.000 VNĐ",
        loai: "Phụ kiện",
        anh: "lam-dai.jpg",
        moTa: "Lam đai nhập khẩu, màu xanh dương chuẩn theo quy định võ phục. Vải dày, bền màu, không bị phai khi giặt. Thích hợp cho các bạn môn sinh mới nhập môn hoặc thăng cấp lớp Lam đai."
    },
    "kiem-nhom": {
        ten: "Kiếm Nhôm Vovinam Tập Luyện",
        gia: "420.000 VNĐ",
        loai: "Binh Khí",
        anh: "kiem-nhom.jpg",
        moTa: "Binh khí kiếm nhôm mô phỏng dành riêng cho các bài quyền Vovinam (như Tinh hoa lưỡng nghi kiếm pháp). Kiếm được mài nhẵn các cạnh, đảm bảo an toàn tuyệt đối khi tập luyện và biểu diễn, trọng lượng vừa tay."
    }
};

// 2. Tự động lấy ID từ đường link và đổ dữ liệu ra trang Chi tiết
window.addEventListener('DOMContentLoaded', function() {
    // Chỉ chạy đoạn mã này nếu đang đứng ở trang Chi tiết
    if (window.location.pathname.includes("chitiet.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const sanPhamId = urlParams.get('id');

        // Kiểm tra xem kho dữ liệu có tồn tại và có ID sản phẩm này không
        if (sanPhamId && typeof khoSanPham !== 'undefined' && khoSanPham[sanPhamId]) {
            const sp = khoSanPham[sanPhamId]; // Lôi món đồ từ kho ra

            // Nhận diện chính xác 100% các ID trên giao diện của bạn
            const anh = document.getElementById('anhChiTiet');
            const ten = document.getElementById('tenChiTiet');
            const gia = document.getElementById('giaChiTiet');
            const loai = document.getElementById('loaiChiTiet');
            const moTa = document.getElementById('moTaChiTiet');

            // Bơm dữ liệu vào
            if (anh) {
                anh.src = sp.anh;
                anh.alt = sp.ten;
            }
            if (ten) ten.innerText = sp.ten;
            if (gia) gia.innerText = sp.gia;
            if (loai) loai.innerText = sp.loai;
            if (moTa) moTa.innerText = sp.moTa;
            
        } else {
            console.log("Lỗi: Không tìm thấy ID sản phẩm hoặc kho dữ liệu chưa được tải!");
        }
    }
});

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

// 3. Hàm hiển thị dữ liệu ra các dòng HTML (ĐÃ CẬP NHẬT TÍNH NĂNG THĂNG CẤP ĐAI)
function hienThiMonSinhRaBang(danhSach) {
    const bang = document.getElementById("bodyDanhSachMonSinh");
    if (!bang) return;

    if (danhSach.length === 0) {
        bang.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 30px; color: #64748b;">Nơi này hiện tại trống trải...</td></tr>`;
        return;
    }

    let html = "";
    const taiKhoanAdminDangDung = localStorage.getItem("taiKhoanDangNhap");

    danhSach.forEach((ms, index) => {
        let hanhDongNut = `<button onclick="guiLenhXoaMonSinh('${ms.taiKhoan}', '${ms.hoTen}')" style="background: #e53e3e; color: white; border: none; padding: 8px 15px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s;">❌ Xóa</button>`;
        if (ms.taiKhoan === taiKhoanAdminDangDung) {
            hanhDongNut = `<span style="color: #10b981; font-weight: bold; font-style: italic;">Bạn đang dùng</span>`;
        }

        // Tạo danh sách các cấp đai để HLV bấm đổi trực tiếp
        const cacCapDai = ["Tự vệ", "Lam đai", "Lam đai I", "Lam đai II", "Lam đai III", "Hoàng đai", "Hoàng đai I", "Hoàng đai II", "Hoàng đai III"];
        let optionHtml = "";
        cacCapDai.forEach(dai => {
            let selected = (ms.capDai === dai) ? "selected" : "";
            optionHtml += `<option value="${dai}" ${selected}>🥋 ${dai}</option>`;
        });

        html += `
            <tr style="border-bottom: 1px solid #e2ebf4;">
                <td style="padding: 15px; text-align: center; font-weight: bold; color: #64748b;">${index + 1}</td>
                
                <td style="padding: 15px; color: #001f3f;"><strong>${ms.hoTen}</strong></td>
                
                <td style="padding: 15px; color: #475569;">${ms.soDienThoai}</td>
                
                <td style="padding: 15px; text-align: center;"><span style="background: #e2ebf4; color: #0056b3; padding: 5px 10px; border-radius: 6px; font-size: 13px; font-weight: 800;">${ms.clb}</span></td>
                
                <td style="padding: 15px; text-align: center;">
                    <select onchange="HLV_DoiCapDai('${ms.taiKhoan}', this.value, '${ms.hoTen}')" style="padding: 6px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-weight: bold; color: #0056b3; cursor: pointer; outline: none;">
                        ${optionHtml}
                    </select>
                </td>

                <td style="padding: 15px; text-align: center;"><span style="color: ${ms.vaiTro === 'Admin' ? '#e53e3e' : '#64748b'}; font-weight: 800;">${ms.vaiTro}</span></td>
                
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

// ========================================================
// XỬ LÝ NÚT XÁC NHẬN ĐẶT HÀNG (TẠO MÃ QR TỰ ĐỘNG)
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    const formDatHang = document.getElementById('formDatHang');
    
    // Hàm tạo mã đơn hàng ngẫu nhiên (VD: VN-8A3B)
    function taoMaDonHang() {
        const chu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const so = '0123456789';
        let ma = 'VN-';
        for (let i = 0; i < 2; i++) ma += chu.charAt(Math.floor(Math.random() * chu.length));
        for (let i = 0; i < 2; i++) ma += so.charAt(Math.floor(Math.random() * so.length));
        return ma;
    }

    if (formDatHang) {
        formDatHang.addEventListener('submit', function(e) {
            e.preventDefault(); 

            if (gioHang.length === 0) {
                alert("⚠️ Giỏ hàng của bạn đang trống!");
                return;
            }

            const hoTen = document.getElementById('dhHoTen').value.trim();
            const sdt = document.getElementById('dhSoDienThoai').value.trim();
            const diaChi = document.getElementById('dhDiaChi').value.trim();
            const nutBam = formDatHang.querySelector('.btn-checkout');

            // Tạo mã đơn hàng & Nội dung chuyển khoản
            const maDon = taoMaDonHang();
            // Cú pháp: Tên người dùng - Mã đơn hàng
            const noiDungChuyenKhoan = `${hoTen} - ${maDon}`; 

            let chiTietDon = "";
            let tongTienGocSo = 0; 
            
            gioHang.forEach(sp => {
                let giaSo = parseInt(sp.gia.replace(/\./g, '').replace(' VNĐ', ''));
                tongTienGocSo += giaSo * sp.soLuong;
                chiTietDon += `- ${sp.soLuong}x ${sp.ten} (Size: ${sp.size})\n`; 
            });

            // Báo cho Admin biết khách đã dùng mã giảm giá
            if (phanTramGiamGia > 0) {
                chiTietDon += `\n🎁 Đã dùng mã giảm giá: ${phanTramGiamGia}%`;
            }

            // Móc số tiền đã trừ khuyến mãi từ trên xuống để đưa vào QR Code
            let tongTienSo = window.tongTienCuoiCungSo || tongTienGocSo;
            let tongTienChuoi = window.tongTienCuoiCungChuoi || (tongTienGocSo.toLocaleString('vi-VN') + " VNĐ");

            nutBam.innerText = "🚀 ĐANG GỬI ĐƠN HÀNG...";
            nutBam.disabled = true;

            const goiDuLieu = {
                action: 'order',
                maDonHang: maDon, // Gửi mã đơn lên Google
                hoTen: hoTen,
                sdt: sdt,
                diaChi: diaChi,
                chiTiet: chiTietDon,
                tongTien: tongTienChuoi
            };

            fetch(MANG_LUOI_GOOGLE, {
                method: 'POST',
                body: JSON.stringify(goiDuLieu)
            })
            .then(res => res.text())
            .then(ketQua => {
                if (ketQua === "DatHangThanhCong") {
                    
                    // ==========================================
                    // CẤU HÌNH NGÂN HÀNG CỦA BẠN Ở ĐÂY
                    // ==========================================
                    const NGAN_HANG = "VCB"; // Thay bằng mã ngân hàng của bạn (VCB, TCB, BIDV...)
                    const SO_TAI_KHOAN = "7775922038"; // Số tài khoản của bạn
                    
                    // Tạo link ảnh QR động thông qua API của VietQR
                    const linkQRDong = `https://img.vietqr.io/image/${NGAN_HANG}-${SO_TAI_KHOAN}-compact2.png?amount=${tongTienSo}&addInfo=${encodeURIComponent(noiDungChuyenKhoan)}`;

                    // Gắn ảnh và thông tin vào Popup
                    const popup = document.getElementById('popupThanhToan');
                    const imgQR = popup.querySelector('.qr-code-container img');
                    const txtTien = document.getElementById('qrTongTien');
                    const txtNoiDung = document.getElementById('qrNoiDung');

                    if (popup) {
                        imgQR.src = linkQRDong; // Tráo ảnh tĩnh thành ảnh động
                        txtTien.innerText = tongTienChuoi; 
                        txtNoiDung.innerText = noiDungChuyenKhoan; 
                        popup.style.display = "flex"; 
                    }
                    
                    // Xóa giỏ hàng
                    gioHang = [];
                    localStorage.setItem('gioHangVovinam', JSON.stringify(gioHang));
                    capNhatSoLuongGioHang();
                    hienThiTrangGioHang();
                    formDatHang.reset(); 
                } else {
                    alert("Lỗi máy chủ: " + ketQua);
                }
            })
            .catch(err => alert("❌ Lỗi mạng! Không thể gửi đơn hàng."))
            .finally(() => {
                nutBam.innerText = "🚀 XÁC NHẬN ĐẶT HÀNG";
                nutBam.disabled = false;
            });
        });
    }
});

// 6. Hàm gọi Google Sheets để lấy danh sách Đơn hàng
function taiDanhSachDonHang() {
    const bangDonHang = document.getElementById("bodyDanhSachDonHang");
    if (!bangDonHang) return;

    bangDonHang.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; color: #64748b; font-weight: bold;">⏳ Đang tải dữ liệu Hóa đơn từ hệ thống...</td></tr>`;

    fetch(MANG_LUOI_GOOGLE, {
        method: "POST",
        body: JSON.stringify({ action: "getOrders" })
    })
    .then(res => res.json())
    .then(danhSach => {
        if (danhSach.length === 0) {
            bangDonHang.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; color: #64748b;">Chưa có đơn hàng nào phát sinh.</td></tr>`;
            return;
        }

        let html = "";
        danhSach.forEach(don => {
            // Cắt gọt ngày tháng cho đẹp
            let ngayDat = new Date(don.thoiGian).toLocaleString('vi-VN');

            html += `
                <tr style="border-bottom: 1px solid #e2ebf4;">
                    <td style="padding: 15px; color: #64748b; font-size: 14px;">🕒 ${ngayDat}</td>
                    <td style="padding: 15px;">
                        <strong style="color: #001f3f; font-size: 16px;">${don.hoTen}</strong><br>
                        <span style="font-size: 14px; color: #e53e3e; font-weight: bold;">📞 ${don.sdt}</span><br>
                        <span style="font-size: 13px; color: #64748b;">📍 ${don.diaChi}</span>
                    </td>
                    <td style="padding: 15px; font-size: 14px; white-space: pre-line; color: #475569; line-height: 1.6;">${don.chiTiet}</td>
                    <td style="padding: 15px; font-weight: 800; color: #e53e3e; font-size: 16px;">${don.tongTien}</td>
                    <td style="padding: 15px; text-align: center;">
                        <span style="background: #fef08a; color: #a16207; padding: 8px 15px; border-radius: 8px; font-size: 13px; font-weight: 800;">${don.trangThai}</span>
                    </td>
                </tr>
            `;
        });
        bangDonHang.innerHTML = html;
    })
    .catch(err => {
        bangDonHang.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; color: #e53e3e; font-weight: bold;">❌ Lỗi kết nối mạng, không thể tải danh sách đơn hàng!</td></tr>`;
    });
}

// 7. Kích hoạt tải Đơn hàng khi vào trang Quản lý
window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("bodyDanhSachDonHang")) {
        taiDanhSachDonHang(); // Tự động chạy khi mở trang Admin
    }
});

// Hàm đóng Popup QR Code
function dongPopupQR() {
    const popup = document.getElementById('popupThanhToan');
    if (popup) {
        popup.style.display = 'none';
        window.location.href = 'cuahang.html'; // Đóng xong thì đẩy khách về lại cửa hàng mua tiếp
    }
}

// ========================================================
// HỆ THỐNG ĐIỂM DANH TỰ ĐỘNG (ĐỒNG BỘ TỪ GOOGLE SHEETS)
// ========================================================

let khoMonSinhDiemDanh = []; // Kho lưu trữ tạm để lọc

// 1. Khởi chạy khi mở trang Điểm danh
window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("bodyDanhSachDiemDanh")) {
        // Tự điền ngày hôm nay
        const oNgay = document.getElementById('ngayDiemDanh');
        if (oNgay) oNgay.value = new Date().toISOString().split('T')[0];

        // Kéo danh sách toàn bộ môn sinh từ Sheets về
        layDuLieuMonSinhDeDiemDanh();
        
        // Bắt sự kiện cho nút Lưu Điểm Danh
        kichHoatNutLuuDiemDanh();
    }
});

// 2. Hàm gọi Google lấy dữ liệu môn sinh
function layDuLieuMonSinhDeDiemDanh() {
    const bang = document.getElementById("bodyDanhSachDiemDanh");
    
    // CÁI KHIÊN ĐÂY: Nếu không tìm thấy bảng điểm danh thì dừng lại ngay, không báo lỗi!
    if (!bang) return; 

    bang.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 30px; font-weight:bold; color:#64748b;">⏳ Đang tải danh sách võ sinh từ hệ thống...</td></tr>`;

    fetch(MANG_LUOI_GOOGLE, {
        method: "POST",
        body: JSON.stringify({ action: "getUsers" })
    })
    .then(res => res.json())
    .then(danhSach => {
        khoMonSinhDiemDanh = danhSach; 
        taiDanhSachDiemDanh(); 
    })
    .catch(err => {
        bang.innerHTML = `<tr><td colspan="4" style="text-align:center; color: #e53e3e; font-weight:bold;">❌ Lỗi tải dữ liệu. Hãy kiểm tra mạng!</td></tr>`;
    });
}

// 3. Hàm lọc theo CLB và vẽ HTML ra bảng (ĐÃ CÓ CẤP ĐAI + NÚT BẤM ĐẸP)
function taiDanhSachDiemDanh() {
    const bang = document.getElementById("bodyDanhSachDiemDanh");
    const clbChon = document.getElementById('clbDiemDanh').value;
    if(!bang) return;

    // Lọc ra những bạn thuộc CLB đang chọn và không phải là Admin
    const danhSachLoc = khoMonSinhDiemDanh.filter(ms => ms.clb === clbChon && ms.vaiTro !== "Admin");

    if (danhSachLoc.length === 0) {
        bang.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 30px; color:#64748b;">Chưa có môn sinh nào thuộc Câu lạc bộ này đăng ký hệ thống.</td></tr>`;
        return;
    }

    let html = "";
    danhSachLoc.forEach((ms, index) => {
        // Trạng thái mặc định
        const defaultStatus = 'Có mặt';
        const defaultClass = 'present';
        ms.lastAttendanceStatus = defaultStatus; // Ghi nhớ trạng thái

        // Logic gán Cấp đai và Màu sắc
        let capDai = ms.capDai || "Lam đai";
        let colorClass = "belt-lam-dai"; 
        
        if (capDai.includes("Hoàng")) colorClass = "belt-hoang-dai";
        else if (capDai.includes("Tự vệ")) colorClass = "belt-tu-ve";

        html += `
            <tr style="border-bottom: 1px dashed #e2ebf4;">
                <td style="padding: 15px; text-align: center; font-weight: bold; color: #64748b;">${index + 1}</td>
                <td style="padding: 15px; font-weight: bold; color: #001f3f; font-size: 16px;">${ms.hoTen}</td>
                
                <td style="padding: 15px; text-align: center;">
                    <span class="belt-badge ${colorClass}">${capDai}</span>
                </td>
                
                <td style="padding: 15px; text-align: center;">
                    <div style="display: flex; justify-content: center;">
                        <span class="status-toggle ${defaultClass}" onclick="toggleAttendanceStatus(this, '${ms.taiKhoan}')">
                            ${defaultStatus}
                        </span>
                    </div>
                </td>
            </tr>
        `;
    });
    bang.innerHTML = html;
}

// 4. Hàm đóng gói và Gửi điểm danh
function kichHoatNutLuuDiemDanh() {
    const nutLuu = document.querySelector('.btn-save-attendance');
    if (!nutLuu) return;

    nutLuu.addEventListener('click', function() {
        const clbDaChon = document.getElementById('clbDiemDanh').value;
        const ngayDiemDanh = document.getElementById('ngayDiemDanh').value;

        if (!ngayDiemDanh) {
            alert("⚠️ Vui lòng chọn ngày điểm danh!");
            return;
        }

        nutLuu.innerText = "⏳ Đang gửi dữ liệu...";
        nutLuu.disabled = true;

        const mangVoSinh = [];
        const danhSachLoc = khoMonSinhDiemDanh.filter(ms => ms.clb === clbDaChon && ms.vaiTro !== "Admin");

        // Quét từng môn sinh để lấy trạng thái mới nhất
        danhSachLoc.forEach(ms => {
            const trangThai = ms.lastAttendanceStatus || "Có mặt"; 
            mangVoSinh.push({ ten: ms.hoTen, trangThai: trangThai });
        });

        if(mangVoSinh.length === 0) {
             alert("❌ Không có dữ liệu môn sinh để lưu!");
             nutLuu.innerText = "💾 LƯU DANH SÁCH ĐIỂM DANH";
             nutLuu.disabled = false;
             return;
        }

        const goiDuLieu = {
            action: 'saveAttendance',
            clb: clbDaChon,
            ngay: ngayDiemDanh,
            danhSach: mangVoSinh
        };

        fetch(MANG_LUOI_GOOGLE, {
            method: 'POST',
            body: JSON.stringify(goiDuLieu)
        })
        .then(res => res.text())
        .then(ketQua => {
            if (ketQua === "LuuDiemDanhThanhCong") {
                alert(`🎉 Đã lưu Điểm danh ngày ${ngayDiemDanh} cho ${clbDaChon} thành công vào Google Sheets!`);
            } else {
                alert("Máy chủ báo lỗi: " + ketQua);
            }
        })
        .catch(err => alert("❌ Lỗi mạng! Không thể truyền dữ liệu điểm danh đi."))
        .finally(() => {
            nutLuu.innerText = "💾 LƯU DANH SÁCH ĐIỂM DANH";
            nutLuu.disabled = false;
        });
    });
}

// 5. Hàm toggle trạng thái điểm danh khi bấm vào nút
function toggleAttendanceStatus(element, userAccount) {
    // Đổi màu và đổi chữ
    if (element.classList.contains('present')) {
        element.classList.remove('present');
        element.classList.add('absent');
        element.innerText = 'Vắng';
    } else {
        element.classList.remove('absent');
        element.classList.add('present');
        element.innerText = 'Có mặt';
    }
    
    // Tìm môn sinh đó trong kho và cập nhật lại biến trạng thái để chuẩn bị gửi đi
    const ms = khoMonSinhDiemDanh.find(item => item.taiKhoan === userAccount);
    if (ms) {
        ms.lastAttendanceStatus = element.innerText; 
    }
}

// Hàm gửi lệnh đổi cấp đai lên Google Sheets khi HLV chọn đai khác
function HLV_DoiCapDai(taiKhoanNguoiDung, capDaiMoi, tenVoSinh) {
    fetch(MANG_LUOI_GOOGLE, {
        method: "POST",
        body: JSON.stringify({ action: "updateBelt", taiKhoan: taiKhoanNguoiDung, capDaiMoi: capDaiMoi })
    })
    .then(res => res.text())
    .then(ketQua => {
        if (ketQua === "CapNhatDaiThanhCong") {
            alert(`🥋 Đã thăng cấp đai cho võ sinh [ ${tenVoSinh} ] thành [ ${capDaiMoi} ] thành công trên Google Sheets!`);
            
            // Chỉ gọi hàm cập nhật điểm danh nếu bảng điểm danh thực sự tồn tại trên trang
            if (document.getElementById("bodyDanhSachDiemDanh") && typeof layDuLieuMonSinhDeDiemDanh === 'function') {
                layDuLieuMonSinhDeDiemDanh();
            }
        } else {
            alert("Lỗi máy chủ: " + ketQua);
        }
    })
    .catch(err => {
        console.error(err);
        alert("❌ Thao tác thất bại do lỗi mạng hoặc lỗi hệ thống!");
    });
}

// ========================================================
// XỬ LÝ FORM ĐĂNG TIN TỨC (QUẢN TRỊ ADMIN)
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    const formDangTin = document.getElementById('formDangTin');
    if (formDangTin) {
        formDangTin.addEventListener('submit', function(e) {
            e.preventDefault();

            const nutBam = formDangTin.querySelector('.btn-post-news');
            nutBam.innerText = "⏳ ĐANG ĐẨY LÊN MÁY CHỦ...";
            nutBam.disabled = true;

            const tieuDe = document.getElementById('tinTieuDe').value.trim();
            const chuyenMuc = document.getElementById('tinChuyenMuc').value;
            const linkAnh = document.getElementById('tinLinkAnh').value.trim();
            const noiDung = tinymce.get('tinNoiDung').getContent();

            if (noiDung === "") {
                alert("⚠️ Vui lòng viết nội dung cho bài báo!");
                nutBam.innerText = "🚀 ĐĂNG BÀI VIẾT LÊN TRANG CHỦ";
                nutBam.disabled = false;
                return;
            }

            const goiDuLieu = {
                action: 'addNews',
                tieuDe: tieuDe,
                chuyenMuc: chuyenMuc,
                linkAnh: linkAnh,
                noiDung: noiDung
            };

            fetch(MANG_LUOI_GOOGLE, {
                method: 'POST',
                body: JSON.stringify(goiDuLieu)
            })
            .then(res => res.text())
            .then(ketQua => {
                if (ketQua === "DangTinThanhCong") {
                    alert("🎉 Đăng tin tức thành công! Dữ liệu đã được lưu an toàn vào Google Sheets.");
                    formDangTin.reset(); 
                    tinymce.get('tinNoiDung').setContent(''); // Xóa nội dung trong khung Word
                } else {
                    alert("Lỗi máy chủ: " + ketQua);
                }
            })
            .catch(err => alert("❌ Lỗi mạng! Không thể đăng bản tin."))
            .finally(() => {
                nutBam.innerText = "🚀 ĐĂNG BÀI VIẾT LÊN TRANG CHỦ";
                nutBam.disabled = false;
            });
        });
    }
});