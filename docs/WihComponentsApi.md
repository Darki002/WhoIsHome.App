# Wih Components

*NOTE: used from AI conversations*

This document gives you the basic information of my Components. 
The code provided should give you enough to be able to understand on how to use this component.

## Theme 

Use the WihThemeProvider!
The theme is defined in the Color.ts file with an object with all the colors that are currently in the theme.
Might have to add more...

## WihView

Used like the View form React Native, but it already adds the background color based on the theme 
and provides a few basic features.

Here the code behind the WihView
```typescript jsx
const WihView = ({style, center, gap, flex, lightColor, darkColor, ...otherProps}: ThemedViewProps) => {
    const theme = useWihTheme();

    const cStyle = center ? centerStyle[center] : {}
    const fStyle = flex ? flexStyle[flex] : {}
    const gStyle = gap ? {gap} : {};

    return <View style={[{backgroundColor: theme.background}, cStyle, fStyle, gStyle, style]} {...otherProps} />;
}

type CenterStyle = {
    full: ViewStyle;
    horizontal: ViewStyle;
    vertical: ViewStyle;
}

type FlexStyle = {
  row: ViewStyle;
  column: ViewStyle;
}

const flexStyle: FlexStyle = {
  row: {
    display: "flex",
    flexDirection: "row"
  },
  column: {
    display: "flex",
    flexDirection: "column"
  }
}
```

## WihText

Displays Text and applies the theme.

```typescript jsx
export const WihText = ({children, style, ...rest}: TextProps) => {
    const theme = useWihTheme();

    return (
        <Text style={[{color: theme.text}, style]} {...rest}>{children}</Text>
    );
}
```

## WihTitle

Displays Text as a title and applies the theme

*Note: is not perfectly styled yet*

```typescript jsx
export const WihTitle = ({children, style, ...rest}: TextProps) => {
    const theme = useWihTheme();

    const titleStyle: TextStyle = {
        marginTop: 10,
        fontWeight: "bold",
        fontSize: 20,
        color: theme.text
    }

    return (
        <Text style={[titleStyle, style]} {...rest}>{children}</Text>
    )
}
```

## WihInput

This is more of a collection of different Inputs to use. Ask me for more details about those inputs if you need them.
But more or less they are very predictable on how they are build.

Input Types:
- Text
- Password
- Email
- Username
- Date
- Time
- SingleChoice

# WihIcon

This is also more a collection of components to access different Icon provided like:

- FontAwesome
- Ionicons
- MaterialIcons
- MaterialCommunityIcons

To use those ask which one you need or just don't use a WihIcon Component and do it yourself.

## WihButton

Pretty much just a normal Pressable form react but with style

```typescript jsx
type WihButtonProps = {
    children: ReactNode;
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
};

export const WihButton: FC<WihButtonProps> = ({children, onPress, disabled = false, style, textStyle}) => {
    const theme = useWihTheme();

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: disabled ? theme.disabled : theme.primary },
                pressed && !disabled && { backgroundColor: theme.primary },
                style
            ]}
        >
            <Text style={[styles.text, { color: theme.buttonText }, textStyle]}>
                {children}
            </Text>
        </Pressable>
    );
};
```

## WihCollapsable

Use to make a view collapsable. Having a title to open and close it and the child content that is displaied when open.

```typescript jsx
export function WihCollapsible({children, title, isDefaultOpen = true}: PropsWithChildren & { title: string, isDefaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(isDefaultOpen);
    const theme = useWihTheme();

    return (
        <WihView>
            <TouchableOpacity
                style={[styles.heading, { backgroundColor: theme.background }]}
                onPress={() => setIsOpen((value) => !value)}
                activeOpacity={0.8}>
                <Ionicons
                    name={isOpen ? 'chevron-down' : 'chevron-forward-outline'}
                    size={18}
                    color={theme.icon}
                />
                <WihText style={styles.title}>{title}</WihText>
            </TouchableOpacity>
            {isOpen && <WihView style={styles.content}>{children}</WihView>}
        </WihView>
    );
}
```

## WihAvatar

Currently only able to display a simple Avatar with the first letter of the username.

```typescript jsx
export const WihAvatar = ({name, size, style}: AvatarProps) => {
    const theme = useWihTheme();

    const avatarSize = size ?? 40;
    const letter = name.length > 0 ? name[0].toUpperCase() : "";

    return (
        <WihView style={[{
            height: avatarSize,
            width: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: theme.primary,
        }, styles.avatar, style]}>
            <WihText style={[styles.letter, {
                fontSize: avatarSize / 2,
                color: theme.text,
                fontFamily: "Roboto"
            }]}>{letter}</WihText>
        </WihView>
    )
}

const styles = StyleSheet.create({
    avatar: {
        justifyContent: "center",
        alignItems: "center"
    },
    letter: {
        fontWeight: 'bold',
    }
});
```

