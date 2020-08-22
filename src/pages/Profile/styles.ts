import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px 32px;
  position: relative;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 32px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  left: 8px;
  padding: 16px;
`;

export const SignOutButton = styled.TouchableOpacity`
  height: 50px;
  width: 100%;

  justify-content: center;
  align-items: center;
`;

export const SignOutButtontext = styled.Text`
  font-family: 'RobotSlab-Regular';
  font-size: 16px;
  color: #f4ede8;
`;
