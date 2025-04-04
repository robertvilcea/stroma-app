import { useEffect } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import {
  useAuthRequest,
  makeRedirectUri,
  ResponseType,
} from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const clientId = require("../app.json").expo.extra.expoClientId;

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function LoginScreen() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      responseType: ResponseType.Token,
      scopes: ["openid", "profile", "email"],
      redirectUri: makeRedirectUri({
        scheme: "com.robertvilcea.stroma",
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      SecureStore.setItemAsync("userToken", access_token);
      Alert.alert("Success ✅", "Te-ai autentificat cu Google!");
    }
  }, [response]);

  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      <Text className="text-2xl font-bold mb-6 text-black">Login to STROMA</Text>
      <TouchableOpacity
        className="bg-black py-3 px-6 rounded-xl"
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Text className="text-white text-base font-semibold">Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}