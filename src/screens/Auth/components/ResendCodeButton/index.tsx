import { type FC, useEffect, useMemo, useState, memo, useCallback } from 'react';
import Button from '~/ui/Button';

export type ResendCodeButtonProps = {
  onResend?: () => void;
  seconds: number;
};

const ResendCodeButton: FC<ResendCodeButtonProps> = ({ onResend, seconds = 0 }) => {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const [restart, setRestart] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (seconds > 0) {
      interval = setInterval(() => {
        setSecondsLeft((left) => {
          if (left === 1 && interval) {
            clearInterval(interval);
          }

          return left - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [restart, seconds]);

  const onPress = useCallback(() => {
    onResend?.();
    setRestart((prev) => {
      if (prev > 5) {
        return 0;
      } else {
        return prev + 1;
      }
    });
    setSecondsLeft(seconds);
  }, [seconds, onResend]);

  const title = useMemo(() => {
    if (secondsLeft > 0) {
      return `Resend code in ${secondsLeft}s`;
    }

    return 'Resend code';
  }, [secondsLeft]);

  return <Button text={title} disabled={!!secondsLeft} onPress={onPress} />;
};

export default memo(ResendCodeButton);
