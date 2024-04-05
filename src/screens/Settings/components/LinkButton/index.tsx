import { FC, memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colorPalette } from '~/styles/colors';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';

interface ILinkButton {
  title: string;
  subtitle?: string;
  navigateTo: () => void;
  oneLine?: boolean;
  disabled?: boolean;
}

const LinkButton: FC<ILinkButton> = ({ title, subtitle, navigateTo, oneLine, disabled = false }) => {
  if (oneLine) {
    return (
      <TouchableOpacity disabled={disabled} onPress={navigateTo}>
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Flex justifyContent='center' style={styles.titleContainer}>
            <Typography color={disabled ? 'grey300' : 'white'} type='label' size='large'>
              {title}
            </Typography>
          </Flex>
          <Flex flexDirection='row' gap={8} alignItems='center' justifyContent='flex-end'>
            <Flex style={styles.infoContainer}>
              {subtitle && (
                <Typography type='body' size='default' color='grey300' numberOfLines={1}>
                  {subtitle}
                </Typography>
              )}
            </Flex>
            <Flex>
              <Icon name='chevron-forward-outline' size={20} color={colorPalette.grey300} />
            </Flex>
          </Flex>
        </Flex>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity disabled={disabled} onPress={navigateTo}>
      <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Flex gap={4} justifyContent='center' style={styles.infoContainer}>
          <Typography color={disabled ? 'grey300' : 'white'} type='label' size='large'>
            {title}
          </Typography>
          {subtitle && (
            <Typography type='body' size='default' color='grey300'>
              {subtitle}
            </Typography>
          )}
        </Flex>
        <Icon name='chevron-forward-outline' size={20} color={colorPalette.grey300} />
      </Flex>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    maxWidth: '80%',
  },
  titleContainer: { maxWidth: '50%' },
});
export default memo(LinkButton);
