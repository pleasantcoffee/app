import { TextInput, type TextInputProps } from "react-native";

export const Input: React.FC<TextInputProps> = ({ className, ...rest }) => {
  return (
    <TextInput
      autoCapitalize="none"
      autoCorrect={false}
      className={`rounded-md bg-white p-4 ${className}`}
      {...rest}
    />
  );
};
