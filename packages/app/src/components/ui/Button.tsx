import { Pressable, type PressableProps, Text } from "react-native";

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <Pressable
      className={`flex items-center rounded-md bg-blue-500 p-4 text-white ${className}`}
      {...rest}
    >
      <Text className="text-white">{children}</Text>
    </Pressable>
  );
};
