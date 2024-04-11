import { authOptions } from '@/auth.config';
import { Session, getServerSession } from 'next-auth';
import React from 'react';
import SignIn from './sign-in';

type AuthenticationProps = {
  children: React.ReactNode;
  session: Session | null;
};
export const Authentication = (props: AuthenticationProps) => {

  if (!props.session) {
    return (
      <div
        style={{
          maxWidth: '920px',
          minHeight: '55vh',
          color: 'gray',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          margin: 'auto',
        }}
      >
        <p style={{ alignSelf: 'start' }}>
          You need be signed in before you can access this page
        </p>
        <SignIn
          provider={'github'}
          style={{
            maxWidth: '80px',
            border: '1px solid #333',
            borderRadius: '4px',
            padding: '4px 12px',
          }}
        />
      </div>
    );
  }
  
  return props.children;
};
