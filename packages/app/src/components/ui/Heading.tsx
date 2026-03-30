import { Text, type TextProps } from "react-native";

export const Heading: React.FC<TextProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <Text
      className={`font-semibold text-3xl text-gray-900 ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
};
