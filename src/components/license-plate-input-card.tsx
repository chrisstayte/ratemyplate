import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import StatePicker from './state-picker';

export function validateLicensePlate(plate: string, country: string): boolean {
  let regex: RegExp;
  switch (country) {
    case 'US':
      regex = /^[A-Z0-9]{1,7}$/;
      break;
    case 'UK':
      regex = /^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$/;
      break;
    case 'DE':
      regex = /^[A-ZÄÖÜ]{1,3}-[A-Z]{1,2}\s[0-9]{1,4}$/;
      break;
    default:
      return false; // Unsupported country format
  }
  return regex.test(plate);
}

export default function LicensePlateInputCard() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Let's find em.</CardTitle>
        <CardDescription>Enter the plate number and state</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-8'>
        <div className='flex flex-col sm:flex-row gap-5'>
          <div className='flex flex-col gap-2 basis-1/2'>
            <Label>License Plate</Label>
            <Input className='w-full' />
          </div>
          <div className='basis-1/2'>
            <Label>State</Label>
            <StatePicker />
          </div>
        </div>
        <div className='w-full flex justify-end'>
          <Button>Search</Button>
        </div>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
}
