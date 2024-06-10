import { validateLicensePlate } from '@/lib/plates';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { usStateName, stateNameValidator } from '@/lib/us-states';
import { Button } from '@/components/ui/button';
import LicensePlate from '@/components/license-plate';
import CommentsSection from '@/components/comments/comments-section';

export default async function Plate({
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const plateNumber = (searchParams?.plate as string) ?? null;
  const state = (searchParams?.state as string) ?? null;

  if (
    plateNumber === null ||
    state === null ||
    !(await validateLicensePlate(plateNumber, 'US')) ||
    !(await stateNameValidator(state))
  ) {
    return (
      <div className='container flex flex-col gap-5 py-10 items-center'>
        <p>Invalid plate number or state</p>
      </div>
    );
  }

  return (
    <div className='container flex flex-col gap-5 py-10 items-center'>
      <LicensePlate plateNumber={plateNumber} state={state} />
      <CommentsSection state={state} plateNumber={plateNumber} />
    </div>
  );
}
