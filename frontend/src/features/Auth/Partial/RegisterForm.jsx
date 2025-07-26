import { useState } from "react";

export default function RegisterForm({ onRegister }) {
  const [form, setForm] = useState({
    fullname: "",
    phoneNum: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(form);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Đăng ký</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullname"
          placeholder="Họ tên"
          className="w-full px-4 py-2 border rounded-lg"
          value={form.fullname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNum"
          placeholder="Số điện thoại"
          className="w-full px-4 py-2 border rounded-lg"
          value={form.phoneNum}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          className="w-full px-4 py-2 border rounded-lg"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          className="w-full px-4 py-2 border rounded-lg"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
