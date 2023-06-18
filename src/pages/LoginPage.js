import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
import { useState } from 'react'
// sections
import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));



const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const [role, setRole] = useState(0);
  //切换登陆面板
  const switchboard = (value) => {
    setRole(value)
  }

  return (
    <>
      <Helmet>
        <title> 商城登陆 </title>
      </Helmet>

      <StyledRoot>

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              登陆
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              如果您没有账号? {''}
              <Link variant="subtitle2">请注册</Link>
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button onClick={() => switchboard(0)} fullWidth size="large" color="inherit" variant="outlined">

                普通用户
              </Button>

              <Button onClick={() => switchboard(1)} fullWidth size="large" color="inherit" variant="outlined">

                管理员
              </Button>

            </Stack>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <LoginForm role={role} />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
