import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import { AuthModel } from "@/types/authModel";

const useAuth = (): AuthModel => {
  const { user, isAuthenticated } = useAuthContext();

  return { user: user || { id: "", email: "", name: "" }, isAuthenticated };
};

export default useAuth;
