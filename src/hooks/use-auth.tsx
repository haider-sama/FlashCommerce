import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const router = useRouter();

  const signOut = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) throw new Error();

      toast.success('Logged in successfully');

      router.push('/sign-in');
      router.refresh();
    } catch (err) {
      toast.error("Can't login, Please try again later.")
    }
  }

  return { signOut }
}