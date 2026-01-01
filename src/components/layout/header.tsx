import type { FC, ReactNode } from 'react';
import { ListChecks } from 'lucide-react';

type HeaderProps = {
  addTaskTrigger: ReactNode;
};

const Header: FC<HeaderProps> = ({ addTaskTrigger }) => {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <ListChecks className="h-7 w-7 text-primary" />
          <h1 className="font-headline text-2xl font-bold tracking-tight">
            Task Tracker
          </h1>
        </div>
        {addTaskTrigger}
      </div>
    </header>
  );
};

export default Header;
