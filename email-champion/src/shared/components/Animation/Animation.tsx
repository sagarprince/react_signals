import { ReactNode } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface IAnimationProps {
  children: ReactNode;
  duration?: number;
  easing?: string;
}

export default function Animation({ children, duration = 250, easing = 'ease-in-out' }: IAnimationProps) {
  const [ref] = useAutoAnimate({
    duration: duration,
    easing: easing,
    disrespectUserMotionPreference: false,
  });

  return <div ref={ref}>{children}</div>;
}
