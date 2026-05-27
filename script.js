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
                // 1. Xóa giỏ hàng cũ vì đã đặt thành công
                localStorage.removeItem("gioHangVovinam"); 
                
                // 2. THIẾT LẬP THÔNG TIN NGÂN HÀNG CỦA BẠN (Sửa lại cho đúng nhé)
                const maNganHang = "VCB"; // Ví dụ: mb, vcb, techcombank, acb...
                const soTaiKhoan = "7775922038"; 
                const tenTaiKhoan = "PHUNG LU NGOC CHUNG"; 

                // 3. Tự động sinh Link ảnh VietQR từ API miễn phí (Lấy tổng tiền dạng số và mã đơn hàng)
                const tenKhongDau = tenTaiKhoan.replace(/ /g, '%20');
                const urlQR = `https://img.vietqr.io/image/${maNganHang}-${soTaiKhoan}-compact2.png?amount=${tongTien}&addInfo=${maDonHang}&accountName=${tenKhongDau}`;

                // 4. Bơm dữ liệu vào Popup QR
                document.getElementById("anhMaQR").src = urlQR;
                document.getElementById("txtSoTien").innerText = tongTienChu;
                document.getElementById("txtNoiDung").innerText = maDonHang;
                document.getElementById("txtNganHang").innerText = maNganHang.toUpperCase();
                document.getElementById("txtChuTaiKhoan").innerText = tenTaiKhoan;

                // 5. Bật Popup lên che màn hình
                document.getElementById("modalThanhToanQR").style.display = "flex";
                hienThiThongBao("Tạo đơn thành công! Vui lòng thanh toán.", "thanh-cong");
            } else {
                hienThiThongBao("❌ Lỗi máy chủ: " + ketQua, "loi");
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

// 1. Khởi chạy khi mở trang Điểm danh (Đã cấp quyền thông minh)
window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("bodyDanhSachDiemDanh")) {
        
        const daDangNhap = localStorage.getItem("daDangNhap");
        let vaiTro = localStorage.getItem("vaiTroDangNhap");
        let clbCuaToi = localStorage.getItem("clbDangNhap");
        if (vaiTro) vaiTro = vaiTro.trim();

        // 1. Nếu chưa đăng nhập (Khách lạ) -> Đá văng ra ngoài
        if (daDangNhap !== "true") {
            alert("⛔ Bạn cần đăng nhập để xem danh sách Câu lạc bộ!");
            window.location.href = "dangnhap.html";
            return; 
        }

        // 2. Nếu là môn sinh bình thường -> Khóa các chức năng quản trị
        if (vaiTro !== "Admin") {
            // Đổi tiêu đề cho phù hợp
            const tieuDe = document.querySelector('h2');
            if(tieuDe) tieuDe.innerHTML = "👥 DANH SÁCH MÔN SINH";

            // Ẩn nút Lưu điểm danh
            const nutLuu = document.querySelector('.btn-save-attendance');
            if(nutLuu) nutLuu.style.display = 'none';

            // Khóa ô chọn CLB (Bắt buộc chỉ xem được CLB của mình)
            const boxChonCLB = document.getElementById('clbDiemDanh');
            if(boxChonCLB) {
                boxChonCLB.value = clbCuaToi;
                boxChonCLB.disabled = true; // Làm mờ, cấm bấm chọn CLB khác
                boxChonCLB.style.background = "#f1f5f9";
            }
        }

        // Tự điền ngày hôm nay
        const oNgay = document.getElementById('ngayDiemDanh');
        if (oNgay) oNgay.value = new Date().toISOString().split('T')[0];

        // Kéo danh sách toàn bộ môn sinh từ Sheets về
        layDuLieuMonSinhDeDiemDanh();
        
        // Bắt sự kiện cho nút Lưu Điểm Danh (Nếu là Admin)
        if (vaiTro === "Admin") {
            kichHoatNutLuuDiemDanh();
        }
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

        // Kiểm tra xem ai đang xem bảng này
        let vaiTroHienTai = localStorage.getItem("vaiTroDangNhap");
        if (vaiTroHienTai) vaiTroHienTai = vaiTroHienTai.trim();

        // Xác định cột cuối cùng (Hành động hoặc Trạng thái)
        let cotCuoiCung = "";
        if (vaiTroHienTai === "Admin") {
            // Admin thì hiện nút Toggle xanh đỏ để điểm danh
            cotCuoiCung = `
                <div style="display: flex; justify-content: center;">
                    <span class="status-toggle ${defaultClass}" onclick="toggleAttendanceStatus(this, '${ms.taiKhoan}')">
                        ${defaultStatus}
                    </span>
                </div>
            `;
        } else {
            // Môn sinh thì chỉ hiện tích xanh tĩnh
            cotCuoiCung = `<span style="color: #10b981; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 5px;">✔ Đang sinh hoạt</span>`;
        }

        html += `
            <tr style="border-bottom: 1px dashed #e2ebf4;">
                <td style="padding: 15px; text-align: center; font-weight: bold; color: #64748b;">${index + 1}</td>
                <td style="padding: 15px; font-weight: bold; color: #001f3f; font-size: 16px;">${ms.hoTen}</td>
                <td style="padding: 15px; text-align: center;">
                    <span class="belt-badge ${colorClass}">${capDai}</span>
                </td>
                <td style="padding: 15px; text-align: center;">
                    ${cotCuoiCung}
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

// ========================================================
// CÁ NHÂN HÓA NÚT HÀNH ĐỘNG Ở TRANG CHI TIẾT CLB
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    const nutHanhDong = document.getElementById('nutHanhDongCLB');
    
    if (nutHanhDong) {
        const daDangNhap = localStorage.getItem("daDangNhap");
        let vaiTro = localStorage.getItem("vaiTroDangNhap");
        if (vaiTro) vaiTro = vaiTro.trim();

        if (daDangNhap === "true") {
            if (vaiTro === "Admin") {
                // Giao diện cho Admin
                nutHanhDong.innerText = "📋 QUẢN LÝ ĐIỂM DANH";
                nutHanhDong.href = "diemdanh.html";
                nutHanhDong.style.background = "#e53e3e"; 
                nutHanhDong.style.boxShadow = "0 5px 15px rgba(229,62,62,0.3)";
            } else {
                // Giao diện cho Môn sinh bình thường
                nutHanhDong.innerText = "👥 XEM DANH SÁCH MÔN SINH";
                nutHanhDong.href = "diemdanh.html";
                nutHanhDong.style.background = "#10b981"; // Màu xanh ngọc thân thiện
                nutHanhDong.style.boxShadow = "0 5px 15px rgba(16,185,129,0.3)";
            }
        }
    }
});

// ========================================================
// HỆ THỐNG ĐỒNG BỘ VÀ HIỂN THỊ TIN TỨC TỪ GOOGLE SHEETS
// ========================================================

// 1. Tự động chạy ngay khi người đọc vừa mở trang tintuc.html
window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("tinTieuDiemBox")) {
        taiTinTucTuGoogleSheets();
    }
});

// 2. Hàm gọi Google Sheets lôi dữ liệu báo chí về
function taiTinTucTuGoogleSheets() {
    const tieuDiemBox = document.getElementById("tinTieuDiemBox");
    const tinNhoBox = document.getElementById("danhSachTinNhoBox");

    fetch(MANG_LUOI_GOOGLE, {
        method: "POST",
        body: JSON.stringify({ action: "getNews" }) // Gọi đúng lệnh getNews trong Apps Script
    })
    .then(res => res.json())
    .then(danhSachTin => {
        if (danhSachTin.length === 0) {
            tieuDiemBox.innerHTML = `<p style="text-align: center; padding: 40px; color: #64748b; font-size: 18px; font-weight: bold;">📰 Tòa soạn hiện tại chưa xuất bản bài viết nào.</p>`;
            if (tinNhoBox) tinNhoBox.innerHTML = "";
            return;
        }

        // --- BÀI 1: XỬ LÝ BÀI VIẾT TIÊU ĐIỂM (BÀI MỚI NHẤT, ĐẦU MẢNG) ---
        const tin1 = danhSachTin[0];
        
        // Định dạng ngày tháng cho đẹp mắt
        const ngayDang1 = new Date(tin1.thoiGian).toLocaleDateString('vi-VN');

        tieuDiemBox.innerHTML = `
            <div class="main-news-card" style="display: flex; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); flex-wrap: wrap;">
                <div style="flex: 1.2; min-width: 300px; max-height: 450px; overflow: hidden;">
                    <img src="${tin1.linkAnh}" alt="${tin1.tieuDe}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center; min-width: 300px;">
                    <span style="background: #fee2e2; color: #ef4444; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; align-self: flex-start; margin-bottom: 15px;">
                        ${tin1.chuyenMuc}
                    </span>
                    <h2 style="color: #001f3f; font-size: 28px; font-weight: 800; line-height: 1.4; margin-bottom: 15px;">
                        ${tin1.tieuDe}
                    </h2>
                    <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">📅 Ngày đăng: ${ngayDang1}</p>
                    
                    <div class="news-content-body" style="color: #475569; line-height: 1.6; font-size: 15px; margin-bottom: 25px; max-height: 120px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">
                        ${tin1.noiDung}
                    </div>
                    
                    <button onclick="moXemChiTietTinBao(${0})" style="background: #0056b3; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; cursor: pointer; align-self: flex-start; transition: 0.3s;">Đọc tiếp ➔</button>
                </div>
            </div>
        `;

        // --- BÀI 2: XỬ LÝ CÁC BÀI VIẾT NHỎ CÒN LẠI (XẾP LƯỚI Ở DƯỚI) ---
        let htmlTinNho = "";
        
        for (let i = 1; i < danhSachTin.length; i++) {
            const tin = danhSachTin[i];
            const ngayDang = new Date(tin.thoiGian).toLocaleDateString('vi-VN');

            htmlTinNho += `
                <div class="sub-news-card" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
                    <div style="height: 200px; overflow: hidden;">
                        <img src="${tin.linkAnh}" alt="${tin.tieuDe}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="padding: 20px; flex: 1; display: flex; flex-direction: column;">
                        <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; align-self: flex-start; margin-bottom: 10px;">
                            ${tin.chuyenMuc}
                        </span>
                        <h3 style="color: #001f3f; font-size: 18px; font-weight: 700; line-height: 1.4; margin-bottom: 10px; flex: 1;">
                            ${tin.tieuDe}
                        </h3>
                        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 15px;">📅 ${ngayDang}</p>
                        <button onclick="moXemChiTietTinBao(${i})" style="background: transparent; color: #0056b3; border: 1px solid #0056b3; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; width: 100%;">Đọc chi tiết</button>
                    </div>
                </div>
            `;
        }
        
        if (tinNhoBox) tinNhoBox.innerHTML = htmlTinNho;
        
        // Lưu toàn bộ danh sách tin vào biến toàn cục để khi bấm nút xem chi tiết còn lôi ra được
        window.KHO_TIN_TUC_TOAN_CUC = danhSachTin;
    })
    .catch(err => {
        console.error(err);
        tieuDiemBox.innerHTML = `<p style="text-align: center; padding: 30px; font-weight: bold; color: #e53e3e;">❌ Thao tác tải tin tức thất bại do lỗi kết nối!</p>`;
    });
}

// 3. Hàm xử lý hiển thị hộp thoại POPUP khi người dùng bấm xem chi tiết bài báo
function moXemChiTietTinBao(index) {
    const tin = window.KHO_TIN_TUC_TOAN_CUC[index];
    if (!tin) return;

    // Tự động tạo một cái hộp thoại Popup phủ đen toàn màn hình
    const popup = document.createElement('div');
    popup.id = "popupDocTinBao";
    popup.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 20px;";

    const ngayDang = new Date(tin.thoiGian).toLocaleDateString('vi-VN');

    popup.innerHTML = `
        <div style="background: white; width: 100%; max-width: 800px; max-height: 85vh; border-radius: 20px; overflow-y: auto; padding: 40px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: slideUp 0.3s ease;">
            <button onclick="document.getElementById('popupDocTinBao').remove()" style="position: absolute; top: 20px; right: 20px; background: #f1f5f9; border: none; font-size: 20px; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-weight: bold; color: #64748b;">✕</button>
            
            <span style="background: #f1f5f9; color: #0056b3; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">${tin.chuyenMuc}</span>
            <h1 style="color: #001f3f; font-size: 28px; font-weight: 800; margin-top: 15px; margin-bottom: 10px; line-height: 1.3;">${tin.tieuDe}</h1>
            <p style="color: #94a3b8; font-size: 13px; margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px;">📅 Ghi nhận ngày: ${ngayDang} | Tòa soạn VOVINAM EA M'DROH</p>
            
            <div style="width: 100%; max-height: 400px; overflow: hidden; border-radius: 12px; margin-bottom: 30px;">
                <img src="${tin.linkAnh}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>

            <div class="news-main-rich-text" style="color: #334155; line-height: 1.8; font-size: 16px;">
                ${tin.noiDung}
            </div>
        </div>
    `;

    // Thêm hiệu ứng CSS chuyển động mượt mà cho popup
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .news-main-rich-text h2 { color: #001f3f; font-size: 22px; margin-top: 25px; margin-bottom: 15px; font-weight: 800; }
        .news-main-rich-text h3 { color: #0056b3; font-size: 19px; margin-top: 20px; margin-bottom: 12px; font-weight: 700; }
        .news-main-rich-text p { margin-bottom: 15px; text-align: justify; }
        .news-main-rich-text strong { font-weight: bold; color: #001f3f; }
        .news-main-rich-text ul, .news-main-rich-text ol { padding-left: 20px; margin-bottom: 15px; }
    `;
    document.head.appendChild(style);

    document.body.appendChild(popup);
}

// ========================================================
// ĐỒNG BỘ MENU THẢ XUỐNG (DROPDOWN) THEO PHÂN QUYỀN
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    const linkDiemDanh = document.getElementById('navDiemDanhCLB');
    const linkThongTin = document.getElementById('navThongTinCLB');
    
    // Nếu tìm thấy các nút menu này trên trang thì mới xử lý
    if (linkDiemDanh || linkThongTin) {
        const daDangNhap = localStorage.getItem("daDangNhap");
        const clbCuaToi = localStorage.getItem("clbDangNhap"); // Lấy tên CLB của môn sinh
        let vaiTro = localStorage.getItem("vaiTroDangNhap");
        if (vaiTro) vaiTro = vaiTro.trim();

        // Bản đồ định tuyến: Khớp tên CLB trên Sheets với file HTML tương ứng trên máy
        const khoLinkCLB = {
            "CLB Lê Hữu Trác": "clb-lehuutrac.html",
            "CLB Nguyễn Huệ": "clb-nguyenhue.html",
            "CLB Hùng Vương": "clb-hungvuong.html",
            "CLB Y Ngông": "clb-yngong.html",
            "CLB Nội Trú": "clb-noitru.html"
        };

        // TRƯỜNG HỢP 1: ĐÃ ĐĂNG NHẬP
        if (daDangNhap === "true") {
            if (vaiTro === "Admin") {
                // Điều hướng dành cho HLV/Ban Chủ Nhiệm
                if (linkDiemDanh) {
                    linkDiemDanh.innerText = "🎯 Quản lý điểm danh";
                    linkDiemDanh.href = "diemdanh.html";
                }
                if (linkThongTin) {
                    linkThongTin.innerText = "ℹ️ Xem tất cả CLB";
                    linkThongTin.href = "index.html#tieuDeCLB"; // Cuộn xuống danh sách CLB ở trang chủ
                }
            } else {
                // Điều hướng dành riêng cho MÔN SINH (User)
                if (linkDiemDanh) {
                    linkDiemDanh.innerText = "👥 Xem danh sách lớp";
                    linkDiemDanh.href = "diemdanh.html";
                }
                if (linkThongTin) {
                    linkThongTin.innerText = "ℹ️ Thông tin CLB của tôi";
                    // Tự động tìm file tương ứng với CLB của bạn môn sinh đó, nếu không có thì trả về trang chủ
                    linkThongTin.href = khoLinkCLB[clbCuaToi] || "index.html"; 
                }
            }
        } 
        // TRƯỜNG HỢP 2: KHÁCH VÃNG LAI (CHƯA ĐĂNG NHẬP)
        else {
            if (linkDiemDanh) {
                linkDiemDanh.innerText = "🔐 Đăng nhập để xem lớp";
                linkDiemDanh.href = "dangnhap.html";
            }
            if (linkThongTin) {
                linkThongTin.innerText = "ℹ️ Danh sách các CLB";
                linkThongTin.href = "index.html"; // Chỉ hướng về trang chủ để xem tổng quan
            }
        }
    }
});

// ========================================================
// ĐỒNG BỘ TIN TỨC RA TRANG CHỦ (INDEX.HTML)
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    const tinTucTrangChuBox = document.getElementById("tinTucTrangChuBox");
    if (tinTucTrangChuBox) {
        
        // Gọi API lên Google Sheets để lấy danh sách bài viết
        fetch(MANG_LUOI_GOOGLE, {
            method: "POST",
            body: JSON.stringify({ action: "getNews" })
        })
        .then(res => res.json())
        .then(danhSachTin => {
            if (danhSachTin.length === 0) {
                tinTucTrangChuBox.innerHTML = `<p style="text-align: center; color: #64748b;">Tòa soạn hiện tại chưa xuất bản bài viết nào.</p>`;
                return;
            }

            // Chỉ cắt lấy 2 bài mới nhất (đứng đầu mảng) để hiện ra trang chủ
            const tinMoiNhat = danhSachTin.slice(0, 2);
            let html = "";

            tinMoiNhat.forEach(tin => {
                // KỸ THUẬT QUAN TRỌNG: Dùng Regex xóa sạch các thẻ HTML (như <h2>, <strong>) 
                // để tạo ra một đoạn trích dẫn toàn chữ sạch sẽ, không bị vỡ giao diện.
                let trichDan = tin.noiDung.replace(/<[^>]+>/g, '');

                html += `
                    <a href="tintuc.html" style="display: flex; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.05); margin-bottom: 20px; text-decoration: none; color: inherit; transition: 0.3s; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px; max-width: 300px; height: 180px;">
                            <img src="${tin.linkAnh}" alt="${tin.tieuDe}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        
                        <div style="padding: 20px 25px; flex: 2; min-width: 250px; display: flex; flex-direction: column; justify-content: center;">
                            <span style="color: #e53e3e; font-size: 13px; font-weight: bold; margin-bottom: 8px;">${tin.chuyenMuc}</span>
                            <h3 style="color: #0056b3; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 10px; line-height: 1.4;">${tin.tieuDe}</h3>
                            <p style="color: #64748b; font-size: 14px; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5;">
                                ${trichDan}
                            </p>
                        </div>
                    </a>
                `;
            });

            // Thêm nút "Xem tất cả" trỏ về trang Tin Tức
            html += `
                <div style="text-align: center; margin-top: 30px;">
                    <a href="tintuc.html" style="display: inline-block; padding: 12px 35px; background: #e2ebf4; color: #0056b3; font-size: 15px; font-weight: bold; border-radius: 30px; text-decoration: none; transition: background 0.3s;">
                        Xem tất cả bảng tin ➔
                    </a>
                </div>
            `;
            tinTucTrangChuBox.innerHTML = html;
        })
        .catch(err => {
            tinTucTrangChuBox.innerHTML = `<p style="text-align: center; color: #e53e3e; font-weight: bold;">❌ Lỗi kết nối! Không thể đồng bộ tin tức.</p>`;
        });
    }
});

// ========================================================
// HỆ THỐNG QUẢN LÝ ĐƠN HÀNG (DÀNH CHO ADMIN) CHUẨN 100%
// ========================================================

window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("bodyDanhSachDonHang")) {
        taiDanhSachDonHang();
    }
});

function taiDanhSachDonHang() {
    const bang = document.getElementById("bodyDanhSachDonHang");
    bang.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; font-weight:bold; color:#64748b;">⏳ Đang tải danh sách đơn hàng...</td></tr>`;

    fetch(MANG_LUOI_GOOGLE, {
        method: "POST",
        body: JSON.stringify({ action: "getOrders" }) 
    })
    .then(res => res.json())
    .then(danhSachDon => {
        if (danhSachDon.length === 0) {
            bang.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; color: #64748b;">Chưa có đơn đặt hàng nào trong hệ thống.</td></tr>`;
            return;
        }

        let html = "";
        const cacTrangThai = ["Chờ xử lý", "Đang chuẩn bị", "Đang giao hàng", "Đã hoàn thành", "Đã hủy"];

        danhSachDon.forEach(don => {
            const ngayDat = new Date(don.thoiGian).toLocaleString('vi-VN'); 
            
            let optionHtml = "";
            cacTrangThai.forEach(tt => {
                let selected = (don.trangThai === tt) ? "selected" : "";
                optionHtml += `<option value="${tt}" ${selected}>${tt}</option>`;
            });

            let mauNen = "#fef08a"; 
            if (don.trangThai === "Đã hoàn thành") mauNen = "#bbf7d0"; 
            if (don.trangThai === "Đã hủy") mauNen = "#fecaca"; 
            if (don.trangThai === "Đang giao hàng" || don.trangThai === "Đang chuẩn bị") mauNen = "#bfdbfe"; 

            html += `
                <tr style="border-bottom: 1px dashed #e2ebf4;">
                    <td style="padding: 15px; color: #64748b; font-size: 13px;">🕒 ${ngayDat}</td>
                    <td style="padding: 15px;">
                        <strong style="color: #001f3f;">${don.hoTen}</strong><br>
                        <span style="color: #e53e3e; font-weight: bold; font-size: 13px;">📞 ${don.sdt}</span><br>
                        <span style="color: #64748b; font-size: 13px;">📍 ${don.diaChi}</span><br>
                        <code style="background: #e2ebf4; padding: 2px 5px; border-radius: 4px; font-size: 12px; margin-top: 5px; display: inline-block;">Mã: ${don.maDonHang}</code>
                    </td>
                    <td style="padding: 15px; font-size: 14px; color: #475569; white-space: pre-wrap;">${don.chiTiet}</td>
                    <td style="padding: 15px; color: #e53e3e; font-weight: bold;">${don.tongTien}</td>
                    <td style="padding: 15px; text-align: center;">
                        <select onchange="HLV_DoiTrangThaiDon('${don.maDonHang}', this.value)" style="padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-weight: bold; color: #001f3f; cursor: pointer; outline: none; background-color: ${mauNen};">
                            ${optionHtml}
                        </select>
                    </td>
                </tr>
            `;
        });
        bang.innerHTML = html;
    })
    .catch(err => {
        bang.innerHTML = `<tr><td colspan="5" style="text-align:center; color: #e53e3e; font-weight:bold;">❌ Lỗi tải dữ liệu. Hãy kiểm tra mạng!</td></tr>`;
    });
}

// KHỐI LỆNH NÀY SẼ CHẠY KHI ADMIN BẤM ĐỔI TRẠNG THÁI
function HLV_DoiTrangThaiDon(maDonHang, trangThaiMoi) {
    // 1. Hiện hộp thoại hỏi lại cho chuyên nghiệp
    const xacNhan = confirm(`Bạn có chắc chắn muốn chuyển đơn hàng [ ${maDonHang} ] sang trạng thái: "${trangThaiMoi}" không?`);
    if (!xacNhan) {
        taiDanhSachDonHang(); // Trả lại trạng thái cũ nếu Admin đổi ý bấm Hủy
        return;
    }

    // 2. Nếu đồng ý thì mới gửi lên máy chủ
    fetch(MANG_LUOI_GOOGLE, {
        method: "POST",
        body: JSON.stringify({ action: "updateOrderStatus", maDonHang: maDonHang, trangThaiMoi: trangThaiMoi })
    })
    .then(res => res.text())
    .then(ketQua => {
        if (ketQua === "CapNhatDonThanhCong") {
            alert(`📦 Đã cập nhật thành công!`);
            taiDanhSachDonHang(); // Tải lại bảng để nó đổi màu nền cái nút
        } else {
            alert("Lỗi máy chủ: " + ketQua);
        }
    })
    .catch(err => alert("❌ Thao tác thất bại do lỗi mạng!"));
}

// ========================================================
// TẢI LỊCH SỬ MUA HÀNG CHO MÔN SINH (lichsudonhang.html)
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("bodyLichSuDonHang")) {
        const daDangNhap = localStorage.getItem("daDangNhap");
        const hoTenNguoiDung = localStorage.getItem("tenDangNhap"); 

        if (daDangNhap !== "true" || !hoTenNguoiDung) {
            alert("⛔ Bạn cần đăng nhập để xem lịch sử mua hàng!");
            window.location.href = "dangnhap.html";
            return;
        }

        taiLichSuDonHangCuaToi(hoTenNguoiDung);
    }
});

function taiLichSuDonHangCuaToi(hoTen) {
    const bang = document.getElementById("bodyLichSuDonHang");
    bang.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 30px; font-weight:bold; color:#64748b;">⏳ Đang dò tìm lịch sử mua hàng của bạn...</td></tr>`;

    fetch(MANG_LUOI_GOOGLE, {
        method: "POST",
        body: JSON.stringify({ action: "getMyOrders", hoTen: hoTen })
    })
    .then(res => res.json())
    .then(danhSach => {
        if (danhSach.length === 0) {
            bang.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 40px; color: #64748b; font-size: 16px;">Bạn chưa đặt mua món đồ nào. <br><a href="cuahang.html" style="color: #0056b3; font-weight: bold; text-decoration: none; margin-top: 10px; display: inline-block;">🛒 Tham quan cửa hàng ngay</a></td></tr>`;
            return;
        }

        let html = "";
        danhSach.forEach(don => {
            const ngayDat = new Date(don.thoiGian).toLocaleString('vi-VN');
            
            // Xử lý màu sắc hiển thị cho Trạng thái
            let mauChu = "#ca8a04"; let mauNen = "#fef08a"; // Vàng (Chờ xử lý)
            if (don.trangThai === "Đã hoàn thành") { mauChu = "#16a34a"; mauNen = "#dcfce7"; }
            if (don.trangThai === "Đã hủy") { mauChu = "#dc2626"; mauNen = "#fee2e2"; }
            if (don.trangThai === "Đang giao hàng" || don.trangThai === "Đang chuẩn bị") { mauChu = "#2563eb"; mauNen = "#dbeafe"; }

            html += `
                <tr style="border-bottom: 1px dashed #e2ebf4;">
                    <td style="padding: 15px; color: #64748b; font-size: 13px;">
                        <code style="background: #e2ebf4; padding: 4px 8px; border-radius: 4px; font-size: 13px; font-weight: bold; color: #001f3f;">${don.maDonHang}</code><br>
                        <span style="display: inline-block; margin-top: 8px;">🕒 ${ngayDat}</span>
                    </td>
                    <td style="padding: 15px; font-size: 14px; color: #475569; white-space: pre-wrap; line-height: 1.5;">${don.chiTiet}</td>
                    <td style="padding: 15px; color: #e53e3e; font-weight: bold;">${don.tongTien}</td>
                    <td style="padding: 15px; text-align: center;">
                        <span style="background: ${mauNen}; color: ${mauChu}; padding: 6px 15px; border-radius: 20px; font-size: 13px; font-weight: bold;">
                            ${don.trangThai}
                        </span>
                    </td>
                </tr>
            `;
        });
        bang.innerHTML = html;
    })
    .catch(err => {
        bang.innerHTML = `<tr><td colspan="4" style="text-align:center; color: #e53e3e; font-weight:bold;">❌ Lỗi kết nối máy chủ!</td></tr>`;
    });
}

// ========================================================
// HIỂN THỊ NÚT LỊCH SỬ ĐƠN HÀNG Ở TRANG CỬA HÀNG
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    const btnLichSu = document.getElementById("btnLichSuDonHang");
    
    // Nếu tìm thấy cái nút này trên trang (tức là đang đứng ở cuahang.html)
    if (btnLichSu) {
        const daDangNhap = localStorage.getItem("daDangNhap");
        
        // Chỉ hiện nút nếu người dùng đã đăng nhập thành công
        if (daDangNhap === "true") {
            btnLichSu.style.display = "inline-flex"; 
        }
    }
});

// ========================================================
// HỆ THỐNG ĐỒNG BỘ CỬA HÀNG TỪ GOOGLE SHEETS
// ========================================================

window.addEventListener('DOMContentLoaded', function() {
    // Chỉ chạy chức năng này nếu đang ở trang Cửa hàng (có khay chứa đồ)
    if (document.getElementById("danhSachSanPham")) {
        taiDanhSachSanPham();
    }
});

function taiDanhSachSanPham() {
    const container = document.getElementById("danhSachSanPham");

    fetch(MANG_LUOI_GOOGLE, {
        method: "POST",
        body: JSON.stringify({ action: "getProducts" })
    })
    .then(res => res.json())
    .then(danhSach => {
        window.KHO_SAN_PHAM_TOAN_CUC = danhSach; // Lưu toàn bộ kho hàng vào biến toàn cục để dành lọc
        hienThiSanPham(danhSach); // Gọi hàm vẽ HTML ra màn hình
    })
    .catch(err => {
        container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #e53e3e; font-weight: bold; padding: 40px;">❌ Lỗi kết nối máy chủ! Không tải được sản phẩm.</p>`;
    });
}

function hienThiSanPham(danhSach) {
    const container = document.getElementById("danhSachSanPham");
    if (danhSach.length === 0) {
        container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #64748b; padding: 40px;">Cửa hàng hiện tại chưa có sản phẩm nào.</p>`;
        return;
    }

    let html = "";
    danhSach.forEach(sp => {
        // Tự động thêm dấu chấm vào tiền cho đẹp (VD: 180000 -> 180.000)
        let giaDinhDang = Number(sp.gia).toLocaleString('vi-VN');

        html += `
            <div class="product-card" data-category="${sp.loai}" style="background: white; border-radius: 15px; padding: 20px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: transform 0.3s;">
                <a href="chitiet.html?id=${sp.id}" style="text-decoration: none; color: inherit;">
                    <img src="${sp.linkAnh}" alt="${sp.tenSanPham}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;">
                    <h3 style="font-size: 18px; color: #001f3f; margin-bottom: 10px;">${sp.tenSanPham}</h3>
                </a>
                <p class="price" style="color: #e53e3e; font-weight: bold; font-size: 16px; margin-bottom: 15px;">${giaDinhDang} VNĐ</p>
                
                <button onclick="themVaoGio('${sp.id}')" style="background: #0056b3; color: white; border: none; padding: 12px; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.3s;">🛒 Thêm vào giỏ</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ========================================================
// NÂNG CẤP BỘ LỌC TỰ ĐỘNG CHO CỬA HÀNG
// ========================================================
function locSanPham(loai, nutBam) {
    // Đổi màu cái nút vừa được bấm
    const cacNut = document.querySelectorAll('.categories-modern button');
    if (cacNut.length > 0) {
        cacNut.forEach(btn => btn.classList.remove('active'));
        if (nutBam) nutBam.classList.add('active');
    }

    // Nếu chưa có dữ liệu thì không làm gì cả
    if (!window.KHO_SAN_PHAM_TOAN_CUC) return;
    
    // Bắt đầu lọc hàng
    let danhSachLoc = window.KHO_SAN_PHAM_TOAN_CUC;
    if (loai !== 'tat-ca') {
        danhSachLoc = window.KHO_SAN_PHAM_TOAN_CUC.filter(sp => sp.loai === loai);
    }
    
    // Vẽ lại bảng sản phẩm theo danh sách mới
    hienThiSanPham(danhSachLoc);
}

// ========================================================
// HIỂN THỊ CHI TIẾT SẢN PHẨM ĐỘNG (chitiet.html)
// ========================================================
window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("chiTietSanPhamBox")) {
        taiChiTietSanPham();
    }
});

function taiChiTietSanPham() {
    const box = document.getElementById("chiTietSanPhamBox");
    
    // Lấy cái ID ở trên thanh link URL xuống
    const urlParams = new URLSearchParams(window.location.search);
    const idSanPham = urlParams.get('id');

    if (!idSanPham) {
        box.innerHTML = `<p style="text-align:center; color:#e53e3e; font-weight:bold; padding: 40px;">❌ Không tìm thấy mã sản phẩm!</p>`;
        return;
    }

    fetch(MANG_LUOI_GOOGLE, {
        method: "POST",
        body: JSON.stringify({ action: "getProducts" }) 
    })
    .then(res => res.json())
    .then(danhSach => {
        // Dò tìm sản phẩm có ID khớp với link URL
        const sp = danhSach.find(item => item.id === idSanPham);

        if (!sp) {
            box.innerHTML = `<p style="text-align:center; color:#e53e3e; font-weight:bold; padding: 40px;">❌ Sản phẩm này không tồn tại hoặc đã ngừng bán!</p>`;
            return;
        }

        let giaDinhDang = Number(sp.gia).toLocaleString('vi-VN');
        
        // Vẽ toàn bộ giao diện chi tiết ra
        box.innerHTML = `
            <a href="cuahang.html" style="text-decoration: none; color: #0056b3; font-weight: bold; margin-bottom: 20px; display: inline-block;">⬅ Quay lại cửa hàng</a>
            
            <div style="display: flex; flex-wrap: wrap; gap: 40px; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.05);">
                
                <div style="flex: 1; min-width: 300px;">
                    <img src="${sp.linkAnh}" alt="${sp.tenSanPham}" style="width: 100%; border-radius: 10px; object-fit: cover; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                </div>
                
                <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column;">
                    <span style="background: #e2ebf4; color: #0056b3; padding: 5px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; align-self: flex-start; margin-bottom: 15px;">${sp.loai}</span>
                    <h1 style="font-size: 32px; color: #001f3f; margin-bottom: 10px; margin-top: 0;">${sp.tenSanPham}</h1>
                    <p style="font-size: 24px; color: #e53e3e; font-weight: bold; margin-bottom: 20px;">${giaDinhDang} VNĐ</p>
                    
                    <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                        <h4 style="margin-top: 0; color: #001f3f; margin-bottom: 10px;">📝 Mô tả sản phẩm:</h4>
                        <p style="color: #475569; line-height: 1.6; font-size: 15px; margin: 0; white-space: pre-wrap;">${sp.moTa}</p>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <label style="font-weight: bold; color: #001f3f; display: block; margin-bottom: 8px;">Chọn phân loại (Size):</label>
                        <select id="sizeSanPham_${sp.id}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; font-size: 15px;">
                            <option value="Mặc định">Mặc định (Dành cho kiếm/phụ kiện)</option>
                            <option value="Size 1">Võ phục - Size 1 (1m10 - 1m20)</option>
                            <option value="Size 2">Võ phục - Size 2 (1m20 - 1m30)</option>
                            <option value="Size 3">Võ phục - Size 3 (1m30 - 1m40)</option>
                        </select>
                    </div>
                    
                    <button onclick="themVaoGio('${sp.id}')" style="background: #0056b3; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; transition: 0.3s; margin-top: auto; box-shadow: 0 5px 15px rgba(0,86,179,0.3);">
                        🛒 THÊM VÀO GIỎ HÀNG
                    </button>
                </div>

            </div>
        `;
    })
    .catch(err => {
        box.innerHTML = `<p style="text-align:center; color:#e53e3e; font-weight:bold; padding: 40px;">❌ Lỗi mạng, không tải được chi tiết!</p>`;
    });
}

// ========================================================
// HỆ THỐNG GIỎ HÀNG (XỬ LÝ NÚT THÊM VÀO GIỎ)
// ========================================================
function themVaoGio(idSanPham) {
    // 1. Kiểm tra xem kho hàng từ Google Sheets đã tải xong chưa
    if (!window.KHO_SAN_PHAM_TOAN_CUC) {
        alert("⏳ Dữ liệu cửa hàng đang tải, vui lòng đợi vài giây rồi thử lại!");
        return;
    }

    // 2. Dò tìm thông tin sản phẩm trong kho dựa vào ID
    const sanPham = window.KHO_SAN_PHAM_TOAN_CUC.find(sp => sp.id === idSanPham);
    if (!sanPham) {
        alert("❌ Lỗi: Không tìm thấy sản phẩm này trong kho!");
        return;
    }

    // 3. Lấy thông tin Size (Nếu người dùng đang ở trang chitiet.html)
    // Còn nếu ở trang cuahang.html bấm mua luôn thì mặc định là "Mặc định"
    let sizeChon = "Mặc định";
    const dropdownSize = document.getElementById(`sizeSanPham_${idSanPham}`);
    if (dropdownSize) {
        sizeChon = dropdownSize.value;
    }

    // Lấy số lượng (nếu bạn có ô nhập số lượng, mặc định là 1)
    let soLuong = 1;
    const oSoLuong = document.getElementById("soLuongSanPham");
    if (oSoLuong) {
        soLuong = parseInt(oSoLuong.value) || 1;
    }

    // 4. Mở "cái giỏ" trong bộ nhớ máy ra (Nếu chưa có thì tạo giỏ mới)
    let gioHang = JSON.parse(localStorage.getItem("gioHangVovinam")) || [];

    // 5. Kiểm tra xem món đồ này (cùng ID và cùng Size) đã có sẵn trong giỏ chưa
    const viTri = gioHang.findIndex(item => item.id === idSanPham && item.size === sizeChon);

    if (viTri !== -1) {
        // Trúng mánh! Khách mua thêm món y hệt -> Chỉ cần tăng số lượng
        gioHang[viTri].soLuong += soLuong;
    } else {
        // Hàng mới -> Thêm thẳng vào giỏ
        gioHang.push({
            id: sanPham.id,
            ten: sanPham.tenSanPham,
            gia: sanPham.gia,
            linkAnh: sanPham.linkAnh,
            size: sizeChon,
            soLuong: soLuong
        });
    }

    // 6. Buộc chặt giỏ lại và cất vào bộ nhớ máy
    localStorage.setItem("gioHangVovinam", JSON.stringify(gioHang));

    // 7. Báo hỉ cho khách hàng
    const xacNhan = confirm(`✅ Đã ném [ ${sanPham.tenSanPham} - ${sizeChon} ] vào giỏ hàng!\n\nBạn có muốn chuyển đến Giỏ hàng để thanh toán luôn không?`);
    if (xacNhan) {
        window.location.href = "giohang.html";
    }
}

// ========================================================
// HỆ THỐNG HIỂN THỊ VÀ TÍNH TIỀN GIỎ HÀNG
// ========================================================

// ĐÂY LÀ CHÌA KHÓA KHỞI ĐỘNG BỊ THIẾU: Tự động chạy khi mở trang
window.addEventListener('DOMContentLoaded', function() {
    // Chỉ chạy nếu đang đứng ở trang Giỏ hàng
    if (document.getElementById("danhSachGioHang")) {
        taiGiaoDienGioHang();
        if (typeof tuDongDienThongTin === "function") {
            tuDongDienThongTin(); // Tự điền tên người dùng
        }
    }
});

window.PHAN_TRAM_GIAM_GIA = 0; // Biến ghi nhớ mức giảm giá toàn cục

function taiGiaoDienGioHang() {
    const container = document.getElementById("danhSachGioHang");
    let gioHang = JSON.parse(localStorage.getItem("gioHangVovinam")) || [];

    if (gioHang.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <p style="color: #64748b; margin-bottom: 20px; font-size: 16px;">Giỏ hàng của bạn đang trống trơn.</p>
                <a href="cuahang.html" style="background: #0056b3; color: white; padding: 10px 25px; border-radius: 8px; text-decoration: none; font-weight: bold;">🛒 Đi mua sắm ngay</a>
            </div>`;
        if(document.getElementById("tamTinhTien")) document.getElementById("tamTinhTien").innerText = "0 VNĐ";
        if(document.getElementById("tongCongTien")) document.getElementById("tongCongTien").innerText = "0 VNĐ";
        if(document.getElementById("dongGiamGia")) document.getElementById("dongGiamGia").style.display = "none";
        return;
    }

    let html = "";
    let tongTien = 0;

    gioHang.forEach((item, index) => {
        let thanhTien = Number(item.gia) * item.soLuong;
        tongTien += thanhTien;

        html += `
            <div style="display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px dashed #e2ebf4; flex-wrap: wrap;">
                <img src="${item.linkAnh}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #f1f5f9;">
                <div style="flex: 1; min-width: 150px;">
                    <h4 style="margin: 0 0 5px 0; color: #001f3f; font-size: 16px;">${item.ten}</h4>
                    <p style="margin: 0 0 5px 0; color: #64748b; font-size: 13px;">Phân loại: <strong>${item.size}</strong></p>
                    <p style="margin: 0; color: #e53e3e; font-weight: bold;">${Number(item.gia).toLocaleString('vi-VN')} VNĐ</p>
                </div>
                
                <div style="display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; height: 35px;">
                    <button onclick="thayDoiSoLuong(${index}, -1)" style="background: #f1f5f9; border: none; padding: 0 12px; height: 100%; cursor: pointer; font-weight: bold; color: #475569; transition: 0.2s;">-</button>
                    <span style="padding: 0 15px; font-weight: bold; color: #001f3f; border-left: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; background: white; line-height: 35px;">${item.soLuong}</span>
                    <button onclick="thayDoiSoLuong(${index}, 1)" style="background: #f1f5f9; border: none; padding: 0 12px; height: 100%; cursor: pointer; font-weight: bold; color: #475569; transition: 0.2s;">+</button>
                </div>

                <button onclick="xoaMonHangKhoiGio(${index})" style="background: transparent; color: #94a3b8; border: none; font-size: 20px; cursor: pointer; margin-left: 10px;" title="Xóa món này">🗑️</button>
            </div>
        `;
    });
    container.innerHTML = html;
    
    // TÍNH TOÁN TIỀN VÀ VOUCHER SAU KHI ĐÃ CỘNG XONG TỔNG TIỀN
    let tienGiam = tongTien * (window.PHAN_TRAM_GIAM_GIA / 100);
    let tienCuoiCung = tongTien - tienGiam;

    // Cập nhật Tạm tính
    if(document.getElementById("tamTinhTien")) {
        document.getElementById("tamTinhTien").innerText = tongTien.toLocaleString('vi-VN') + " VNĐ";
    }
    
    // Cập nhật dòng Giảm giá
    const dongGiamGia = document.getElementById("dongGiamGia");
    if (window.PHAN_TRAM_GIAM_GIA > 0 && dongGiamGia) {
        dongGiamGia.style.display = "flex";
        document.getElementById("soTienGiam").innerText = "-" + tienGiam.toLocaleString('vi-VN') + " VNĐ";
    } else if (dongGiamGia) {
        dongGiamGia.style.display = "none";
    }

    // Cập nhật Tổng cộng
    if(document.getElementById("tongCongTien")) {
        document.getElementById("tongCongTien").innerText = tienCuoiCung.toLocaleString('vi-VN') + " VNĐ";
    }
}

function xoaMonHangKhoiGio(index) {
    let gioHang = JSON.parse(localStorage.getItem("gioHangVovinam")) || [];
    gioHang.splice(index, 1);
    localStorage.setItem("gioHangVovinam", JSON.stringify(gioHang)); 
    taiGiaoDienGioHang(); 
}

function thayDoiSoLuong(index, soThayDoi) {
    let gioHang = JSON.parse(localStorage.getItem("gioHangVovinam")) || [];
    if (gioHang[index]) {
        gioHang[index].soLuong += soThayDoi;
        if (gioHang[index].soLuong < 1) gioHang[index].soLuong = 1; 
        localStorage.setItem("gioHangVovinam", JSON.stringify(gioHang));
        taiGiaoDienGioHang();
    }
}

// Bắt buộc phải để hàm này đứng độc lập, không lồng vào đâu cả
function apDungVoucher() {
    const oVoucher = document.getElementById("maVoucher");
    if (!oVoucher) {
        console.error("Lỗi: Không tìm thấy ô nhập Voucher!");
        return;
    }

    const ma = oVoucher.value.trim().toUpperCase();
    
    if (ma === "VOVINAM10") {
        window.PHAN_TRAM_GIAM_GIA = 10; 
        if (typeof hienThiThongBao === "function") {
            hienThiThongBao("Áp dụng mã thành công! Bạn được giảm 10%.", "thanh-cong");
        } else {
            alert("Áp dụng mã thành công! Bạn được giảm 10%.");
        }
    } else if (ma === "") {
        window.PHAN_TRAM_GIAM_GIA = 0;
    } else {
        window.PHAN_TRAM_GIAM_GIA = 0;
        if (typeof hienThiThongBao === "function") {
            hienThiThongBao("Mã giảm giá không hợp lệ hoặc đã hết hạn!", "loi");
        } else {
            alert("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
        }
    }
    taiGiaoDienGioHang(); // Bắt buộc gọi lại hàm này để nó tính lại tiền
}

// ========================================================
// HỆ THỐNG XÁC NHẬN ĐẶT HÀNG & TẠO MÃ QR (BẢN HOÀN CHỈNH)
// ========================================================
function xacNhanDatHang() {
    try {
        const oTen = document.getElementById("tenNguoiNhan");
        const oSdt = document.getElementById("sdtNguoiNhan");
        const oDiaChi = document.getElementById("diaChiNhanHang");
        const oGhiChu = document.getElementById("ghiChuDonHang");

        const hoTen = oTen ? oTen.value.trim() : "";
        const sdt = oSdt ? oSdt.value.trim() : "";
        const diaChi = oDiaChi ? oDiaChi.value : "Nhận tại CLB";
        const ghiChu = oGhiChu ? oGhiChu.value.trim() : "";

        if (hoTen === "" || sdt === "") {
            hienThiThongBao("⚠️ Vui lòng nhập đầy đủ Họ tên và Số điện thoại!", "loi");
            return;
        }

        let gioHang = JSON.parse(localStorage.getItem("gioHangVovinam")) || [];
        if (gioHang.length === 0) {
            hienThiThongBao("⚠️ Giỏ hàng trống! Hãy mua đồ trước nhé.", "loi");
            return;
        }

        let chiTietDon = "";
        let tongTien = 0;
        
        gioHang.forEach(item => {
            chiTietDon += `- ${item.soLuong}x ${item.ten} (Size: ${item.size})\n`;
            tongTien += Number(item.gia) * item.soLuong;
        });

        if (window.PHAN_TRAM_GIAM_GIA > 0) {
            let tienGiam = tongTien * (window.PHAN_TRAM_GIAM_GIA / 100);
            tongTien = tongTien - tienGiam;
            chiTietDon += `\n🎁 Đã dùng mã giảm giá: ${window.PHAN_TRAM_GIAM_GIA}%`;
        }
        
        if (ghiChu !== "") {
            chiTietDon += `\n📝 Ghi chú: ${ghiChu}`;
        }

        const tongTienChu = tongTien.toLocaleString('vi-VN') + " VNĐ";
        const maDonHang = "VN-" + Math.random().toString(36).substring(2, 6).toUpperCase();

        hienThiThongBao("⏳ Đang gửi đơn hàng lên hệ thống...", "thanh-cong");

        fetch(MANG_LUOI_GOOGLE, {
            method: "POST",
            body: JSON.stringify({
                action: "datHang",
                maDonHang: maDonHang,
                hoTen: hoTen,
                sdt: sdt,
                diaChi: diaChi,
                chiTiet: chiTietDon,
                tongTien: tongTienChu
            })
        })
        .then(res => res.text())
        .then(ketQua => {
            if (ketQua === "DatHangThanhCong") {
                // 1. Xóa giỏ hàng
                localStorage.removeItem("gioHangVovinam"); 
                
                // 2. THÔNG TIN NGÂN HÀNG
                const maNganHang = "VCB"; 
                const soTaiKhoan = "7775922038"; 
                const tenTaiKhoan = "PHUNG LU NGOC CHUNG"; 

                // 3. Tạo link ảnh QR
                const tenKhongDau = tenTaiKhoan.replace(/ /g, '%20');
                const urlQR = `https://img.vietqr.io/image/${maNganHang}-${soTaiKhoan}-compact2.png?amount=${tongTien}&addInfo=${maDonHang}&accountName=${tenKhongDau}`;

                // 4. Bơm vào Modal HTML
                document.getElementById("anhMaQR").src = urlQR;
                document.getElementById("txtSoTien").innerText = tongTienChu;
                document.getElementById("txtNoiDung").innerText = maDonHang;
                document.getElementById("txtNganHang").innerText = maNganHang.toUpperCase();
                document.getElementById("txtChuTaiKhoan").innerText = tenTaiKhoan;

                // 5. HIỆN MÃ QR LÊN MÀN HÌNH (Và không dùng lệnh alert cũ nữa)
                document.getElementById("modalThanhToanQR").style.display = "flex";
                hienThiThongBao("Tạo đơn thành công! Vui lòng quét mã thanh toán.", "thanh-cong");
            } else {
                hienThiThongBao("❌ Lỗi máy chủ: " + ketQua, "loi");
            }
        })
        .catch(err => {
            hienThiThongBao("❌ Lỗi mạng! Vui lòng kiểm tra kết nối internet.", "loi");
        });

    } catch (error) {
        alert("Lỗi kỹ thuật: " + error.message);
    }
}

// Hàm tắt Popup QR và chuyển sang Lịch sử đơn hàng
function hoanTatThanhToan() {
    alert("🎉 Cảm ơn bạn! Đơn hàng của bạn đang được Ban Chủ Nhiệm xử lý.\n\nHệ thống sẽ chuyển bạn đến trang theo dõi vận đơn.");
    window.location.href = "lichsudonhang.html";
}

// ========================================================
// HỆ THỐNG THÔNG BÁO NỔI (TOAST NOTIFICATION) - ĐÃ PHỤC HỒI
// ========================================================
function hienThiThongBao(loiNhan, kieu = 'thanh-cong') {
    // 1. Tạo một cái hộp div mới
    const toast = document.createElement('div');
    toast.className = `toast-vovinam ${kieu === 'loi' ? 'error' : ''}`;
    
    // 2. Gắn icon tương ứng
    const icon = kieu === 'loi' ? '❌' : '🎉';
    toast.innerHTML = `<span style="font-size: 20px;">${icon}</span> <span style="line-height: 1.4;">${loiNhan}</span>`;
    
    // 3. Đưa vào web
    document.body.appendChild(toast);
    
    // 4. Kích hoạt hiệu ứng trượt vào
    setTimeout(() => { toast.classList.add('show'); }, 50);
    
    // 5. Tự động thu hồi và xóa đi sau 3 giây
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.remove(); }, 500); // Đợi trượt ra xong thì xóa hẳn
    }, 3000);
}