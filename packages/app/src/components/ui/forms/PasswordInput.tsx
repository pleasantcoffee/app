import { EyeClosedIcon, EyeIcon } from "phosphor-react-native";
import { useState } from "react";
import { Pressable, TextInput, type TextInputProps, View } from "react-native";

export const PasswordInput: React.FC<TextInputProps> = ({
  className,
  ...rest
}) => {
  const [isPasswordHidden, setPasswordHidden] = useState<boolean>(true);

  return (
    <View
      className={`flex-row justify-between rounded-md bg-white p-4 ${className}`}
    >
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Enter your password"
        secureTextEntry={isPasswordHidden}
        textContentType="password" // iOS
        autoComplete="password" // Android
        className="flex-1"
        {...rest}
      />
      <Pressable onPress={() => setPasswordHidden(!isPasswordHidden)}>
        {isPasswordHidden ? <EyeIcon /> : <EyeClosedIcon />}
      </Pressable>
    </View>
  );
};
