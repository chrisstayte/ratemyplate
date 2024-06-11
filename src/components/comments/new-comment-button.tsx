'use client';

import * as React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import NewCommentForm from '@/components/comments/new-comment-form';

import { Plate } from '@/lib/plates';
import { useState } from 'react';

interface NewCommentButtonProps {
  className?: string;
  plate: Plate;
}

const NewCommentButton: React.FC<NewCommentButtonProps> = ({
  plate,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [comment, setComment] = useState('');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>New Comment</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>New Comment</DialogTitle>
            <DialogDescription>
              Let them know what you think about them.
            </DialogDescription>
          </DialogHeader>
          <NewCommentForm plate={plate} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>New Comment</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>New Comment</DrawerTitle>
          <DrawerDescription>
            Let them know what you think about them.
          </DrawerDescription>
        </DrawerHeader>
        <NewCommentForm plate={plate} className='px-4' />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NewCommentButton;
