import { AuthError, Session } from "@supabase/supabase-js";
import React from "react";

type updateSessionFn = (session: Session) => void;

export const AuthContext = React.createContext<{
    signIn: (email: string, pass: string) => Promise<AuthError | null>;
    signUp: (email: string, pass: string) => Promise<AuthError | null>;
    checkUser: (email: string) => Promise<boolean>;
    signOut: () => void;
    session: Session | null;
    isLoading: boolean;
    isExpiredSession: boolean;
    updateSession: updateSessionFn;
    verifyOtp: (email:string, pass:string) => Promise<boolean>,
    changePassword: (pass: string) => Promise<unknown>,
    signInWithOTP: (email: string) => Promise<boolean>,
    authHeader: () => unknown,
    refreshSession: () => unknown
}>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    signIn: async (email: string, pass: string) => null,
    signUp: async (email: string, pass: string) => null,
    checkUser: async(email: string) => false,
    signOut: () => {},
    session: null,
    isLoading: false,
    isExpiredSession: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateSession: (session) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    verifyOtp: async (email, pass) => false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changePassword: async(pass) => null,
    signInWithOTP: async(email) => false,
    authHeader: () => null,
    refreshSession: () => {}
});
