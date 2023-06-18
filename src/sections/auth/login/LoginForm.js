import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components  
import Iconify from '../../../components/iconify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';

export default function LoginForm(props) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");


  //关闭提示框
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {

    setOpen(false);
  };

  const handleClick = async () => {
    const user = { "email": userName, "password": password }
    await axios.post('/api/userquery', user, {
      headers: {
        "Content-Type": 'application/json'
      }
    }).then((res) => {
      if (res.data.code !== 200) {
        setOpen(true);
      } else {
        navigate('/dashboard', { replace: true });
      }
    })


  };

  const _userNameTextFieldChange = (e) => {
    setUserName(e.target.value);
  }
  const _passwordTextFieldChange = (e) => {
    setPassword(e.target.value);
  }

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label={props.role === 0 ? "用户名" : "管理员"} value={userName} onChange={_userNameTextFieldChange} />

        <TextField
          name="password"
          label="密码"
          type={showPassword ? 'text' : 'password'}
          value={password} onChange={_passwordTextFieldChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="记住密码" />
        <Link variant="subtitle2" underline="hover">
          忘记密码了?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        登陆
      </LoadingButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"错误提示"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            用户名或密码错误！
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            取消
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
