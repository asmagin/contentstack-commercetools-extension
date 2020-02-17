import { useEffect } from 'react';

export const UseEffectHookWrapper = (props: any) => {
  const callbackWrapper = () => {
    props.callback();
    setTimeout(() => props.callback(), 200);
  };

  useEffect(callbackWrapper);
  return null;
};
