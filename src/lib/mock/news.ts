export interface MockNews {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  image: string;
  author: string;
  publishedDate: string;
  views: number;
  featured: boolean;
}

export const mockNews: MockNews[] = [
  {
    id: "1",
    slug: "thi-truong-bat-dong-san-2026",
    title: "Thị trường bất động sản 2026: Cơ hội và thách thức",
    description:
      "Phân tích chi tiết về thị trường BĐS Việt Nam năm 2026, các xu hướng và dự đoán tương lai.",
    content: `Thị trường bất động sản Việt Nam năm 2026 đang trải qua nhiều biến động với cả cơ hội và thách thức đan xen.

Theo các chuyên gia, thị trường BĐS năm 2026 sẽ có những đặc điểm sau:

1. Nguồn cung mới tăng nhưng chậm
2. Giá vẫn duy trì ở mức cao
3. Nhu cầu ở thực vẫn là động lực chính
4. Các dự án hạ tầng tiếp tục thu hút đầu tư

**Khối ngoại và doanh nghiệp tiếp tục rót vốn**

Dòng vốn FDI vào bất động sản trong năm 2026 được dự báo tiếp tục tăng, đặc biệt vào các dự án khu công nghiệp và căn hộ cao cấp. Các tập đoàn từ Hàn Quốc, Nhật Bản và Singapore vẫn là những nhà đầu tư hàng đầu.

**Cơ hội cho người mua thực**

Với lãi suất vay mua nhà được giữ ở mức thấp và các gói hỗ trợ từ chính phủ, đây là thời điểm tốt cho những người mua nhà ở thực. Các chuyên gia khuyến nghị nên cân nhắc kỹ trước khi quyết định mua, đặc biệt là các dự án ở vùng ven với mức giá hợp lý.`,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    category: "Thị trường",
    author: "RealHub Research",
    publishedDate: "15/01/2026",
    views: 1523,
    featured: true,
  },
  {
    id: "2",
    slug: "huong-dan-mua-nha-lan-dau",
    title: "Hướng dẫn mua nhà lần đầu: Những điều cần biết",
    description:
      "Hướng dẫn chi tiết cho người mua nhà lần đầu, từ chuẩn bị tài chính đến ký hợp đồng.",
    content: `Mua nhà là quyết định tài chính quan trọng nhất trong cuộc đời nhiều người. Bài viết này sẽ hướng dẫn bạn từng bước.

**1. Chuẩn bị tài chính**
- Tích lũy tiền trả trước (thường 20-30% giá trị nhà)
- Kiểm tra và cải thiện điểm tín dụng
- Tính toán khả năng vay ngân hàng

**2. Xác định nhu cầu**
- Số lượng thành viên gia đình
- Vị trí mong muốn (gần trường, bệnh viện, nơi làm việc)
- Ngân sách tối đa

**3. Tìm kiếm và so sánh**
- Nghiên cứu thị trường khu vực
- So sánh nhiều bất động sản
- Kiểm tra pháp lý kỹ lưỡng

**4. Ký hợp đồng**
- Đọc kỹ mọi điều khoản
- Kiểm tra giấy tờ pháp lý
- Thanh toán theo tiến độ`,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    category: "Hướng dẫn",
    author: "RealHub Team",
    publishedDate: "12/01/2026",
    views: 2341,
    featured: true,
  },
  {
    id: "3",
    slug: "khu-vuc-tiem-nang-dau-tu-2026",
    title: "Các khu vực tiềm năng đầu tư BĐS năm 2026",
    description: "Khám phá các khu vực có tiềm năng tăng trưởng cao trong năm 2026.",
    content: `Năm 2026, một số khu vực được đánh giá có tiềm năng đầu tư BĐS cao.

**1. Khu Đông TP.HCM**
- Các dự án hạ tầng hoàn thiện (Metro Line 1, Vành đai 2)
- Giá còn hợp lý so với trung tâm
- Tiềm năng tăng trưởng cao

**2. Khu Tây TP.HCM**
- Nhiều dự án mới mở bán
- Hạ tầng ngày càng hoàn thiện
- Phù hợp cho nhà đầu tư dài hạn

**3. Các tỉnh lân cận**
- Bình Dương, Đồng Nai, Long An
- Giá hợp lý, tiềm năng phát triển
- Hạ tầng giao thông đang được đầu tư mạnh`,
    image: "https://images.unsplash.com/photo-1448630360428-01ff6bd97ffd?w=1200&q=80",
    category: "Đầu tư",
    author: "RealHub Research",
    publishedDate: "10/01/2026",
    views: 1876,
    featured: false,
  },
  {
    id: "4",
    slug: "mua-nha-hay-thue-nha",
    title: "Mua nhà hay thuê nhà: Nên chọn phương án nào?",
    description:
      "So sánh ưu nhược điểm của việc mua và thuê nhà để đưa ra quyết định phù hợp.",
    content: `Quyết định mua hay thuê nhà phụ thuộc vào nhiều yếu tố tài chính và cá nhân.

**Mua nhà**
Ưu điểm:
- Tài sản thuộc sở hữu
- Ổn định lâu dài
- Có thể cho thuê tạo thu nhập

Nhược điểm:
- Vốn ban đầu lớn
- Trách nhiệm bảo trì, sửa chữa
- Khó di chuyển

**Thuê nhà**
Ưu điểm:
- Linh hoạt về địa điểm
- Vốn ban đầu thấp
- Không lo bảo trì

Nhược điểm:
- Không sở hữu tài sản
- Giá thuê có thể tăng
- Không ổn định

**Lời khuyên**
Hãy xem xét kỹ khả năng tài chính, kế hoạch sinh hoạt và mục tiêu dài hạn trước khi quyết định.`,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    category: "Hướng dẫn",
    author: "RealHub Team",
    publishedDate: "08/01/2026",
    views: 1234,
    featured: false,
  },
  {
    id: "5",
    slug: "cap-nhat-lai-suat-vay-mua-nha",
    title: "Cập nhật lãi suất vay mua nhà tháng 1/2026",
    description: "Tổng hợp lãi suất vay mua nhà từ các ngân hàng lớn.",
    content: `Lãi suất vay mua nhà tiếp tục là mối quan tâm hàng đầu của người mua.

**Lãi suất tham khảo tháng 1/2026:**

- Vietcombank: 6.5% ưu đãi — 8.5% sau ưu đãi
- BIDV: 6.5% ưu đãi — 8.5% sau ưu đãi
- Techcombank: 6.99% ưu đãi — 9.5% sau ưu đãi
- VPBank: 7.5% ưu đãi — 10% sau ưu đãi

**Khuyến nghị**
So sánh nhiều ngân hàng và chọn thời điểm phù hợp để vay. Cần lưu ý các điều kiện kèm theo như bảo hiểm, phí tất toán trước hạn.`,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80",
    category: "Tài chính",
    author: "RealHub Research",
    publishedDate: "05/01/2026",
    views: 3421,
    featured: true,
  },
  {
    id: "6",
    slug: "sai-lam-pho-bien-dau-tu-bds",
    title: "5 sai lầm phổ biến khi đầu tư bất động sản",
    description: "Những sai lầm phổ biến mà nhà đầu tư BĐS thường mắc phải.",
    content: `Đầu tư bất động sản có thể sinh lời cao nhưng cũng tiềm ẩn nhiều rủi ro.

**1. Không nghiên cứu kỹ thị trường**
Nhiều nhà đầu tư mua theo cảm tính mà không phân tích dữ liệu thị trường, dẫn đến quyết định sai lầm.

**2. Đầu tư quá nhiều vào một tài sản**
Không đa dạng hóa danh mục đầu tư dẫn đến rủi ro cao khi thị trường biến động.

**3. Bỏ qua chi phí ẩn**
Thuế, phí quản lý, bảo trì... có thể chiếm 20-30% tổng chi phí.

**4. Không kiểm tra pháp lý**
Rủi ro mua phải tài sản có tranh chấp hoặc giấy tờ không rõ ràng.

**5. Thiếu kế hoạch thoát vốn**
Cần có chiến lược bán lại hoặc cho thuê từ đầu, không nên đầu tư mà không có lối ra rõ ràng.`,
    image: "https://images.unsplash.com/photo-1497366811353-677bb852583a?w=1200&q=80",
    category: "Đầu tư",
    author: "RealHub Team",
    publishedDate: "03/01/2026",
    views: 2156,
    featured: false,
  },
];

export const mockNewsCategories = [
  "Tất cả",
  "Thị trường",
  "Hướng dẫn",
  "Đầu tư",
  "Tài chính",
];
