import { memo } from 'react';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import Skeleton from '~/ui/Skeleton';

const ConversationsListSkeleton = () => {
  return (
    <Flex flexDirection='row' gap={30} style={commonStyles.baseScreenPadding}>
      <Skeleton width={65} height={60} borderRadius={60} />
      <Skeleton width={65} height={60} borderRadius={60} />
      <Skeleton width={65} height={60} borderRadius={60} />
      <Skeleton width={65} height={60} borderRadius={60} />
      <Skeleton width={65} height={60} borderRadius={60} />
    </Flex>
  );
};

export default memo(ConversationsListSkeleton);
