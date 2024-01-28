import { useState } from 'react';
import './SendNotificationForm.css';

type FormStateData = {
  title?: string;
  body?: string;
  [index: string]: any;
};

type SendNotificationProps = {
  handleSendNotifications: (
    subscribers: any | any[],
    payload: any
  ) => Promise<void>;
  subscribers: any[];
  onClose: () => void;
};
export function SendNotificationForm(props: SendNotificationProps) {
  const [formFields, setFormFields] = useState<FormStateData>({});

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const target = e.currentTarget;
    const name = target.name;
    const value = target.value;

    setFormFields((formFields) => ({ ...formFields, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await props.handleSendNotifications(
        props.subscribers,
        formFields
      );
      console.log('handleFormSubmit: ', res);

      handleFormReset(e);
    } catch (err) {
      throw err;
    }
  };

  const handleFormReset = (e: React.FormEvent) => {
    e.preventDefault();

    const newFormData: any = {};

    for (let key in formFields) {
      newFormData[key] = '';
    }

    setFormFields(newFormData);
    props.onClose();
  };

  return (
    <>
      <section className=''>
        <form
          onSubmit={handleFormSubmit}
          id='sendNotificationForm'
          name='sendNotificationForm'
          className='sendNotificationForm'
        >
          <div className='header'>
            <span onClick={props.onClose} className=''>
              x
            </span>
            <h3>Send a notification</h3>
          </div>

          <label htmlFor='title'>
            <input
              type='text'
              id='title'
              name='title'
              value={formFields.title}
              placeholder='Enter title'
              onChange={handleChange}
              required
            />
          </label>

          <br />
          <label htmlFor='body'>
            <textarea
              cols={40}
              id='body'
              name='body'
              value={formFields.body}
              placeholder='Enter body content'
              onChange={handleChange}
              required
            />
          </label>
          <br />

          <div className='flex space-x-10'>
            <button type='submit'>Send</button>
            <button
              type='button'
              onClick={handleFormReset}
              className='cancelbtn'
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
