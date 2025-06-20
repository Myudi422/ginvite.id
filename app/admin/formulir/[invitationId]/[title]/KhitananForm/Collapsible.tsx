'use client';

import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export function Collapsible({ title, children }: CollapsibleProps) {
  return (
    <Disclosure as="div" className="border rounded-lg">
      {({ open }) => (
        <>
          <Disclosure.Button
            className="flex justify-between w-full px-4 py-2 text-left font-medium bg-gray-100 hover:bg-gray-200 rounded-t-lg"
          >
            <span>{title}</span>
            <ChevronDown
              className={`w-5 h-5 transform transition-transform ${
                open ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pb-4 space-y-4">
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
