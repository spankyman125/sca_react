import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Collapse, Fade } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react-lite';
import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../../api/http/Utilities';
import { AuthStatus, authStore } from '../../stores/AuthStore';
import { authUI } from '../../stores/ui/Auth/AuthUI';
import Loading from './Loading';
import UsersAPI from '../../api/http/Users';

// ie11 polyfills
// import 'formdata-polyfill';

function retrieveFormData(data: FormData) {
  const username = data.get('username') as string;
  const password = data.get('password') as string;
  const pseudonym = data.get('pseudonym') as string;
  const remember = data.get('remember') === 'true' ? true : false;
  const password_repeat = data.get('password_repeat') as string;

  return { username, password, pseudonym, remember, password_repeat };
}

const Auth = observer(() => {
  const navigate = useNavigate();
  switch (authStore.status) {
    case AuthStatus.Authorized:
      navigate('/app');
      break;
    case AuthStatus.Pending:
      return <Loading />;
    case AuthStatus.Unauthorized:
      break;
  }

  const handleSubmit = (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const { username, password, pseudonym, remember, password_repeat } =
      retrieveFormData(data);

    const signWithCreds = async () => {
      return authStore.login(username, password, remember).catch((error) => {
        if (error instanceof ApiError) {
          authUI.setError(true);
          if (error.response.status === 401)
            authUI.setHelperText('Wrong username of password');
          else if (error.response.status === 400)
            authUI.setHelperText('Wrong fields provided');
          else if (error.response.status === 500)
            authUI.setHelperText('Internal server error');
        }
      });
    };

    if (authUI.isSignUp)
      if (password === password_repeat)
        UsersAPI.createUser(username, password, pseudonym)
          .then(() => authStore.login(username, password, remember))
          .catch((error) => {
            if (error instanceof ApiError) {
              authUI.setError(true);
              switch (error.response.status) {
                case 400:
                  authUI.setHelperText('Wrong fields provided');
                  break;
                case 409:
                  authUI.setHelperText('Username already registered');
                  break;
                case 500:
                  authUI.setHelperText('Internal server error');
                  break;
              }
            }
          });
      else {
        authUI.setError(true);
        authUI.setHelperText('Passwords do not match');
      }
    else void signWithCreds();
  };

  return (
    <Fade in>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {authUI.isSignUp ? 'Sign up' : 'Sign in'}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <UsernameField />
            <PasswordField />
            <Collapse in={authUI.isSignUp}>
              <RepeatPasswordField />
            </Collapse>
            <Collapse in={authUI.isSignUp}>
              <PseudonymField />
            </Collapse>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <RememberCheckBox />
              <SignInUpButton />
            </Box>
            <SubmitButton />
          </Box>
        </Box>
      </Container>
    </Fade>
  );
});

const RememberCheckBox = observer(() => {
  return (
    <FormControlLabel
      control={<Checkbox value={true} name="remember" color="primary" />}
      label="Remember me"
    />
  );
});

const SignInUpButton = observer(() => {
  return (
    <Button
      variant="text"
      sx={{ mt: 3, mb: 2 }}
      onClick={() => {
        authUI.setIsSignUp(!authUI.isSignUp);
      }}
    >
      {authUI.isSignUp ? 'Sign In' : 'Sign Up'}
    </Button>
  );
});

const SubmitButton = observer(() => {
  return (
    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
      {authUI.isSignUp ? 'Sign up' : 'Sign in'}
    </Button>
  );
});

const UsernameField = observer(() => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      id="username"
      label="Username"
      name="username"
      autoComplete="username"
      autoFocus
      error={authUI.error}
      helperText={authUI.helperText}
    />
  );
});

const PasswordField = observer(() => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      name="password"
      label="Password"
      type="password"
      id="password"
      autoComplete="current-password"
      error={authUI.error}
    />
  );
});

const RepeatPasswordField = observer(() => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      name="password_repeat"
      label="Repeat password"
      type="password"
      id="password_repeat"
      autoComplete="current-password"
      error={authUI.error}
    />
  );
});

const PseudonymField = observer(() => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      id="pseudonym"
      label="Pseudonym"
      name="pseudonym"
      autoComplete="username"
      autoFocus
      error={authUI.error}
    />
  );
});

export default Auth;
