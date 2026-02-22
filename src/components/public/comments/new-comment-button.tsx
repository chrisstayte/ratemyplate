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

import NewCommentForm, {
  ExistingReview,
} from '@/components/public/comments/new-comment-form';

import { Plate } from '@/lib/plates';
import { useState } from 'react';

interface NewCommentButtonProps {
  className?: string;
  plate: Plate;
  existingReview?: ExistingReview;
}

const NewCommentButton: React.FC<NewCommentButtonProps> = ({
  plate,
  className,
  existingReview,
}) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const isEditing = !!existingReview;
  const buttonLabel = isEditing ? 'Edit Review' : 'Add a Review';
  const dialogTitle = isEditing ? 'Edit Review' : 'Add a Review';
  const dialogDescription = isEditing
    ? 'Update your rating and comment.'
    : 'Rate this driver and share your experience.';

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>{buttonLabel}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <NewCommentForm
            plate={plate}
            onClose={() => setOpen(false)}
            existingReview={existingReview}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>{buttonLabel}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{dialogTitle}</DrawerTitle>
          <DrawerDescription>{dialogDescription}</DrawerDescription>
        </DrawerHeader>
        <NewCommentForm
          plate={plate}
          onClose={() => setOpen(false)}
          existingReview={existingReview}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NewCommentButton;
