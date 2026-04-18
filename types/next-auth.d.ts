import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    dashboardToken?: string;
  }
  interface User {
    dashboardToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    dashboardToken?: string;
  }
}
