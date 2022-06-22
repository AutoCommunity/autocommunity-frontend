import React from 'react';
import axios from "axios";
import { Form, Input, Button, message, DatePicker } from 'antd';

interface AddEventFormProps {
    marker: any,
    selectMarker: any,
    setAddingEvent: any,
    updateEvents: any,
}

const { RangePicker } = DatePicker;

const rangeConfig = {
    rules: [{ type: 'array' as const, required: true, message: 'Please select time!' }],
  };

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

const AddEventForm: React.FC<AddEventFormProps> = (props: AddEventFormProps) => {
  const handleAddEvent = async (event: any) => {
    const dateTimeValue = event['date-time-picker'];
    const startDate = dateTimeValue[0].format(dateTimeFormat);
    const endDate = dateTimeValue[1].format(dateTimeFormat);

    await axios
      .post(process.env.REACT_APP_API_URL + '/api/event/create', {
          markerId: props.marker.id,
          name: event.name,
          description: event.description,
          privacyType: 'PUBLIC',
          startDate: startDate,
          endDate: endDate
      }, {
        withCredentials: true,
      })
      .then((response) => {
          props.setAddingEvent(false);
          props.selectMarker(props.marker);
          props.updateEvents();
      })
      .catch((error) => {
        message.warning('Please login to be able to create events');
      });
      form.resetFields();
  }

  const [form] = Form.useForm();
  return (
    <>
        <Form
          form={form}
          name="Add event"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={handleAddEvent}
          autoComplete="off"
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input name of event!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please input description of event!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item name="date-time-picker" label="Pick dates" {...rangeConfig}>
                <RangePicker showTime format={dateTimeFormat} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                Add event
                </Button>
            </Form.Item>
        </Form>
    </>
    );
};
export default AddEventForm;


