import { memo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import Skeleton from '~/ui/Skeleton';
import { normalize } from '~/utils/normalize';

const SkeletonComponent = () => {
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <Flex flex={1} style={commonStyles.baseScreenPadding}>
        <Flex flexDirection='row' alignItems='center' justifyContent='space-between' style={styles.skeletonHeader}>
          <Skeleton width='50%' height={20} borderRadius={6} />
          <Flex gap={5} flexDirection='row'>
            <Skeleton width={40} height={40} borderRadius={40} />
            <Skeleton width={40} height={40} borderRadius={40} />
            <Skeleton width={40} height={40} borderRadius={40} />
          </Flex>
        </Flex>
        <Flex flex={1} justifyContent='center' alignItems='center'>
          <Skeleton width={120} borderRadius={120} height={120} />
        </Flex>
        <Flex flexDirection='row' justifyContent='center' gap={2} style={styles.skeletonFooter}>
          <Skeleton width={80} borderRadius={80} height={80} />
          <Skeleton width={80} borderRadius={80} height={80} />
          <Skeleton width={80} borderRadius={80} height={80} />
          <Skeleton width={80} borderRadius={80} height={80} />
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  skeletonHeader: { paddingTop: normalize(10) },
  skeletonFooter: { paddingBottom: normalize(40) },
});

export default memo(SkeletonComponent);
