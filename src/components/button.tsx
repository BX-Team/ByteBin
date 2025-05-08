import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  primary?: boolean;
};

export function Button({ children, primary, ...props }: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-3 py-1.5 text-sm rounded-md transition-all cursor-pointer border ${
        primary
          ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary/30 hover:border-primary shadow-sm hover:shadow'
          : 'bg-secondary hover:bg-secondary/80 border-border/50 hover:border-border shadow-sm hover:shadow'
      } focus:outline-none focus:ring-2 focus:ring-ring/30 active:scale-[0.98]`}
      {...props}
    >
      {children}
    </button>
  );
}
