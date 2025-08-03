import { createContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "../supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("세션 가져오기 실패:", error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth 상태 변화:", event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error("구글 로그인 실패:", error);
        alert("로그인에 실패했습니다: " + error.message);
      } else {
        console.log("로그인 시도 중...");
      }
    } catch (error) {
      console.error("로그인 중 오류:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("로그아웃 실패:", error);
        alert("로그아웃에 실패했습니다.");
      } else {
        console.log("로그아웃 성공");
      }
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
