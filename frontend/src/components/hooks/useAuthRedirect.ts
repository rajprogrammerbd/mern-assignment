import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

type IType = 'authenticated' | 'unauthenticated';

/**
 * Redirects user based on authentication status
 * @param {'authenticated' | 'unauthenticated'} condition - when to redirect
 * @param {string} redirectTo - destination path
 */
const useAuthRedirect = (
    condition: IType = 'authenticated',
    redirectTo = '/'
) => {
    const router = useRouter();
    const token = useSelector((state: RootState) => state.user.access_token);

    useLayoutEffect(() => {
        const isLoggedIn = Boolean(token);

        if (condition === 'authenticated' && isLoggedIn) {
            router.replace(redirectTo);
        }

        if (condition === 'unauthenticated' && !isLoggedIn) {
            router.replace(redirectTo);
        }
    }, [token, condition, redirectTo, router]);
};

export default useAuthRedirect;
