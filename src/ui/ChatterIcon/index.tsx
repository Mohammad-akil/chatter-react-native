import { memo } from 'react';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { IconProps } from 'react-native-vector-icons/Icon';
import fontelloConfig from '~/assets/chatter-icons-config.json';

const Icon = createIconSetFromFontello(fontelloConfig, '', 'Chatter-Icons');

type ChatterIconProps = Omit<IconProps, 'name'> & {
  name: 'chatter-primary-logo' | 'x';
};

const ChatterIcon = (props: ChatterIconProps) => {
  return <Icon {...props} style={{ fontFamily: 'Chatter-Icons' }} name={props.name} />;
};

export default memo(ChatterIcon);
