import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { router, Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { showError } from '@/lib/toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password || loading) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        showError(error)
        return
      }
      router.replace('/(app)/hoje')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-stretch justify-center py-10 gap-10">

            {/* Brand */}
            <View className="items-center gap-2">
              <Text className="font-mono text-[10px] uppercase tracking-[2.2px] text-ink-faint">
                Kairos
              </Text>
              <Text className="font-serif-italic text-4xl text-ink">
                Bem-vindo de volta.
              </Text>
              <Text className="font-mono text-[10px] uppercase tracking-[2.2px] text-ink-faint mt-1">
                καιρός · momento certo
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              <View className="gap-2">
                <Text className="font-mono text-[10px] uppercase tracking-[2.4px] text-ink-faint">
                  E-mail
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="você@email.com"
                  placeholderTextColor="#8d7f68"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="username"
                  autoComplete="email"
                  className="bg-surface border border-hairline rounded-xl px-4 py-3.5 text-base text-ink"
                />
              </View>

              <View className="gap-2">
                <Text className="font-mono text-[10px] uppercase tracking-[2.4px] text-ink-faint">
                  Senha
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#8d7f68"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  autoComplete="current-password"
                  className="bg-surface border border-hairline rounded-xl px-4 py-3.5 text-base text-ink"
                />
              </View>

              <Pressable
                onPress={handleLogin}
                disabled={loading || !email || !password}
                className={`rounded-full py-3.5 items-center ${loading || !email || !password ? 'bg-ink/40' : 'bg-ink active:bg-terracotta'}`}
              >
                <Text className="text-background font-sans-semi text-[15px]">
                  {loading ? 'Entrando…' : 'Entrar'}
                </Text>
              </Pressable>

              <View className="flex-row justify-center items-center pt-2 gap-1.5">
                <Text className="text-sm text-ink-muted">Não tem conta?</Text>
                <Link href="/(auth)/signup" asChild>
                  <Pressable>
                    <Text className="text-sm text-ink underline decoration-hairline">
                      Criar conta
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>

            {/* Footer */}
            <View className="items-center pt-4">
              <Text className="font-mono text-[10px] uppercase tracking-[2.4px] text-ink-faint">
                Estrutura externa · para seu cérebro
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
