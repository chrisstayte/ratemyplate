import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usStateName } from '@/lib/us-states';

interface LicensePlateProps {
  state?: string;
  plateNumber: string;
  className?: string;
}

const LicensePlate: React.FC<LicensePlateProps> = ({
  state,
  plateNumber,
  className,
}) => {
  return (
    <Card
      className={`flex flex-col items-center h-full max-h-52 relative w-full max-w-96 p-3 aspect-video ${className}`}>
      {state && <Badge className='text-xl'>{usStateName(state)}</Badge>}
      <div className='absolute inset-0 flex items-center justify-center uppercase'>
        <p className='text-4xl'>{plateNumber}</p>
      </div>
    </Card>
  );
};

export default LicensePlate;
