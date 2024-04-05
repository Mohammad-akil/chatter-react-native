import { FC, memo, useCallback } from 'react';
import { Linking, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { ConversationViewTypes } from '~/entities/Conversations';
import { commonStyles } from '~/styles';
import { colorPalette, colors } from '~/styles/colors';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';

interface ConversationLinkComponentProps {
  conversationData: ConversationViewTypes;
  currentPartIndex: number;
}

const ConversationLinkComponent: FC<ConversationLinkComponentProps> = ({ conversationData, currentPartIndex }) => {
  const linkTo = useCallback(() => {
    //@ts-ignore
    Linking.openURL(conversationData.content[currentPartIndex].content.link?.link);
  }, [conversationData.content, currentPartIndex]);
  return (
    <TouchableOpacity style={styles.linkComponent} onPress={linkTo}>
      <Flex gap={4}>
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center' gap={5}>
          <Typography type='body' size='small' color='grey200' numberOfLines={1} style={styles.title}>
            {conversationData.content[currentPartIndex].content.link?.title}
          </Typography>
          <IconButton
            type='text'
            sizeOfIcon={16}
            style={commonStyles.zeroPadding}
            colorOfIcon={colorPalette.grey200}
            iconName='open-outline'
          />
        </Flex>
        <Flex>
          <Typography type='body' size='medium' numberOfLines={1}>
            {conversationData.content[currentPartIndex].content.link?.title}
          </Typography>
        </Flex>
        {conversationData.content[currentPartIndex].content.link?.description && (
          <Flex>
            <Typography type='body' size='small' color='grey300' numberOfLines={1}>
              {conversationData.content[currentPartIndex].content.link?.description}
            </Typography>
          </Flex>
        )}
      </Flex>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkComponent: {
    backgroundColor: colors.surface.surfaceComponent,
    width: '100%',
    padding: normalize(16),
    borderRadius: 6,
  },
  title: { maxWidth: '80%' },
});

export default memo(ConversationLinkComponent);
