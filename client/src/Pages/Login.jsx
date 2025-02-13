import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Form,
  Input,
  Button,
  Layout,
  Typography,
  Divider,
  Spin,
  Alert,
} from "antd";
import { MailOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { LoginRequest } from "../requests/request";
import { Chatstate } from "../Context/Chatprovider";

const Login = () => {
  const { setUser } = Chatstate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { Title } = Typography;
  const { Content } = Layout;
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // State for alerts

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await LoginRequest(data);
      setUser(response.data.user);
      setAlert({ type: "success", message: "Logged In successfully!" });
      navigate("/");
    } catch (error) {
      if (error.response) {
        // Server returned an error response
        setAlert({
          type: "error",
          message: error.response.data.error || "Login failed",
        });
      } else {
        // Other errors (e.g., network errors)
        setAlert({
          type: "error",
          message: "An error occurred during login. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="bg-gray-400 min-h-screen">
      <Content className="h-screen flex items-center justify-center">
        <div className="bg-white p-8 m-8 rounded-lg shadow-lg w-full max-w-md">
          <Spin
            indicator={<LoadingOutlined spin />}
            size="large"
            spinning={loading}
          >
            <div>
              <Title level={2}>Login</Title>
              {alert && (
                <Alert
                  message={alert.message}
                  type={alert.type}
                  showIcon
                  className="mb-4"
                />
              )}
              <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                  label="Email"
                  validateStatus={errors.email ? "error" : ""}
                  help={errors.email ? errors.email.message : ""}
                >
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^@]+@[^@]+\.[^@]+$/,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter email"
                        type="email"
                        prefix={<MailOutlined className="text-black" />}
                      />
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  validateStatus={errors.password ? "error" : ""}
                  help={errors.password ? errors.password.message : ""}
                >
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Enter password"
                        prefix={<LockOutlined className="text-black" />}
                      />
                    )}
                  />
                </Form.Item>

                <Divider orientation="center" style={{ borderColor: "black" }}>
                  OR
                </Divider>

                <Link to={"/signup"}>
                  <p className="text-blue-400 mb-5 text-center">
                    Create account?
                  </p>
                </Link>
                <Link to={"/forgot-password"}>
                  <p className="text-blue-400 mb-5 text-center">
                    Forgot password?
                  </p>
                </Link>

                <Form.Item>
                  <Button htmlType="submit" type="primary" className="w-full">
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Spin>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
