'use client';

import { memo, useEffect } from 'react';
import { createStoreUpdater } from 'zustand-utils';

import { useSession } from '@/libs/better-auth/auth-client';
import { useUserStore } from '@/store/user';
import { type LobeUser } from '@/types/user';

/**
 * Sync Better-Auth session state to Zustand store
 */
const UserUpdater = memo(() => {
  const { data: session, isPending, error } = useSession();

  const isLoaded = !isPending;
  const isSignedIn = !!session?.user && !error;

  const betterAuthUser = session?.user;
  const useStoreUpdater = createStoreUpdater(useUserStore);

  useStoreUpdater('isLoaded', isLoaded);
  useStoreUpdater('isSignedIn', isSignedIn);

  // Sync Better-Auth session state to Zustand store.
  // Better-Auth refetches the session on tab focus (visibilitychange), which
  // gives us a new `betterAuthUser` reference each time even when the
  // underlying user is unchanged. We must merge into the existing user rather
  // than replace it — fields like `interests`, `firstName`, `latestName` are
  // populated by `useInitUserState` (one-shot SWR) and would otherwise be
  // wiped on every focus, breaking downstream selectors (e.g. the daily-brief
  // recommendation SWR key resets to empty interests and refetches). LOBE-8597.
  //
  // `fullName` and `username` are managed by LobeHub's own tRPC profile
  // endpoints (e.g. `user.updateFullName`) which write to `users` table and
  // refresh the store via `useInitUserState` SWR. The Better-Auth session
  // cookie may carry stale profile values (e.g. from login time, or because
  // LobeHub's profile endpoints bypass Better-Auth's session cookie refresh).
  // To avoid UI jitter where a newly updated `fullName` gets reverted to an
  // old session snapshot, prefer the store's existing value when present.
  //
  // Guard the merge by user id: if the session switches to a different
  // account (e.g. another tab signed in as a different user, focus refetch
  // returns the new session here without an intermediate signed-out state),
  // drop the previous user's profile fields so they don't leak across
  // accounts. `useInitUserState` is `useOnlyFetchOnceSWR` with a constant
  // key, so it won't re-fetch profile data for the new user on its own.
  useEffect(() => {
    if (betterAuthUser) {
      useUserStore.setState((state) => {
        const baseUser = state.user?.id === betterAuthUser.id ? state.user : undefined;
        return {
          user: {
            ...baseUser,
            // Preserve avatar from settings, don't override with auth provider value
            avatar: baseUser?.avatar || '',
            email: betterAuthUser.email,
            fullName: baseUser?.fullName || betterAuthUser.name || '',
            id: betterAuthUser.id,
            username: baseUser?.username || betterAuthUser.username || '',
          } as LobeUser,
        };
      });
      return;
    }

    // Clear user data when session becomes unavailable
    useUserStore.setState({ user: undefined });
  }, [betterAuthUser]);

  return null;
});

export default UserUpdater;
