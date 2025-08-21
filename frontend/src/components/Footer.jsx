import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaCreditCard,
  FaCcVisa,
  FaCcMastercard,
  FaTruck,
  FaShippingFast,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Về Chúng Tôi</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="transition hover:text-white">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Điều khoản
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Chính sách cookie
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="transition hover:text-white">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Hướng dẫn bán hàng
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Vận chuyển
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Trả hàng & Hoàn tiền
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên Hệ</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                Hotline: <span className="text-white">1900 1234</span>
              </p>
              <p>
                Email: <span className="text-white">support@shop.vn</span>
              </p>
              <p>Thời gian: 8:00 - 22:00 (hàng ngày)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-gray-900 py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between text-sm text-gray-400 md:flex-row">
            <p>&copy; 2024 Shop Vietnam. Tất cả quyền được bảo lưu.</p>
            <p>
              Quốc gia & Khu vực: <span className="text-white">Việt Nam</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
