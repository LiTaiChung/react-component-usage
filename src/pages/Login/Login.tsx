import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/elements/card';

const Login = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
