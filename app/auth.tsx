import { KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";



export default function AuthScreen() {
    return <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <View>
            <Text> Create Account</Text>

            <TextInput 
                label="Email" 
                autoCapitalize="none" 
                keyboardType="email-address"
                placeholder="example@gmail.com"></TextInput>
        </View>
    </KeyboardAvoidingView>
}