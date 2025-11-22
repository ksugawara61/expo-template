import { useOAuth } from "@clerk/clerk-expo";
import type { OAuthStrategy } from "@clerk/types";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { Button } from "react-native-paper";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS === "web") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

interface Props {
  strategy: OAuthStrategy;
  children: React.ReactNode;
}

export const OAuthButton = ({ strategy, children }: Props) => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else {
        throw new Error("Failed to create session");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("エラー", "OAuth認証に失敗しました");
    }
  }, [startOAuthFlow]);

  return (
    <Button mode="contained" onPress={onPress}>
      {children}
    </Button>
  );
};
