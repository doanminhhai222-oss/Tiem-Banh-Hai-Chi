/* ============ Dữ liệu tiệm Hải Chi Bakery — sửa tại đây ============ */
const CONFIG = {
  name: 'Hải Chi Bakery',
  address: 'Phường Tân An, Thành phố Bắc Ninh',                        // TODO: bổ sung số nhà, tên đường
  phone: '0900 000 000',                                              // TODO: thay số điện thoại thật
  hours: '07:00 – 22:00, mở cửa cả tuần',
  email: 'hello@haichibakery.vn',
};

/* Topping gợi ý theo nhóm món */
const TOPPINGS = {
  banh: [
    { id: 'kem',   name: 'Kem tươi',        price: 5000 },
    { id: 'dau',   name: 'Dâu tươi',        price: 10000 },
    { id: 'choco', name: 'Sốt chocolate',   price: 5000 },
    { id: 'hanh',  name: 'Hạnh nhân lát',   price: 6000 },
    { id: 'nen',   name: 'Nến sinh nhật',   price: 3000 },
  ],
  drink: [
    { id: 'tranchau', name: 'Trân châu đen',   price: 7000 },
    { id: 'thach',    name: 'Thạch dừa',       price: 5000 },
    { id: 'cheese',   name: 'Kem cheese',      price: 10000 },
    { id: 'pudding',  name: 'Pudding trứng',   price: 8000 },
    { id: 'shot',     name: 'Thêm 1 shot espresso', price: 8000 },
  ],
};

/* Art: {k: kiểu hình, ...màu}. Xem js/art.js */
const PRODUCTS = [
  /* ---------------- BÁNH ---------------- */
  { id: 'bonglan', cat: 'banh', img: 'assets/menu/bonglan.jpg', name: 'Bông lan trứng muối', price: 39000, tag: 'Bán chạy',
    art: { k: 'roll', body: '#f7dca0', cream: '#fff6e2', yolk: '#f0a63a', floss: '#e8a24f' },
    flavor: 'Mặn – ngọt – béo ngậy',
    story: 'Cuộc hôn phối bất ngờ giữa món bánh bông lan mềm xốp và trứng muối của ẩm thực Việt. Hải Chi ủ trứng muối tự làm, chà bông nhà rang và quét sốt phô mai kem béo mịn — cắn một miếng là nhớ liền.' },
  { id: 'sukem', cat: 'banh', img: 'assets/menu/sukem.jpg', name: 'Su kem nhân kem tràn', price: 22000, tag: 'Mới ra lò',
    art: { k: 'puff', shell: '#f0c27a', cream: '#fffaf0', sugar: '#fff3d6' },
    flavor: 'Vani · Chocolate · Trà xanh',
    story: 'Choux à la crème sinh ra từ lò bánh của Pháp thế kỷ 16. Vỏ su mỏng giòn nhẹ, nhân kem custard bơm ngay khi khách gọi để vỏ không bị mềm — chọn vị truyền thống, phô mai hay chocolate.' },
  { id: 'tiramisu', cat: 'banh', img: 'assets/menu/tiramisu.jpg', name: 'Tiramisu cà phê rum', price: 49000, tag: 'Nghiện',
    art: { k: 'tiramisu', cocoa: '#6b4132', cream: '#fff1dc', sponge: '#d9a566' },
    flavor: 'Đắng nhẹ · béo mịn · thơm rum',
    story: '“Tiramisu” trong tiếng Ý nghĩa là “kéo tôi lên” — vì cà phê và mascarpone khiến người ta tỉnh táo và hạnh phúc. Bánh quy ladyfinger thấm espresso đậm, phủ mascarpone đánh bông và rắc cacao.' },
  { id: 'cheesecake', cat: 'banh', img: 'assets/menu/cheesecake.jpg', name: 'Cheesecake New York', price: 52000,
    art: { k: 'slice', layers: ['#e9c58e', '#fff3d9', '#fff3d9'], top: '#ff9fb0', topping: 'berry' },
    flavor: 'Chua thanh · béo mát · đế quy giòn tan',
    story: 'Món tráng miệng gắn với New York từ đầu thế kỷ 20. Phiên bản nướng cách thủy của Hải Chi mịn như kem, đi cùng sốt dâu tươi chua nhẹ. Cũng có bản no-bake mát lạnh cho ngày nắng.' },
  { id: 'mousse', cat: 'banh', img: 'assets/menu/mousse.jpg', name: 'Mousse xoài chanh dây', price: 45000, tag: 'Mát lạnh',
    art: { k: 'dome', glaze: '#ffc857', base: '#f3d6a2', berry: '#ff7a59' },
    flavor: 'Ngọt thơm xoài · chua nhẹ chanh dây',
    story: 'Mousse nghĩa là “bọt” trong tiếng Pháp — nhẹ như mây, tan ngay trên đầu lưỡi. Hải Chi dùng xoài cát chín cây và chanh dây tươi, phủ gương bóng như món trang sức nhỏ.' },
  { id: 'macaron', cat: 'banh', img: 'assets/menu/macaron.jpg', name: 'Macaron (hộp 4 viên)', price: 79000, tag: 'Quà tặng',
    art: { k: 'macaron', colors: ['#f4a3b5', '#bcd8c3', '#f7d794'] },
    flavor: 'Dâu · Matcha · Chanh vàng · Cacao',
    story: 'Những viên bánh nhỏ xinh của Pháp, vỏ giòn nhẹ ngoài, mềm dẻo trong. Mỗi viên được làm từ bột hạnh nhân, ủ vỏ qua đêm và kẹp ganache vừa ngọt — đựng trong hộp hồng, tặng ai cũng thích.' },
  { id: 'crepe', cat: 'banh', img: 'assets/menu/crepe.jpg', name: 'Crepe sầu riêng', price: 55000, tag: 'Best seller',
    art: { k: 'crepe', crepe: '#f6dfae', cream: '#fffaf0', fruit: '#f4c431' },
    flavor: 'Thơm lừng · béo ngậy · vỏ mỏng dai',
    story: 'Crepe là bánh xếp lớp mỏng của vùng Brittany (Pháp), về Việt Nam được “Việt hóa” bằng sầu riêng Ri6 vàng óng. 20 lớp vỏ mỏng xen kem tươi, thêm múi sầu riêng thật, để lạnh mới ngon.' },
  { id: 'redvelvet', cat: 'banh', img: 'assets/menu/redvelvet.jpg', name: 'Red Velvet phô mai', price: 48000,
    art: { k: 'slice', layers: ['#c0353f', '#fff6ec', '#c0353f', '#fff6ec', '#c0353f'], top: '#fff6ec', topping: 'crumb' },
    flavor: 'Ngọt dịu · cacao nhẹ · kem phô mai',
    story: 'Chiếc bánh đỏ nhung của miền Nam nước Mỹ, nổi tiếng nhờ màu đỏ rực và lớp kem cream cheese. Cốt bánh mềm ẩm như nhung, ăn kèm ly trà đen là chuẩn bài.' },
  { id: 'croissant', cat: 'banh', img: 'assets/menu/croissant.jpg', name: 'Croissant matcha', price: 35000,
    art: { k: 'croissant', c1: '#e8a94a', c2: '#f4c46b' },
    flavor: 'Thơm bơ · giòn rụm · phủ matcha béo nhẹ',
    story: 'Hình lưỡi liềm của croissant gắn với truyền thuyết Vienna. Bánh Hải Chi gập bơ 27 lớp, ủ lạnh qua đêm, nướng sáng sớm rồi rưới sốt matcha trắng và rắc bột trà xanh — nghe tiếng “rộp” khi bẻ đôi là biết bánh đạt.' },
  { id: 'cookie', cat: 'banh', img: 'assets/menu/cookie.jpg', name: 'Cookiezo chocolate chip', price: 25000,
    art: { k: 'cookie', dough: '#d9a05b', chip: '#5a3426' },
    flavor: 'Giòn rìa · mềm giữa · tan chảy socola',
    story: 'Chiếc cookie của cô thợ bánh người Mỹ làm vội trong một buổi chiều năm 1938 mà thành huyền thoại. Hải Chi dùng bơ nâu và socola đen 55%, nướng vừa chín tới để phần giữa vẫn còn dẻo.' },
  { id: 'flan', cat: 'banh', img: 'assets/menu/flan.jpg', name: 'Bánh flan caramel', price: 20000,
    art: { k: 'dome', glaze: '#f2b24b', base: '#8a4a1f', berry: null },
    flavor: 'Béo trứng sữa · caramel đắng nhẹ',
    story: 'Món ăn tuổi thơ của nhiều thế hệ người Việt, du nhập từ crème caramel của Pháp. Hải Chi hấp cách thủy lửa nhỏ để mặt flan mịn không rỗ, rưới caramel nâu cánh gián.' },
  { id: 'pannacotta', cat: 'banh', img: 'assets/menu/pannacotta.jpg', name: 'Panna cotta dâu', price: 42000,
    art: { k: 'dome', glaze: '#ff9fb0', base: '#fffaf0', berry: '#d6314f' },
    flavor: 'Sữa tươi · vani · sốt dâu chua ngọt',
    story: '“Panna cotta” nghĩa là “kem nấu chín” — món tráng miệng vùng Piedmont (Ý). Kem tươi và sữa tạo độ rung rinh mềm mượt, phủ sốt dâu tươi nấu tại tiệm.' },

  /* ---------------- THỨC UỐNG ---------------- */
  { id: 'cfmuoi', cat: 'drink', img: 'assets/menu/cfmuoi.jpg', name: 'Cà phê muối', price: 35000, tag: 'Hot trend',
    art: { k: 'cup', layers: [['#4a2c20', .62], ['#f5ead8', .25]], foam: '#fff6e8', straw: '#e4a39b' },
    flavor: 'Đậm · béo · mặn nhẹ cuối vị',
    story: 'Khởi nguồn từ Huế, cà phê muối đi cùng lớp kem muối mặn mà béo phủ trên cà phê đen đậm. Vị mặn nhẹ làm nổi bật độ ngọt hậu — thức uống “gây nghiện” của giới trẻ.' },
  { id: 'bacxiu', cat: 'drink', img: 'assets/menu/bacxiu.jpg', name: 'Bạc xỉu', price: 32000,
    art: { k: 'cup', layers: [['#c79566', .45], ['#f6efe3', .45]], foam: null, straw: '#8fb9a0' },
    flavor: 'Nhiều sữa · ít cà phê · ngọt dịu',
    story: 'Cái tên bắt nguồn từ tiếng Quảng “bạc tẩy xỉu phé”, nghĩa là “nhiều sữa ít cà phê”. Món uống Sài Gòn dành cho người thích cà phê nhưng thương dạ dày.' },
  { id: 'cfsua', cat: 'drink', img: 'assets/menu/cfsua.jpg', name: 'Cà phê phin sữa đá', price: 29000,
    art: { k: 'cup', layers: [['#3b2218', .50], ['#c79566', .30]], foam: null, straw: '#e4a39b' },
    flavor: 'Đậm đà · thơm rang xay · ngọt sữa đặc',
    story: 'Ly cà phê của người Sài Gòn mỗi sáng: pha phin nhỏ giọt, hòa sữa đặc, rót lên đá viên. Hạt Robusta Đắk Lắk rang vừa, đắng đậm mà không gắt.' },
  { id: 'cfdua', cat: 'drink', name: 'Cà phê cốt dừa', price: 42000,
    art: { k: 'cup', layers: [['#4a2c20', .38], ['#fffaf0', .45]], foam: '#fffaf0', straw: '#bcd8c3' },
    flavor: 'Thơm dừa · béo mát · đắng nhẹ',
    story: 'Sinh ra từ những buổi hè oi bức, người ta xay đá cùng nước cốt dừa để làm dịu ly cà phê. Cốt dừa béo thơm hòa nhịp với espresso, như một cơn mưa rào mát lạnh.' },
  { id: 'tstc', cat: 'drink', name: 'Trà sữa trân châu đường đen', price: 45000, tag: 'Bán chạy',
    art: { k: 'cup', layers: [['#8a5a3a', .15], ['#e9cfae', .6]], foam: null, boba: true, straw: '#e4a39b' },
    flavor: 'Béo thơm · ngọt dịu · trân châu dai',
    story: 'Trà sữa trân châu ra đời ở Đài Loan thập niên 1980 và nhanh chóng chinh phục giới trẻ Việt. Trân châu Hải Chi nấu thủ công, ngâm đường đen quánh, trà ô long ủ lạnh 8 tiếng.' },
  { id: 'matcha', cat: 'drink', name: 'Matcha latte', price: 49000,
    art: { k: 'cup', layers: [['#7fae70', .38], ['#f6f0e0', .52]], foam: '#f6f0e0', straw: '#e4a39b' },
    flavor: 'Rêu thanh · hậu ngọt · sữa tươi mịn',
    story: 'Matcha — bột trà xanh Nhật Bản nghiền từ lá che nắng — là “đặc sản” của trà đạo. Khuấy chổi tre cho mịn, kết hợp sữa tươi lạnh thành ly latte xanh dịu mắt.' },
  { id: 'daocamsa', cat: 'drink', name: 'Trà đào cam sả', price: 42000, tag: 'Giải nhiệt',
    art: { k: 'cup', layers: [['#ffae5b', .65]], foam: null, fruit: '#ffc78a', straw: '#8fb9a0' },
    flavor: 'Thơm sả · ngọt đào · chua nhẹ cam',
    story: 'Món trà trái cây quốc dân của quán Việt: trà đen ủ lạnh, miếng đào ngâm giòn ngọt, vài lát cam vàng và sả đập dập. Thơm nức, uống một ngụm là tỉnh người.' },
  { id: 'hongtra', cat: 'drink', name: 'Hồng trà macchiato', price: 45000,
    art: { k: 'cup', layers: [['#b9642e', .55], ['#fff0d6', .28]], foam: '#fff0d6', straw: '#e4a39b' },
    flavor: 'Trà đậm · kem cheese mặn béo',
    story: '“Macchiato” trong tiếng Ý là “điểm vết” — như lớp kem phô mai đánh bông điểm trên bề mặt trà. Hồng trà đậm vị cân bằng độ béo của kem, uống từng ngụm lớn mới đã.' },
  { id: 'traivai', cat: 'drink', name: 'Trà vải hoa hồng', price: 42000,
    art: { k: 'cup', layers: [['#f7bfc8', .65]], foam: null, fruit: '#fff3f0', straw: '#bcd8c3' },
    flavor: 'Thơm hoa hồng · ngọt vải · thanh mát',
    story: 'Thức uống mang màu của tiệm: hồng phớt dịu dàng. Vải ngâm nguyên trái cùng cánh hoa hồng sấy khô, trà xanh ủ nhẹ — hợp với bánh macaron và cheesecake.' },
  { id: 'yogurt', cat: 'drink', name: 'Sữa chua dâu', price: 40000,
    art: { k: 'cup', layers: [['#ff9fb0', .25], ['#fff1ee', .5]], foam: null, fruit: '#ff6d8a', straw: '#e4a39b' },
    flavor: 'Chua ngọt · mát lạnh · dâu tươi',
    story: 'Sữa chua tự ủ ở tiệm, mịn và chua nhẹ, xay cùng dâu Đà Lạt. Ngọt thanh, nhiều vi khuẩn có lợi — lựa chọn nhẹ bụng sau bữa ăn nhiều đồ ngọt.' },
];

/* Hạng thành viên (theo tổng điểm tích lũy) */
const TIERS = [
  { id: 'new',  name: 'Bạn mới',            min: 0,   disc: 0,    icon: '🌱', perks: ['Tích 1 điểm / 10.000đ', 'Thẻ tích bánh & thức uống', 'Voucher chào bạn mới giảm 10%'] },
  { id: 'than', name: 'Thân thiết',         min: 100, disc: 0.05, icon: '🌸', perks: ['Giảm 5% mọi đơn hàng', 'Thẻ tích bánh & thức uống', 'Ưu tiên đặt bánh sinh nhật'] },
  { id: 'vip',  name: 'VIP',                min: 300, disc: 0.10, icon: '👑', perks: ['Giảm 10% mọi đơn hàng', 'Voucher VIP mỗi tháng (-20.000đ)', 'Tặng 1 bánh sinh nhật nhỏ tại quán'] },
  { id: 'kc',   name: 'Kim Cương · Lâu năm', min: 800, disc: 0.15, icon: '💎', perks: ['Giảm 15% mọi đơn hàng', 'Voucher mỗi tháng (-40.000đ + bánh miễn phí)', 'Bàn ưu tiên & quà tri ân khách lâu năm'] },
];

/* Mã giảm giá công khai */
const PUBLIC_CODES = {
  HAICHI10: { label: 'Giảm 10% (tối đa 30.000đ)', type: 'percent', value: 0.1, max: 30000 },
  CHAOBAN:  { label: 'Giảm 10.000đ cho đơn từ 60.000đ', type: 'amount', value: 10000, min: 60000 },
};

/* Đổi điểm lấy quà */
const REDEEMS = [
  { cost: 30,  label: 'Voucher -15.000đ (đơn từ 80.000đ)', v: { label: '-15.000đ (đơn từ 80k)', type: 'amount', value: 15000, min: 80000 } },
  { cost: 80,  label: 'Voucher -40.000đ (đơn từ 150.000đ)', v: { label: '-40.000đ (đơn từ 150k)', type: 'amount', value: 40000, min: 150000 } },
  { cost: 120, label: 'Tặng 1 bánh bất kỳ (≤ 55.000đ)', v: { label: 'Tặng 1 bánh miễn phí', type: 'freecake' } },
];

const STAMP_RULES = {
  banh:  { need: 6, reward: { label: 'Tặng 1 bánh miễn phí (thẻ tích bánh)', type: 'freecake' } },
  drink: { need: 5, reward: { label: 'Mua 1 tặng 1 thức uống (thẻ tích nước)', type: 'b1g1' } },
};

const SEED_REVIEWS = [
  { name: 'Ngọc Anh', stars: 5, item: 'Tiramisu cà phê rum', text: 'Tiệm xinh như tranh, tông hồng – xanh mint rất chill. Tiramisu béo mịn, không quá ngọt. Sẽ quay lại!', ts: Date.now() - 86400000 * 12 },
  { name: 'Minh Quân', stars: 5, item: 'Bông lan trứng muối', text: 'Trứng muối béo, chà bông giòn, bánh mềm xốp. Ăn một lần là ghiền.', ts: Date.now() - 86400000 * 9 },
  { name: 'Thu Hà', stars: 4, item: 'Trà sữa trân châu đường đen', text: 'Trân châu dai ngon, trà thơm. Giờ cao điểm hơi đông nhưng nhân viên rất dễ thương.', ts: Date.now() - 86400000 * 5 },
  { name: 'Bảo Trân', stars: 5, item: 'Crepe sầu riêng', text: 'Sầu riêng thật sự, nhiều kem mà không ngán. Mê nhất là vỏ crepe mỏng dai.', ts: Date.now() - 86400000 * 3 },
];

const FAQS = [
  { q: 'Tiệm ở đâu? Có chỗ gửi xe không?', a: `Hải Chi Bakery nằm tại ${CONFIG.address}. Tiệm có chỗ gửi xe máy miễn phí ngay trước cửa; ô tô vui lòng gửi ở bãi xe gần đó.` },
  { q: 'Giờ mở cửa của tiệm?', a: `Tiệm mở cửa ${CONFIG.hours}. Bánh nướng mẻ đầu ra lò lúc 7 giờ sáng.` },
  { q: 'Tiệm có giao hàng không?', a: 'Có. Giao nội thành trong 30–45 phút qua Zalo/điện thoại hoặc các app giao hàng. Chọn “Giao tận nơi” khi đặt món, tiệm sẽ gọi xác nhận phí ship.' },
  { q: 'Đặt bánh sinh nhật / bánh theo yêu cầu thế nào?', a: `Vui lòng đặt trước ít nhất 24 giờ qua hotline ${CONFIG.phone} hoặc ghi chú trong giỏ hàng. Tiệm nhận viết chữ, trang trí theo chủ đề và nhận cọc 30%.` },
  { q: 'Tiệm có bánh cho người ăn kiêng hoặc dị ứng không?', a: 'Có một số bánh ít đường và không gluten (đặt trước). Cơ sở có sử dụng hạnh nhân, trứng, sữa và lúa mì, bạn có dị ứng vui lòng báo trước cho nhân viên.' },
  { q: 'Thanh toán bằng cách nào?', a: 'Tiền mặt, chuyển khoản QR, thẻ Visa/Master và ví điện tử (MoMo, ZaloPay).' },
  { q: 'Điểm tích lũy được tính thế nào?', a: 'Mỗi 10.000đ thanh toán được 1 điểm. Mua đủ 6 bánh được tặng 1 bánh miễn phí, mua đủ 5 thức uống được tặng 1 ly (mua 1 tặng 1). Điểm đổi được voucher và nâng hạng thành viên.' },
  { q: 'Tiệm có wifi, ổ cắm và nhận tổ chức tiệc nhỏ không?', a: 'Có wifi miễn phí, nhiều ổ cắm tại bàn, và khu vực sofa hồng cho nhóm 6–10 người. Tiệc sinh nhật nhỏ vui lòng báo trước 1–2 ngày.' },
];
