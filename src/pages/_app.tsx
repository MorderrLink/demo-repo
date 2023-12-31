import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { EdgeStoreProvider } from "~/lib/edgestore";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <EdgeStoreProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </EdgeStoreProvider>
  );
};

export default api.withTRPC(MyApp);
