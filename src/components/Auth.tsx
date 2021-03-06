import React from 'react';
import { useState } from 'react';
import axios from "axios";
import { Form, Input, Button, Modal, message, Space } from 'antd';
import { Modal as MobileModal, Form as MobileForm } from 'antd-mobile';
import { isMobile } from 'react-device-detect';

interface AuthProps {
    username : string,
    saveUsername: any, 
    getUserConfig: any
}

const Auth: React.FC<AuthProps> = (props: AuthProps) => {
  const handleLoginClick = async (event: any) => {
    await axios
      .post(process.env.REACT_APP_API_URL + '/api/user/auth', {
          username: event.username,
          password: event.password,
      }, {
        withCredentials: true,
      })
      .then(async (_response) => {
        const { username }= await props.getUserConfig();
        props.saveUsername(username);
        setIsLoginVisible(false);
        message.success('Logged in successfully');
      })
      .catch((error) => {
        if (error.response.status === 400) {
          message.error('Incorrect username or password');
        }
      });
      setLoading(false);
      loginForm.resetFields();
  }
  
  const handleLogoutClick = async(event: any) => {
    setLoading(true);
    await axios
      .post(process.env.REACT_APP_API_URL + '/api/user/logout', {}, {
        withCredentials: true
      })
      .then(response => {
        props.saveUsername('');
        message.success('Logged out successfully');
      })
      .catch((error) => {
        if (error.response.status === 400) {
          window.location.reload()
        }
      });
      setLoading(false);
      setIsLoginVisible(false);
  }

  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const onCancel = () => {
    setIsLoginVisible(false);
    setLoading(false);
    loginForm.resetFields();
  }

  const showModal = () => {
    setIsLoginVisible(true);
  };
  const [loginForm] = Form.useForm();
  if (!isMobile) {
    if (props.username === '') {
      return (
      <>
        <Button 
          type="primary"
          onClick={showModal}
        >
          Login or Signup
        </Button>
        <Modal title="Login or Sign up" footer = {null} visible={isLoginVisible} onCancel={onCancel}>
          <Form
            form={loginForm}
            name="Login or Sign up"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={handleLoginClick}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
      );
    } else {
      return (
        <Space>
          {props.username}
          <Button type = "primary" onClick={handleLogoutClick}>Logout</Button>
        </Space>
      )
    }
  } else {
    if (props.username === '') {
      return (
      <>
        <Button 
          type="primary"
          onClick={showModal}
        >
          Login or Signup
        </Button>
        <MobileModal
          title="Login or Sign up"
          visible={isLoginVisible}
          closeOnMaskClick={true}
          onClose={onCancel}
          content={
            <MobileForm
              form={loginForm}
              name="Login or Sign up"
              initialValues={{ remember: true }}
              onFinish={handleLoginClick}
            >
              <MobileForm.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </MobileForm.Item>

              <MobileForm.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </MobileForm.Item>

              <MobileForm.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </MobileForm.Item>
            </MobileForm>
          }
        >
        </MobileModal>
      </>
      );
    } else {
      return (
        <Space>
        {props.username}
        <Button type = "primary" onClick={handleLogoutClick}>Logout</Button>
        </Space>
      )
    }
  }
};
export default Auth;


