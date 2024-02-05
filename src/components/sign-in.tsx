'use client';

import { BuiltInProviderType } from 'next-auth/providers/index';
import {
  LiteralUnion,
  SignInAuthorizationParams,
  SignInOptions,
  signIn,
} from 'next-auth/react';

type SignInProps = {
  provider?: LiteralUnion<BuiltInProviderType> | undefined;
  options?: SignInOptions | undefined;
  authorizationParams?: SignInAuthorizationParams | undefined;
  style?: React.CSSProperties;
};
/**
 * This is a Signin component
 * @param props
 * @returns
 */
export default function SignIn(props: SignInProps) {
  return (
    <button
      style={props.style}
      onClick={() =>
        signIn(props.provider, { ...props.options }, props.authorizationParams)
      }
    >
      Sign in
    </button>
  );
}
