import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
export default function LoginForm() {
  const { signInUser, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    signInUser(data);
  };
  return (
    <div className="mx-auto max-w-sm rounded-2xl bg-white p-6 shadow-lg">
      {' '}
      <h2 className="mb-4 text-center text-2xl font-bold">Login</h2>{' '}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {' '}
        <input
          type="text"
          id="email"
          placeholder="your email"
          className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address',
            },
          })}
        />{' '}
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}{' '}
        <input
          type="password"
          id="password"
          placeholder="Your password"
          className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('password', { required: 'Please enter your password' })}
        />{' '}
        {errors.rePassword && (
          <p className="mt-1 text-sm text-red-500">
            {' '}
            {errors.rePassword.message}{' '}
          </p>
        )}{' '}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          {' '}
          Login{' '}
        </button>{' '}
      </form>{' '}
    </div>
  );
}
