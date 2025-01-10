This document gives you the basic information of my Components. 
The code provided should give you enough to be able to understand on how to use this component.

# Theme 

Use the WihThemeProvider!
The theme is defined in the Color.ts file with an object with all the colors that are currently in the theme.
Might have to add more...

# WihView

Used like the View form React Native, but it already adds the background color based on the theme 
and provides a few basic features.

Here the code behind the WihView
```typescript
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

# WihText

Displays Text and applies the theme.

```typescript
export const WihText = ({children, style, ...rest}: TextProps) => {
    const theme = useWihTheme();

    return (
        <Text style={[{color: theme.text}, style]} {...rest}>{children}</Text>
    );
}
```

# WihTitle

Displays Text as a title and applies the theme

*Note: is not perfectly styled yet*

```typescript
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

# WihIcon

This is NOT a single component, it's more a collection of components to access different Icon provided like:

- FontAwesome
- Ionicons
- MaterialIcons
- MaterialCommunityIcons

To use those ask which one you need or just don't use a WihIcon Component and do it yourself.

# WihAvatar

Currently only able to display a simple Avatar with the first letter of the username.

```typescript
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

# WihInput

This is also more of a collection of different Inputs to use, 
but they are not finished yet, 
but you can ask me for them to use theme already if you want.