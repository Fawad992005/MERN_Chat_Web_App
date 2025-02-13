import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Input, Button, Layout, Typography, Divider } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Forgotpass = () => {
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
        `${import.meta.env.VITE_BACKEND_URL}:3000/forgot-password`,
        { email: data.email }
      );
      console.log(response);
      if (response.status === 200) {
        alert(response.data.message);
        navigate("/reset-password");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while resetting the password.");
    }
  };
  return (
    <Layout className="bg-gray-400 min-h-screen">
      <Content className="h-screen flex items-center justify-center">
        <div className="bg-white p-8 m-8 rounded-lg shadow-lg w-full max-w-md">
          <Title level={2}>Forgot Password</Title>
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

            <Form.Item>
              <Button htmlType="submit" type="primary" className="w-full">
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Forgotpass;
