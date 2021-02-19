import styled from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { FlatList } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import { IProvider } from './index';

interface IProviderContainer {
  selected?: boolean;
}

interface IProviderName {
  selected?: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  background: #28262e;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding-top: ${getStatusBarHeight() + 16}px;
`;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  color: #f5ede8;
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;
  margin-left: 16px;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const ProvidersListContainer = styled.View`
  height: 112px;
`;

export const ProvidersList = styled(FlatList as new () => FlatList<IProvider>)`
  padding: 32px 24px 16px;
`;

export const ProviderContainer = styled(RectButton)<IProviderContainer>`
  background: ${props => (props.selected ? '#ff9000' : '#3e3b47')};
  flex-direction: row;
  padding: 8px 12px;
  align-items: center;
  margin-right: 16px;
  border-radius: 10px;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const ProviderName = styled.Text<IProviderName>`
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
  color: ${props => (props.selected ? '#232129' : '#f4ede8')};
  margin-left: 8px;
`;
