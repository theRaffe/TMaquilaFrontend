import { JSX, useState } from "react";
import { useStorageState } from "./useStorageState";
import { supabase } from "../lib/supabase";
// import { useSystem } from "../powersync/PowerSync";
import axios from "axios";
import { Session } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";
import * as loginService from '../services/LoginService';


/**
 * Update axios' Authorization header with JWT access token
 * 
 * @param {*} access_token is an encoded JWT
 * @param unAuthorizedCallback a function to be executed when response returns 403 Status
 */
function updateAxiosHeader(access_token: string, unAuthorizedCallback: () => void) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    axios.interceptors.response.use(
        (response) => response,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error: any) => {
            const status = error.response?.status || 500;
            console.log({ interceptError: error});
            if (status === 403) {
                unAuthorizedCallback();
            }
            return Promise.reject(error);
        }
    );
}

type Props = {
    children: string | JSX.Element | JSX.Element[]
}
export function SessionProvider(props: Props) {
    const [[isLoading, session], setSession] = useStorageState<Session>("session");
    const [isExpiredSession, setExpiredSession] = useState(false);
    // const { supabaseConnector} = useSystem();
    // const supabase = supabaseConnector.client;

    /**
     * To refresh session with supabase
     */
    const refreshSession = async () => {
        const refresh_token = session?.refresh_token;
        if (refresh_token) {
            const response = await supabase.auth.refreshSession({refresh_token});
            if (response?.error) {
                setExpiredSession(true);
            }
        } else {
            console.error('Refresh token is empty!!');
            setExpiredSession(true);
        }
        
    };

    /**
     * Callback function that notifies session has expired and refresh session 
     */
    const unAuthorizedCallback = () => {
        refreshSession();
    };
    if (session?.access_token) {
        updateAxiosHeader(session.access_token,  unAuthorizedCallback);
    }

    const updateSession = (session: Session)  => { 
        setSession(session);
        updateAxiosHeader(session.access_token, unAuthorizedCallback);
        loginService.registerUserAccess();
    };
    return (
        <AuthContext.Provider
            value={{
                signIn: async (email, password) => {
                    console.log("DEBUG login inputs:", email, password);
                    // Perform sign-in logic here
                    const { error, data } =
                        await supabase.auth.signInWithPassword({
                            email: email,
                            password: password,
                        });
                    
                    if (data?.session) {
                        console.log({supabaseSession: data.session});
                        setSession(data.session);    
                        updateAxiosHeader(data.session.access_token, unAuthorizedCallback);
                        setExpiredSession(false);
                        loginService.registerUserAccess();
                    }        
                    
                    console.log("setting session by signIn:", error);
                    return error;
                },
                signUp: async (email, password) => {
                    console.log("DEBUG signup inputs:", email, password);
                    // Perform sign-in logic here
                    const { error, data } =
                        await supabase.auth.signUp({
                            email: email,
                            password: password,
                        });
                    
                    if (data?.session) {
                        console.log({supabaseSession: data.session});
                        setSession(data.session);    
                        updateAxiosHeader(data.session.access_token, unAuthorizedCallback);
                        setExpiredSession(false);
                        loginService.registerUserAccess();
                    }        
                    
                    console.log("setting session by signIn:", error);
                    return error;
                },
                checkUser: async(email) => {
                    const {error, data} = await supabase.from("TUser").select('id').eq('username', email);
                    console.log({checkUser: data});
                    if (!error) {
                        return data.length > 0;
                    }
                    return false
                },
                signOut: async () => {
                    const { error } = await supabase.auth.signOut();
                    if (error) {
                        console.warn("An error ocurred at sign out", error);
                    }
                    setSession(null);
                    setExpiredSession(false);
                    delete axios.defaults.headers.common["Authorization"];
                },
                session,
                isLoading,
                isExpiredSession,
                updateSession,
                verifyOtp: async(email, token) => {
                    const { error, data } = await supabase.auth.verifyOtp({
                        email,
                        token,
                        type: 'email'
                    });

                    if (data?.session?.access_token) {
                        console.log({supabaseSession: data.session});
                        setSession(data.session);
                        updateAxiosHeader(session?.access_token || '', unAuthorizedCallback);
                    }

                    console.log("setting session by verifyOtp:", !!error);
                    return !!error;
                },
                changePassword: async (password) =>  {
                    return await supabase.auth.updateUser({
                        password
                    });
                },
                signInWithOTP: async(email) => {
                    const { error } = await supabase.auth.signInWithOtp({
                        email,
                        options: {
                          // set this to false if you do not want the user to be automatically signed up
                          shouldCreateUser: false,
                        },
                    });
                    return !!error;
                },
                authHeader: () => {
                    const access_token = session?.access_token || '';
                    return { Authorization: `Bearer ${access_token}`}
                },
                refreshSession
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

export default SessionProvider;