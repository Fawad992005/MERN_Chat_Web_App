import { React, useState } from "react";
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
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { SignUpRequest } from "../requests/request";

const Signup = () => {
  const [loading, setloading] = useState(false);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { Title } = Typography;
  const { Content } = Layout;

  const onSubmit = async (data) => {
    try {
      setloading(true);
      await SignUpRequest(data);

      setAlert({ type: "success", message: "Signed Up successfully!" });
      reset(); // Reset the form fields after successful submission
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
      setloading(false);
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
            <Title level={2}>Signup</Title>
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
                label="Username"
                validateStatus={errors.username ? "error" : ""}
                help={errors.username ? errors.username.message : ""}
              >
                <Controller
                  name="username"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Username is required",
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Username"
                      prefix={<UserOutlined className="text-black" />}
                    />
                  )}
                />
              </Form.Item>

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

              <Form.Item
                label="Confirm Password"
                validateStatus={errors.conpassword ? "error" : ""}
                help={errors.conpassword ? errors.conpassword.message : ""}
              >
                <Controller
                  name="conpassword"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Confirm Password is required",
                    validate: {
                      matchesPreviousPassword: (value, { password }) =>
                        value === password || "Passwords do not match",
                    },
                  }}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      placeholder="Confirm password"
                      prefix={<LockOutlined className="text-black" />}
                    />
                  )}
                />
              </Form.Item>

              <Divider orientation="center" style={{ borderColor: "black" }}>
                OR
              </Divider>

              <Link to={"/login"}>
                <p className="text-blue-400 mb-5 text-center">
                  Already have an account?
                </p>
              </Link>

              <Form.Item>
                <Button htmlType="submit" type="primary" className="w-full">
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Content>
    </Layout>
  );
};

export default Signup;
