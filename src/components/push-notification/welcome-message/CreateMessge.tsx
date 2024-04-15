import {
  SubscriberWelcomeMessageType,
  handlerCreateSubscriberWelcomeMessage,
} from '@/app/actions';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { z } from 'zod';

export const zodSchema = z.object({
  id: z.string(),
  title: z.string().min(2, { message: 'Must be two or more characters long' }),
  body: z.string().min(10, { message: 'Must be two or more characters long' }),
  // icon: z.string().url({ message: 'Must be a valid url ' }),
  // image: z.string().url({ message: 'Must be a valid url ' }),
});

export type WelcomeMessageProps = {
  subscribersWelcomMsg: SubscriberWelcomeMessageType[];
  setIsSubmitting: (args: boolean) => void;
  setShowForm: (args: boolean) => void;
  isSubmitting: boolean;
  showForm: boolean;
};

export function CreateMessge(props: WelcomeMessageProps) {
  const { pending } = useFormStatus();
  const { body, icon, image, title } = props.subscribersWelcomMsg[0];

  const handleFormData = async (formData: FormData) => {
    props.setIsSubmitting(true);

    try {
      const validatedformData = zodSchema.parse({
        title: formData.get('title'),
        body: formData.get('body'),
        icon: formData.get('icon'),
        image: formData.get('image'),
      });
      const clonedValidatedFields = Object.create(validatedformData);
      const encodedPairs = [];

      for (let key in clonedValidatedFields) {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(clonedValidatedFields[key]);
        encodedPairs.push(
          `${encodedKey.toLowerCase()}=${encodedValue.toLowerCase()}`
        );
      }

      const { data } = await handlerCreateSubscriberWelcomeMessage(
        encodedPairs.join('&')
      );

      if (data !== undefined && typeof data !== 'string') {
        props.setIsSubmitting(false);
        props.setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ErrorBoundary
      fallback={
        <p style={{ fontWeight: 400, fontSize: '22px', color: '#333' }}>
          There was an error while submitting the form...
        </p>
      }
    >
      <div className='form'>
        <h4>Personalise a default message for Push Subscribers </h4>
        <form action={handleFormData}>
          <label htmlFor='title'>
            <input
              className='input'
              type='text'
              name='title'
              id='title'
              placeholder='Enter title'
              value={title}
              disabled={pending}
            />
          </label>
          <label htmlFor='icon'>
            <input
              className='input'
              type='text'
              name='icon'
              id='icon'
              value={icon}
              placeholder='Enter url for icon to use'
              disabled={pending}
            />
          </label>
          <label htmlFor='image'>
            <input
              className='input'
              type='text'
              name='image'
              id='image'
              value={image}
              placeholder='Enter url for image to use'
              disabled={pending}
            />
          </label>
          <label htmlFor='description'>
            <textarea
              name='body'
              id='body'
              cols={30}
              rows={10}
              maxLength={200}
              value={body}
              placeholder='Enter a description'
              disabled={pending}
            ></textarea>
          </label>

          <div style={{ display: 'flex', gap: '24px' }}>
            <button className='btn send' type='submit' disabled={pending}>
              {props.isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            {props.showForm && (
              <button
                className='btn cancel'
                type='submit'
                onClick={() => props.setShowForm(!props.showForm)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
}
