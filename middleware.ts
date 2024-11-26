export { default } from 'next-auth/middleware';

const allExceptRoot = '/((?!^$).*)';

export const config = {
  matcher: [allExceptRoot],
};
