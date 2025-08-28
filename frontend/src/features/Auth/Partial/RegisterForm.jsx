import useSignUp from '../../../hooks/useSignUp';
import { useForm } from 'react-hook-form';

export default function RegisterForm() {
  const { signUpUser, isCreatingUser } = useSignUp();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { rePassword, ...submitData } = data;
    signUpUser(submitData);
  };

  return (
    <div className="mx-auto max-w-sm rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Sign up new account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full name */}
        <div>
          <input
            type="text"
            id="fullName"
            placeholder="Họ tên"
            className="w-full rounded-lg border px-4 py-2"
            {...register('fullName', {
              required: 'Please enter your fullname',
            })}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Phone number */}
        <div>
          <input
            type="text"
            id="phoneNum"
            placeholder="Số điện thoại"
            className="w-full rounded-lg border px-4 py-2"
            {...register('phoneNum', {
              required: 'Please enter your phone number',
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: 'Invalid phone number',
              },
            })}
          />
          {errors.phoneNum && (
            <p className="mt-1 text-sm text-red-500">
              {errors.phoneNum.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="w-full rounded-lg border px-4 py-2"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <input
            type="text"
            id="username"
            placeholder="Tên đăng nhập"
            className="w-full rounded-lg border px-4 py-2"
            {...register('username', {
              required: 'Please enter your username',
            })}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            id="password"
            placeholder="Mật khẩu"
            className="w-full rounded-lg border px-4 py-2"
            {...register('password', {
              required: 'Please enter your password',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Re-check Password */}
        <div>
          <input
            type="password"
            id="rePassword"
            placeholder="Nhập lại mật khẩu"
            className="w-full rounded-lg border px-4 py-2"
            {...register('rePassword', {
              required: 'please re-enter password',
              validate: (value) =>
                value === getValues('password') ||
                'Mật khẩu nhập lại không khớp',
            })}
          />
          {errors.rePassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.rePassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isCreatingUser}
          className="w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isCreatingUser ? 'Registering your account...' : 'Sign up'}
        </button>
      </form>
    </div>
  );
}
