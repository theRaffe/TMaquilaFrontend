import { useSession } from "@/context/useSession";
import { LoginForm } from ".";
import { SignInProps } from "./types";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/models";

interface State extends SnackbarOrigin {
  open: boolean;
}
function LoginPage() {
  const { signUp, signIn, checkUser } = useSession();
  const navigate = useNavigate();
  const [stateError, setStateError] = useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const [stateNewUser, setStateNewUser] = useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open: openErrorAlert } = stateError;
  const {
    vertical: verticalSuccess,
    horizontal: horizontalSuccess,
    open: openSuccess,
  } = stateNewUser;

  const signInWithEmail = async ({
    email,
    password,
    setIsLoading,
  }: SignInProps) => {
    setIsLoading(true);
    // setMessageError(undefined);
    setStateError({ ...stateError, open: false });
    setStateNewUser({ ...stateNewUser, open: false });

    const isExists = await checkUser(email);
    if (isExists) {
      const authError = await signIn(email, password);
      console.log({ authError });
      if (authError) {
        console.log({ error: authError.message, code: authError.code });
        setStateError({ ...stateError, open: true });
      } else {
        console.log("Login Success!! redirect ");
        navigate( `/${PrivateRoutes.PRIVATE}`, { replace: true });
      }
    } else {
      const authError = await signUp(email, password);
      console.log({ authError });
      if (authError) {
        console.log({ error: authError.message, code: authError.code });
        setStateError({ ...stateError, open: true });
      } else {
        setStateNewUser({ ...stateNewUser, open: true });
        navigate(`/${PrivateRoutes.PRIVATE}`, { replace: true });
      }
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setStateError({ ...stateError, open: false });
  };

  const handleClose2 = () => {
    setStateNewUser({ ...stateNewUser, open: false });
  };
  return (
    <>
      <LoginForm submitLoginHandler={signInWithEmail} />
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openErrorAlert}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Fail login inside a Snackbar!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSuccess}
        key={"success" + verticalSuccess + horizontalSuccess}
      >
        <Alert
          onClose={handleClose2}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          New User created!
        </Alert>
      </Snackbar>
    </>
  );
}

export default LoginPage;
