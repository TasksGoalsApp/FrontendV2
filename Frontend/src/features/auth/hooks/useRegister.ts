import axios from "axios";
import { register } from "../api/register";
import type { RegisterRequest } from "../types/auth.types";

export function useRegister() {
  // const navigate = useNavigate();

  const handleRegister = async (data: RegisterRequest) => {
    try {
      await register(data);
      // navigate("/login");
      return { success: true, message: "Registration successful." };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Registration failed. Please try again.";

        return { success: false, message };
      }

      return {
        success: false,
        message: "Unexpected error occurred.",
      };
    }
  };

  return { handleRegister };
}