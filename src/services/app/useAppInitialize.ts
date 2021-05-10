import { useContext, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { UserContext } from "../../store/user";
import useLocation from "../location/useLocation";

const useAppInitialize = () => {
  const postalCode = useLocation();
  const { setDataToStore } = useContext(UserContext);

  useEffect(() => {
    if (postalCode) {
      setDataToStore({ postalCode })
      SplashScreen.hide();
    };
  }, [postalCode]);
}

export default useAppInitialize;