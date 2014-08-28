***** Client -> gọi file JS và dòng code để chạy ứng dụng


- tham số trong hàm PuroadverRun() chính là phần tử được chọn để chạy quảng cáo

<script src="js/jquery.puroadver01.js"></script>
<script>window.onload = function() { PuroadverRun( $('.canvas') ); }</script>




***** Setup -> Cấu hình file đã được nhúng ở phía client 

ở đây là file jquery.puroadver01.js ,

- Nó sẽ thực hiện nhúng 2 file với bản min là 
        jquery.puroadver.min.css
        và jquery.puroadver.min.js -> đây là nơi ứng dụng được viết
- Nó sẽ gọi ứng dụng được viết trong jquery.puroadver.min.js,

- cần khai báo đường dẫn url đây là đường dẫn sẽ trả về file JSON

- Có thể thêm tham số để thay đổi mặc định
    adsby: {
            logo: 'images/ad-by-Puropela-min.png',
            link: 'http://www.puropela.com/',
            txt: 'ads by Puropela'
        }


***** Server

Đặt các file js cần thiết

Khi sử lý để trả về JSON có một biến được ajax truyền lên theo phương thức GET là "site" ($_GET["site"]) nó chứa thông tin hostname mà file JS đã nhúng ở website



***** Mô tả thêm về file jquery.puroadver.js

Trong này ngoài một số hàm để tính toán có thể quan tâm một số hàm sau để thay đổi nếu muốn thay đổi cấu trúc file JSON

- Hàm _generateCell -> tạo ra các ô ( dữ liệu được lấy như cấu trúc file JSON )

- Hàm _getHead -> tạo ra phần header nơi có logo công ty và dòng chữ chạy ( dữ liệu được lấy như cấu trúc file JSON )

- Hàm _getGist -> tạo ra thanh quà tặng được ẩn phía bên phải ( dữ liệu được lấy như cấu trúc file JSON )


***** Mô tả thêm về cấu trúc file JSON

- "imgadver" -> dữ thông tin đường dẫn hình quảng cáo được đặt trên web
- "theme" -> dữ các thông tin về kích thước popup và khai báo số cột số dòng
- "company" -> dữ thông tin phần header và phần gists
- "set" -> mảng chứa các bộ thông tin về các ô (lưu ý số lượng ô mỗi bộ sẽ bằng cols * rows)
