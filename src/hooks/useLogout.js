import { useNavigate } from "react-router-dom";

function useLogout() {
  const navigate = useNavigate();

  const logout = async () => {
    navigate("/");
  };

  return logout;
}

export default useLogout;
