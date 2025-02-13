import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Input, Button, Layout, Typography, Divider } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const Resetpas = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { Title } = Typography;
  const { Content } = Layout;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.BACKEND_URL}/reset-password`,
        {
          email: data.email,
          otp: data.otp,
          newPassword: data.password,
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        navigate("/login");
      } else {
        alert(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred while resetting the password.");
      }
    }
  };
  return (
    <Layout className="bg-gray-400 min-h-screen">
      <Content className="h-screen flex items-center justify-center">
        <div className="bg-white p-8 m-8 rounded-lg shadow-lg w-full max-w-md">
          <Title level={2}>Reset Password</Title>
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
              label="OTP (One Time Password)"
              validateStatus={errors.otp ? "error" : ""}
              help={errors.password ? errors.otp.message : ""}
            >
              <Controller
                name="otp"
                control={control}
                defaultValue=""
                rules={{
                  required: "OTP is required",
                  minLength: {
                    value: 6,
                    message: "OTP must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter OTP"
                    prefix={<LockOutlined className="text-black" />}
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

            <Form.Item>
              <Button htmlType="submit" type="primary" className="w-full">
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Resetpas;
